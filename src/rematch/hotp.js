/*
  https://github.com/google/google-authenticator/wiki/Key-Uri-Format
  Assumptions (based from Google Authenticator):
    Algorithm: SHA1
    Digits: 6
    Period: 30s
*/

var charTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
var byteTable = [
    0xff, 0xff, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f,
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
    0xff, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
    0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
    0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16,
    0x17, 0x18, 0x19, 0xff, 0xff, 0xff, 0xff, 0xff,
    0xff, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
    0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e,
    0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16,
    0x17, 0x18, 0x19, 0xff, 0xff, 0xff, 0xff, 0xff
];
const base32ToBuffer = function(encoded) {
  var shiftIndex = 0;
  var plainDigit = 0;
  var plainChar;
  var plainPos = 0;
  var len = Math.ceil(encoded.length * 5 / 8);
  var decoded;
  encoded = encoded.split('').map(function (ch) {
    return ch.charCodeAt(0);
  });
  if('undefined' !== typeof Uint8Array) {
      encoded = new Uint8Array(encoded);
      decoded = new Uint8Array(len);
  } else {
      decoded = new Array(len);
  }

  /* byte by byte isn't as pretty as octet by octet but tests a bit
      faster. will have to revisit. */
  for(var i = 0; i < encoded.length; i++) {
      if(encoded[i] === 0x3d){ //'='
          break;
      }

      var encodedByte = encoded[i] - 0x30;

      if(encodedByte < byteTable.length) {
          plainDigit = byteTable[encodedByte];

          if(shiftIndex <= 3) {
              shiftIndex = (shiftIndex + 5) % 8;

              if(shiftIndex === 0) {
                  plainChar |= plainDigit;
                  decoded[plainPos] = plainChar;
                  plainPos++;
                  plainChar = 0;
              } else {
                  plainChar |= 0xff & (plainDigit << (8 - shiftIndex));
              }
          } else {
              shiftIndex = (shiftIndex + 5) % 8;
              plainChar |= 0xff & (plainDigit >>> shiftIndex);
              decoded[plainPos] = plainChar;
              plainPos++;

              plainChar = 0xff & (plainDigit << (8 - shiftIndex));
          }
      } else {
          throw new Error('Invalid input - it is not base32 encoded string');
      }
  }

  if (decoded.slice) { // Array or TypedArray
    return decoded.slice(0, plainPos);
  } else { // Mobile Safari TypedArray
    return new Uint8Array(Array.prototype.slice.call(decoded, 0, plainPos));
  }
};
let computeHOTP = (secret, counter) => {
  // https://tools.ietf.org/html/rfc4226#section-5.1
  let formatCounter = (counter) => {
    let binStr = ('0'.repeat(64) + counter.toString(2)).slice(-64);
    let intArr = [];

    for (let i = 0; i < 8; i++) {
      intArr[i] = parseInt(binStr.slice(i * 8, i * 8 + 8), 2);
    }

    return Uint8Array.from(intArr).buffer;
  };

  // https://tools.ietf.org/html/rfc4226#section-5.4
  let truncate = (buffer) => {
    let offset = buffer[buffer.length - 1] & 0xf;
    return (
      ((buffer[offset] & 0x7f) << 24) |
      ((buffer[offset + 1] & 0xff) << 16) |
      ((buffer[offset + 2] & 0xff) << 8) |
      (buffer[offset + 3] & 0xff)
    );
  };

  return window.crypto.subtle.importKey(
    'raw',
    base32ToBuffer(secret),
    { name: 'HMAC', hash: {name: 'SHA-1'} },
    false,
    ['sign']
  ).then((key) => {
    return window.crypto.subtle.sign('HMAC', key, formatCounter(counter))
  }).then((result) => {
    return ('000000' + (truncate(new Uint8Array(result)) % 10 ** 6 )).slice(-6)
  });
};

let computeTOTP = (secret) => {
let counter = Math.floor(Date.now() / 30000);
  return computeHOTP(secret, counter);
}

export default {
  hotp:computeHOTP,
  totp:computeTOTP
}