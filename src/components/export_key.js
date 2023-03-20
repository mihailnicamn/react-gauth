import * as Bootstrap from 'react-bootstrap';
import * as  React from 'react';
import { connect } from 'react-redux';
import QRCode from "react-qr-code";
import migration from './migration';
const KeyList = (props) => {
    const [menu, setMenu] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            show: false,
        }
    )
    const { keys, qr, actions } = props;
    React.useEffect(() => {
        actions.keys.loadQR();
        return () => { }
    }, [keys])
    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([localStorage.getItem('gauth')], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = "keys.gauth";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    return (
        <>
            <Bootstrap.Button
                size='sm'
                variant="outline-primary"
                onClick={() => { setMenu({ show: !menu.show }) }} >
                <i className="bi bi-cloud-arrow-down-fill"></i>&nbsp;&nbsp;
                Export Keys
            </Bootstrap.Button>
            <Bootstrap.Modal
                show={menu.show}
                onHide={() => { setMenu({ show: false }) }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Bootstrap.Modal.Header closeButton>
                    <Bootstrap.Modal.Title id="contained-modal-title-vcenter">
                        Export Keys
                    </Bootstrap.Modal.Title>
                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body>
                    {/*
                    <div className="d-flex justify-content-center mt-4 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <QRCode value={((() => {
                                    return 'otpauth-migration://offline?data=CmYKQPVZfw%2FK2St7d7FPshys1WiaG%2BbSLNVdf3qKpLxGpj2zxe37NW1CnvrMC61KfLShGXfc7xwF52piTimbPD3NWdASHFJvYm9Gb3JleDpyMzVlYXJjaEB5YWhvby5jb20gASgBMAIKQwoKjmuWCch%2BlWJCKBIiQmluYW5jZS5jb206bWloYWlsbmljYTEwQGdtYWlsLmNvbRoLQmluYW5jZS5jb20gASgBMAIKOAoUNS6tXWcXXe8AJK17HLs23WruwwQSEkhlcm9rdTpNaWhhaWwgTmljYRoGSGVyb2t1IAEoATACCjkKEIESnRtzHFCSOqt32jxR6dkSGkZUWDptaWhhaWxuaWNhMTBAZ21haWwuY29tGgNGVFggASgBMAIKTwoUMVRmfTpEUjhlY1RtY3g2Xk1pI1QSI1RyYWRlU3RhdGlvbjptaWhhaWwubmljYUBpY2xvdWQuY29tGgxUcmFkZVN0YXRpb24gASgBMAIKPQoKU0FITkEzMTNBNRIfQml0c3RhbXA6bWloYWlsLm5pY2FAaWNsb3VkLmNvbRoIQml0c3RhbXAgASgBMAIKOQoKxsdtRbga4voEwRIdUGlvbmV4Om1paGFpbG5pY2ExMEBnbWFpbC5jb20aBlBpb25leCABKAEwAgpICgpmWy6BBFTmCUDGEidCaW5hbmNlLmNvbTphY2NvdW50Zm9ydHJhZGluZ0B5YWhvby5jb20aC0JpbmFuY2UuY29tIAEoATACCkgKChc8ZT00bhQLXDASJ2ZpbmFuZHkuY29tOmFjY291bnRmb3J0cmFkaW5nQHlhaG9vLmNvbRoLZmluYW5keS5jb20gASgBMAIQARgBIAAoy8uEyPv%2F%2F%2F%2F%2FAQ%3D%3D'
                                })())} />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-4 mb-4">
                        <small className="text-muted text-center ">
                            <i className="bi bi-info-circle-fill"></i>&nbsp;Scan this QR code <br />(compatible with <span className="text-primary">Google Authenticator</span> & <span className="text-primary">Microsoft Authenticator</span>)
                        </small>
                    </div>
                    */}
                    <Bootstrap.ButtonGroup className="d-flex justify-content-center mt-4 mb-4">
                        <Bootstrap.Button variant="outline-primary"
                            onClick={() => handleDownload()}
                        > <i className="bi bi-cloud-arrow-down-fill"></i>&nbsp;&nbsp;To File
                        </Bootstrap.Button>
                    </Bootstrap.ButtonGroup>
                </Bootstrap.Modal.Body>
            </Bootstrap.Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        keys: state.keys,
        qr: 'testData'
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            keys: {
                add: (key) => {
                    dispatch.keys.add(key)
                },
                list: () => {
                    dispatch.keys.list()
                },
                remove: (key) => {
                    dispatch.keys.remove(key)
                },
                update: (key) => {
                    dispatch.keys.update(key)
                },
                loadQR: () => {

                }
            },
            secureStorage: {
                getKeys: () => {
                    return dispatch.secureStorage.getKeys()
                }
            }
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(KeyList);
