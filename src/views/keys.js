import * as Bootstrap from 'react-bootstrap';
import React from 'react';
import { connect } from 'react-redux';
//import secureLocalStorage from '../utils/secure_local_storage';
import KeyList from '../components/key_list';
import AddKey from '../components/add_key';
import ExportKey from '../components/export_key';
import ImportKey from '../components/import_key';
import Counter from '../components/counter';
import Settings from '../components/settings';
import Purge from '../components/purge_link';
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
                },
            },
            secureStorage: {
                init: (password) => {
                    return dispatch.secureStorage.init(password)
                },
                setPassword: (password) => {
                    return dispatch.secureStorage.setPassword(password)
                },
                isInit: () => {
                    return dispatch.secureStorage.isInit()
                },
                hasPassword: () => {
                    return dispatch.secureStorage.hasPassword()
                },
                goodPassword: (password) => {
                    return dispatch.secureStorage.goodPassword(password)
                },
                refresh: () => {
                    return dispatch.secureStorage.refresh()
                },
                addData: (data) => {
                    return dispatch.secureStorage.addData(data)
                },
                removeData: (data) => {
                    return dispatch.secureStorage.removeData(data)
                },
                updateData: (id, data) => {
                    return dispatch.secureStorage.updateData(id, data)
                }
            }
        }
    }
}

const LoadedComp = (props) => {
    const [data, setData] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            isEditing: false,
            selected: [],
        }
    )
    return (
        <>
            <div className='d-flex justify-content-center' style={{
            }}>
                <div className='fixed-top ' style={{
                    marginTop: '1em',
                    marginLeft: '1em',
                    marginRight: '1em'
                }}>
                    <div className="d-flex justify-content-center mb-4">
                        <Bootstrap.ButtonGroup className='bg-white'>
                            <Counter />
                            <Bootstrap.Button
                                size='sm'
                                onClick={() => {
                                    if (data.isEditing) {
                                        props.actions.secureStorage.removeData(data.selected)
                                        props.actions.keys.reload()
                                        setData({ isEditing: false, selected: [] })
                                    }
                                    if (!data.isEditing) {
                                        setData({ isEditing: true })
                                    }
                                }}
                                variant="outline-primary">
                                <i className="bi bi-trash"></i>&nbsp;&nbsp; {data.isEditing ? `Remove ${data.selected.length} selected` : 'Remove'}
                            </Bootstrap.Button>
                            {data.isEditing ? <Bootstrap.Button 
                                size='sm'
                                variant="outline-primary"
                                onClick={() => {
                                    let Duplicates = []
                                    let Uniques = []
                                    let { keys } = props
                                    keys.forEach((key, index) => {
                                        if(Uniques.find((unique) => unique.code === key.code)) {
                                            Duplicates.push(index)
                                        }else{
                                            Uniques.push(key)
                                        }
                                    })
                                    setData({ selected: [...data.selected, ...Duplicates] })
                                }}
                            >
                                Select Duplicates
                            </Bootstrap.Button> : null}
                        </Bootstrap.ButtonGroup>
                    </div>
                </div>
                <div className='fixed-top' style={{
                    marginTop: '4em',
                    marginLeft: '1em',
                    marginRight: '1em'
                }}>
                    <div className="d-flex justify-content-center">
                        <Bootstrap.ButtonGroup className='bg-white'>
                            <Settings />
                        </Bootstrap.ButtonGroup>
                    </div>
                </div>
                <Bootstrap.ButtonGroup className=' fixed-bottom bg-white' style={{
                    marginBottom: '3em',
                    marginLeft: '1em',
                    marginRight: '1em'
                }}>
                    <AddKey />
                    <ExportKey />
                    <ImportKey />
                </Bootstrap.ButtonGroup>
            </div>
            <Bootstrap.Container style={{
                marginTop: '6em',
                marginBottom: '6em'
            }}>
                <Bootstrap.Row >
                    <Bootstrap.Col>
                        <KeyList isEditing={data.isEditing} selected={data.selected} setSelected={(key) => setData({ selected: key })} />
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        </>
    )
}
const UnloadedComp = (props) => {
    const [data, setData] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            password: '',
            isValid: true,
        }
    )
    const { keys, actions } = props;
    const handleUnlock = (_password) => {
        setData({ password: '' })
        if (actions.secureStorage.isInit()) {
            if (!actions.secureStorage.goodPassword(_password)) {
                setData({ isValid: false })
                return
            }
            setData({ isValid: true })
            actions.secureStorage.setPassword(_password)
            actions.keys.reload()
        }
        if (!actions.secureStorage.isInit()) {
            actions.secureStorage.setPassword(_password)
            actions.secureStorage.init()
        }
    }
    return (
        <>
            <Bootstrap.Container className='mt-5 d-flex justify-content-center align-items-center' style={{ height: '80vh' }}>
                <Bootstrap.Row>
                    <Bootstrap.Col>
                        <Bootstrap.Card>
                            <Bootstrap.Card.Body>
                                <Bootstrap.Card.Title>
                                    <span className='d-flex justify-content-center'>
                                        {
                                            actions.secureStorage.isInit() ? 'Enter the password to unlock your keys' : 'Enter the password to encrypt your keys'
                                        }
                                    </span>
                                </Bootstrap.Card.Title>
                                <div className='d-flex justify-content-center'>
                                    <div className='input-group'>
                                        <Bootstrap.Form.Control
                                            type='password'
                                            className={`text-center m-4 ${data.isValid ? '' : 'is-invalid'}`}
                                            placeholder='Password'
                                            value={data.password}
                                            onChange={(e) => {
                                                if (actions.secureStorage.isInit()) handleUnlock(e.target.value)
                                                setData({ password: e.target.value })
                                            }}
                                        />
                                    </div>
                                </div>
                                {!actions.secureStorage.isInit() ? (
                                    <Bootstrap.Button
                                        variant='outline-success'
                                        className='mt-3 w-100'
                                        onClick={() => {
                                            actions.secureStorage.setPassword(data.password)
                                            actions.secureStorage.init(data.password)
                                            actions.secureStorage.goodPassword(data.password)
                                            actions.keys.reload()
                                        }}
                                    >
                                        Save
                                    </Bootstrap.Button>
                                ) : (<>
                                    <small >
                                        <span className='text-center mt-3'>
                                        <i className="bi bi-exclamation-triangle text-danger"></i>&nbsp; 
                                            If you forget your password, you will lose all your keys, there is no limit on the number of attempts to unlock your keys.
                                        </span>
                                    </small>
                                    <br />
                                    <small>
                                        <span className='text-center mt-3'>
                                        <i className="bi bi-info-circle text-info"></i>&nbsp; 
                                            In case that you forget your password, and your're about to give up, try again or <Purge size="sm" /> and add your keys again.
                                        </span>
                                    </small>
                                </>)}
                            </Bootstrap.Card.Body>
                        </Bootstrap.Card>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        </>
    )
}
const Loaded = connect(mapStateToProps, mapDispatchToProps)(LoadedComp)
const Unloaded = connect(mapStateToProps, mapDispatchToProps)(UnloadedComp)
const Keys = (props) => {
    React.useEffect(() => {
        props.actions.keys.reload()
    }, [])
    const { keys, secureStorage, actions } = props;
    return secureStorage && secureStorage.isLoaded ? <Loaded /> : <Unloaded />
}



export default connect(mapStateToProps, mapDispatchToProps)(Keys)