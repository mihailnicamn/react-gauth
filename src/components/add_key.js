import * as Bootstrap from 'react-bootstrap';
import * as  React from 'react';
import { connect } from 'react-redux';
import QrScan from './qr_scan';
import { act } from '@testing-library/react';
const KeyList = (props) => {
    const [menu, setMenu] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            show: false,
            name : '',
            key : '',
            qrResult : null
        }
    )
    const { keys, actions } = props;

    return (
        <>
            <Bootstrap.Button
                    size='sm'
                variant="outline-primary"
                onClick={() => { setMenu({ show: !menu.show }) }} >
                <i className="bi bi-plus-circle-fill"></i>&nbsp;&nbsp;
                Add Key
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
                        Add New Key
                    </Bootstrap.Modal.Title>
                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body>
                    <Bootstrap.Form>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"
                                    style={{
                                        width: "10em",
                                        borderRadius: "0.25em 0 0 0.25em"
                                    }}
                                >Name : </span>
                            </div>
                            <input type="text" className="form-control" placeholder="Name" aria-label="Name"
                                value={menu.name}
                                onChange={(e) => {
                                    setMenu({ name: e.target.value })
                                }}
                            aria-describedby="basic-addon1" />
                        </div>
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1"
                                    style={{
                                        width: "10em",
                                        borderRadius: "0.25em 0 0 0.25em"
                                    }}
                                >Key : </span>
                            </div>
                            <input type="text" className="form-control"
                                value={menu.key}
                                onChange={(e) => {
                                    setMenu({ key: e.target.value })
                                }}
                            placeholder="Secret Key" aria-label="Secret Key" aria-describedby="basic-addon1" />
                            <div className="input-group-append"
                                style={{
                                    borderRadius: "0 0.25em 0.25em 0"
                                }}>

                        <QrScan data={
                            menu.qrResult
                        } setData={(data)=>{
                            const parts = new URL(data);
                            const urlUnescaped = (str)=>{
                                return str.replace(/%([0-9A-F]{2})/g, (match, p1) => {
                                    return String.fromCharCode('0x' + p1);
                                });
                            }
                            const name = urlUnescaped(parts.pathname.split('/').pop());
                            const key = parts.searchParams.get('secret');
                            const issuer = parts.searchParams.get('issuer');
                            setMenu({
                                name : `${issuer} - ${name}`,
                                key : key,
                               // show : false
                            })
                        }} style={{
                                        borderRadius: "0 0.25em 0.25em 0"
                                    }}></QrScan>
                            </div>
                        </div>

                    </Bootstrap.Form>
                </Bootstrap.Modal.Body>
                <Bootstrap.Modal.Footer className="justify-content-center">
                    <Bootstrap.Button onClick={() => { 
                        setMenu({ show: false })
                        actions.secureStorage.addData({
                            name: menu.name,
                            secret : menu.key
                        })
                        actions.keys.reload();
                         }}>Add Key</Bootstrap.Button>
                </Bootstrap.Modal.Footer>
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
