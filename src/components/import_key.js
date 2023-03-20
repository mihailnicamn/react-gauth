import * as Bootstrap from 'react-bootstrap';
import * as  React from 'react';
import { connect } from 'react-redux';
import QrScan from './qr_scan';
import CryptoJs from 'crypto-js';
const KeyList = (props) => {
    const [menu, setMenu] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            show: false,
            importPassword: false,
            data: {
                password: '',
                isValid: true,
                data: null
            },
            qrResult: null
        }
    )
    const { keys, actions } = props;
    const handleUpload = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/gauth';
        fileInput.onchange = (e) => {
            handleFile(e);
        }
        fileInput.click();
    }
    const isJson = (str) => {
        try {
            if (typeof str === 'object') return true;
            return typeof str === 'string' && JSON.parse(str);
        } catch (e) {
            return false;
        }
    }
    const isOldGauth = (str) => {
        try {
            const data = JSON.parse(str);
            if (data.hasOwnProperty('encrypted') && data.hasOwnProperty('data')) return true;
            return false;
        } catch (e) {
            alert(e.message)
            return false;
        }
    }
    const handleFile = React.useCallback((e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            if (isOldGauth(text)) {
                const data = JSON.parse(text);
                if (data.encrypted === true) {
                    setMenu({
                        data: {
                            ...menu.data,
                            data: data.data
                        },
                        importPassword: true,
                    });
                } else {
                    const keys = JSON.parse(data.data).filter((key) => key.name && key.secret);
                    if (keys.length === 0) {
                        alert('No keys found in file')
                        return setMenu({
                            show: false, importPassword: false, data: {
                                ...menu.data,
                                password: ''
                            }
                        });
                    } else {
                        alert(`${keys.length} key${keys.length > 1 ? 's' : ''} imported`)
                    }
                    keys.map((key) => {
                        if (key.name && key.secret) actions.secureStorage.addData(key);
                    });
                    actions.keys.reload();
                    setMenu({ show: false });
                }
            } else
                if (!isJson(text)) {
                    setMenu({
                        data: {
                            ...menu.data,
                            data: text
                        },
                        importPassword: true,
                    });
                } else {
                    const keys = JSON.parse(text).filter((key) => key.name && key.secret);
                    if (keys.length === 0) {
                        alert('No keys found in file')
                        return setMenu({
                            show: false, importPassword: false, data: {
                                ...menu.data,
                                password: ''
                            }
                        });
                    } else {
                        alert(`${keys.length} key${keys.length > 1 ? 's' : ''} imported`)
                    }
                    keys.map((key) => {
                        if (key.name && key.secret) actions.secureStorage.addData(key);
                    });
                    actions.keys.reload();
                    setMenu({ show: false });
                }
        };
        reader.readAsText(file);
    }, [setMenu]);
    const handlePassword = React.useCallback((e) => {
        const password = e.target.value;
        const workingData = menu.data;
        const test = () => {
            try {
                const encryptedJSON = workingData.data;
                const decryptedJSON = CryptoJs.AES.decrypt(encryptedJSON, password).toString(CryptoJs.enc.Utf8);
                const keys = JSON.parse(decryptedJSON).filter((key) => key.name && key.secret);
                if (keys.length === 0) {
                    alert('No keys found in file')
                    return setMenu({
                        show: false, importPassword: false, data: {
                            ...menu.data,
                            password: ''
                        }
                    });
                } else {
                    alert(`${keys.length} key${keys.length > 1 ? 's' : ''}  imported`)
                }
                keys.map((key) => {
                    if (key.name && key.secret) actions.secureStorage.addData(key);
                });
                actions.keys.reload();
                setMenu({
                    show: false, importPassword: false, data: {
                        ...menu.data,
                        password: password
                    }
                });
            } catch (e) {
                setMenu({
                    data: {
                        ...menu.data,
                        isValid: false,
                        password: password
                    }
                });
            }
        }
        test();
    }, [menu.data]);
    return (
        <>
            <Bootstrap.Button
                size='sm'
                variant="outline-primary"
                onClick={() => { setMenu({ show: !menu.show }) }} >
                <i className="bi bi-cloud-arrow-up-fill"></i>&nbsp;&nbsp;
                Import Keys
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
                        Import Keys
                    </Bootstrap.Modal.Title>
                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body className="d-flex justify-content-center mt-4 mb-4">
                    <Bootstrap.ButtonGroup className="w-100">
                        <Bootstrap.Button variant="outline-primary"
                            onClick={() => handleUpload()}
                        > <i className="bi bi-cloud-arrow-up-fill"></i>&nbsp;&nbsp;From File
                        </Bootstrap.Button>

                        {/*
                        <QrScan
                            data = {menu.qrResult}
                            setData = {(data) => {
                                setMenu({ qrResult: data });
                            }}
                        >&nbsp;&nbsp;From QR Code</QrScan>
                        */}
                    </Bootstrap.ButtonGroup>
                </Bootstrap.Modal.Body>
            </Bootstrap.Modal>
            <Bootstrap.Modal
                show={menu.importPassword}
                onHide={() => { setMenu({ importPassword: false }) }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Bootstrap.Modal.Header closeButton>
                    <Bootstrap.Modal.Title id="contained-modal-title-vcenter">
                        Unlock Keys
                    </Bootstrap.Modal.Title>
                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body className="d-flex justify-content-center mt-4 mb-4">
                    <div className='input-group'>
                        <Bootstrap.Form.Control
                            type='password'
                            className={`text-center m-4 ${menu.data.isValid ? '' : 'is-invalid'}`}
                            placeholder='Password'
                            value={menu.data.password}
                            onChange={(e) => { handlePassword(e) }}
                        />
                    </div>
                </Bootstrap.Modal.Body>
            </Bootstrap.Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        keys: state.keys
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
                reload: () => {
                    dispatch.keys.reload()
                }
            },
            secureStorage: {
                addData: (data) => {
                    dispatch.secureStorage.addData(data)
                }
            }
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(KeyList);
