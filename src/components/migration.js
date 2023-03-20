
import protobuf from 'protobufjs';
import base32 from 'base32-encoding';
import secure_storage from '../rematch/secure_storage';
import * as BUFFERS from 'buffer';
const Buffer = BUFFERS.Buffer;
global.Buffer = global.Buffer || require('buffer').Buffer
const ALGORITHM = {
    0: "unspecified",
    1: "sha1",
    2: "sha256",
    3: "sha512",
    4: "md5",
};

const DIGIT_COUNT = {
    0: "unspecified",
    1: 6,
    2: 8,
};

const OTP_TYPE = {
    0: "unspecified",
    1: "hotp",
    2: "totp",
};

const PROTO = `
syntax = "proto3";

message MigrationPayload {
  enum Algorithm {
    ALGORITHM_UNSPECIFIED = 0;
    ALGORITHM_SHA1 = 1;
    ALGORITHM_SHA256 = 2;
    ALGORITHM_SHA512 = 3;
    ALGORITHM_MD5 = 4;
  }

  enum DigitCount {
    DIGIT_COUNT_UNSPECIFIED = 0;
    DIGIT_COUNT_SIX = 1;
    DIGIT_COUNT_EIGHT = 2;
  }

  enum OtpType {
    OTP_TYPE_UNSPECIFIED = 0;
    OTP_TYPE_HOTP = 1;
    OTP_TYPE_TOTP = 2;
  }

  message OtpParameters {
    bytes secret = 1;
    string name = 2;
    string issuer = 3;
    Algorithm algorithm = 4;
    DigitCount digits = 5;
    OtpType type = 6;
    int64 counter = 7;
  }

  repeated OtpParameters otp_parameters = 1;
  int32 version = 2;
  int32 batch_size = 3;
  int32 batch_index = 4;
  int32 batch_id = 5;
}`

const parser = (sourceUrl) => {
    if (typeof sourceUrl !== "string") {
        throw new Error("source url must be a string");
    }

    if (sourceUrl.indexOf("otpauth-migration://offline") !== 0) {
        throw new Error(
            "source url must be begun with otpauth-migration://offline"
        );
    }

    const sourceData = new URL(sourceUrl).searchParams.get("data");

    if (!sourceData) {
        throw new Error("source url doesn't contain otpauth data");
    }

    const protobufRoot = protobuf.parse(PROTO, { keepCase: true }).root;
    const secretParser = (secret) => {
        return Buffer.from(secret).toString("base64");
    };
    const migrationPayload = protobufRoot.lookupType("MigrationPayload");
    const decodedOtpPayload = migrationPayload.decode( Buffer.from(sourceData, "base64")  );
    console.log(decodedOtpPayload.otp_parameters)
    const otp_parametersArr = Array.from(decodedOtpPayload.otp_parameters);
    return otp_parametersArr.map((otp_parameters) => {
        return {
            secret: base32.stringify(otp_parameters.secret),
            name: otp_parameters.name,
            issuer: otp_parameters.issuer,
            algorithm: ALGORITHM[otp_parameters.algorithm],
            digits: DIGIT_COUNT[otp_parameters.digits],
            type: OTP_TYPE[otp_parameters.type],
            counter: otp_parameters.counter,
        };
    });
};

const encoder = (otpParameters) => {
    if (!Array.isArray(otpParameters)) otpParameters = [otpParameters];

    const protobufRoot = protobuf.parse(PROTO, { keepCase: true }).root;

    const migrationPayload = protobufRoot.lookupType("MigrationPayload");
    const otpParametersType = protobufRoot.lookupType("MigrationPayload.OtpParameters");


    const otp_parametersArr = otpParameters.map((otp_parameters) => {
        return {
            secret : Buffer.from(base32.parse(otp_parameters.secret)),
            name: otp_parameters.name,
            issuer: otp_parameters.issuer,
            algorithm: otp_parameters.algorithm === "sha1" ? otp_parameters.algorithm === "sha256" ? otp_parameters.algorithm === "sha512" ? otp_parameters.algorithm === "md5" ? 0 : 4 : 3 : 2 : 1,
            digits: otp_parameters.digits,
            //invalid wire type 6 at offset 173
            type: otp_parameters.type === "hotp" ? 1 : 2,
            counter: otp_parameters.counter,
        };
    });

    console.log(otp_parametersArr)

    const payload = {
        otp_parameters: otp_parametersArr,
        version: 1,
        batch_size: 1,
        batch_index: 1,
        batch_id: 1,
    };

    const buffer = migrationPayload.encode(payload).finish();

    return `otpauth-migration://offline?data=${Buffer.from(buffer).toString("base64")}`
};

const test = () => {
    setTimeout(() => {
    //console.log(parser(
   'otpauth-migration://offline?data=ChIKAfgSAzEyMxoAIAEoATACOAAKOAoK///////4/////xIgYmluYW5jZSAobWloYWlsbmljYTEwQGdtYWlsLmNvbSkaACABKAEwAjgACjkKCvj//////////+USIWZpbmFuZHkgKG1paGFpbG5pY2ExMDBAZ21haWwuY29tKRoAIAEoATACOAAKNQoK//////////D//xIdZmluYW5keSAocmU1M2VhcmNoQHlhaG9vLmNvbSkaACABKAEwAjgACjgKCv//////+P///+USIGZpbmFuZHkgKG1udHJhZGluZ2FjM0BnbWFpbC5jb20pGgAgASgBMAI4AAoUCgLLMRIEdGVzdBoAIAEoATACOAAKUQog+Aj//+P////////////l+f//////wP/8///+/4T/+P8SI2h5cGVydHJhZGUgKG1udHJhZGluZ2FjM0BnbWFpbC5jb20pGgAgASgBMAI4AApMChT/////////8P//+P/x///4/////xIqdDIxMiAobWloYWlsbmljYTEwQGdtYWlsLmNvbSB8IDIwMzgxNjk5NjgpGgAgASgBMAI4ABABGAEgACgA'
   'otpauth-migration://offline?data=CggKAfgSAzEyMwouCgr///////j/////EiBiaW5hbmNlIChtaWhhaWxuaWNhMTBAZ21haWwuY29tKQovCgr4///////////lEiFmaW5hbmR5IChtaWhhaWxuaWNhMTAwQGdtYWlsLmNvbSkKKwoK//////////D//xIdZmluYW5keSAocmU1M2VhcmNoQHlhaG9vLmNvbSkKLgoK///////4////5RIgZmluYW5keSAobW50cmFkaW5nYWMzQGdtYWlsLmNvbSkKCgoCyzESBHRlc3QKRwog+Aj//+P////////////l+f//////wP/8///+/4T/+P8SI2h5cGVydHJhZGUgKG1udHJhZGluZ2FjM0BnbWFpbC5jb20pCkIKFP/////////w///4//H///j/////Eip0MjEyIChtaWhhaWxuaWNhMTBAZ21haWwuY29tIHwgMjAzODE2OTk2OCkQARgBIAEoAQ=='
   //))
   const keys = secure_storage.data()
   console.log(secure_storage.data())
   // const otpauth = encoder(keys)
   // const _otp_auth = parser(otpauth)
   // console.log(_otp_auth)
    //console.log(otpauth)
    }, 2000)


}

test()


export default {
    parser,
    encoder,
}