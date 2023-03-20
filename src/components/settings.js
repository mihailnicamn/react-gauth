
import * as Bootstrap from 'react-bootstrap';
import * as  React from 'react';
import { connect } from 'react-redux';
import Purge from './purge';
const Settings = (props) => {
    const { keys, actions } = props;
    const [menu, setMenu] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            show: false,
            password : window.sessionPassword
        }
    )
    return (
        <>
            <Bootstrap.Button
                size='sm'
                onClick={() => {
                    actions.secureStorage.destroyPassword();
                }}
                variant="outline-primary">
                <i className="bi bi-file-earmark-lock-fill"></i>&nbsp;&nbsp; Lock
            </Bootstrap.Button>
            <Bootstrap.Button
                size='sm'
                variant="outline-primary"
                onClick={() => { setMenu({ show: !menu.show }) }}
            >
                <i className="bi bi-gear-fill"></i>&nbsp;&nbsp; Settings
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
                        Settings
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
                                >Password : </span>
                            </div>
                            <input type="password" className="form-control" placeholder="Password" aria-label="Password" 
                            value={menu.password}
                            onChange={(e) => {
                                setMenu({ password: e.target.value })
                            }}
                            aria-describedby="basic-addon1" />
                        </div>
                        </Bootstrap.Form>
                </Bootstrap.Modal.Body>
                <Bootstrap.Modal.Footer className="justify-content-center">
                    <Bootstrap.Button
                        onClick={() => { 
                            actions.secureStorage.updatePassword(menu.password);
                            setMenu({ show: false })
                         }}
                        variant="outline-primary">
                        Save
                    </Bootstrap.Button>
                </Bootstrap.Modal.Footer>
                <Bootstrap.Modal.Footer className="justify-content-center">
                    <Purge />
                </Bootstrap.Modal.Footer>
            </Bootstrap.Modal>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        keys: state.keys,
        secureStorage: state.secureStorage
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            keys: {
                add: (key) => {
                    dispatch.keys.add(key)
                },
            },
            secureStorage: {
                destroyPassword: () => {
                    dispatch.secureStorage.destroyPassword()
                },
                updatePassword: (password) => {
                    dispatch.secureStorage.updatePassword(password)
                }
            }
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Settings);