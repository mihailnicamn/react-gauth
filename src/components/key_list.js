import * as Bootstrap from 'react-bootstrap';
import * as  React from 'react';
import { connect } from 'react-redux';

const KeyList = (props) => {

    const { keys, actions, isEditing, selected, setSelected } = props;
    const [menu, setMenu] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            show: false,
            isEditing: -1,
            editingValue: '',
            search: ''
        }
    )


    return (
        <>
            <div className='d-flex align-items-center justify-content-center mt-5'>
                <Bootstrap.FormControl
                    type="text"
                    className="text-center"
                    placeHolder="Search"
                    value={menu.search}
                    onChange={(e)=>{
                        setMenu({
                            search : e.target.value
                        })
                    }}
                    ></Bootstrap.FormControl>
            </div>
            <Bootstrap.ListGroup className="mt-2">
                {keys && keys.filter( key => key.name && key.code &&(
                    key.name.toLowerCase().includes(menu.search.toLowerCase())
                )).map((key, index) => {
                    if (menu.isEditing === index){
                        return (
                        <Bootstrap.ListGroup.Item key={index}>
                            <Bootstrap.Row>
                                {isEditing ? <Bootstrap.Col xs={1} md={1} lg={1} xl={1} className="d-flex align-items-center">
                                    <Bootstrap.FormCheck
                                        type="checkbox"
                                        checked={selected.includes(index)}
                                        onChange={(e) => {
                                            if (selected.includes(index)) {
                                                setSelected(selected.filter((k) => k !== index))
                                            } else {
                                                setSelected([...selected, index])
                                            }
                                        }}
                                    />
                                </Bootstrap.Col> : null}
                                <Bootstrap.Col  className=" mt-2 mb-2" sm={6} md={6} lg={6} xl={6}>
                                    <div className="input-group">
                                        <Bootstrap.Form.Control
                                            type="text"
                                            className="text-center"
                                            value={menu.editingValue || key.name}
                                            onChange={(e) => {
                                                setMenu({ editingValue: e.target.value })
                                            }}
                                        />
                                        <div className="input-group-append">
                                            <Bootstrap.Button
                                                variant="outline-success"
                                                style={{ borderRadius: '0 0.25rem 0.25rem 0' }}
                                                onClick={() => {
                                                    // actions.keys.update(key)
                                                    setMenu({ isEditing: -1 })
                                                    actions.secureStorage.updateData(index, {
                                                        ...key,
                                                        name : menu.editingValue || key.name
                                                    })
                                                }}
                                            >
                                                Save
                                            </Bootstrap.Button>
                                        </div>
                                    </div>

                                </Bootstrap.Col>
                                <Bootstrap.Col className="d-flex align-items-center justify-content-center mt-2 mb-2"  sm={6} md={6} lg={6} xl={6}>
                                    <Bootstrap.Form.Control style={{
                                    width: '150px'  ,
                                    maxWidth: '150px',
                                    minWidth: '150px'
                                }}
                                        type="text"
                                        className="text-center"
                                        disabled
                                        size="lg"
                                        value={key.code}
                                        onChange={(e) => { }}
                                    />
                                </Bootstrap.Col>
                            </Bootstrap.Row>
                        </Bootstrap.ListGroup.Item>
                    )}
                    else return (
                        <Bootstrap.ListGroup.Item key={index}>
                            <Bootstrap.Row>
                                {isEditing ? <Bootstrap.Col xs={1} md={1} lg={1} xl={1} className="d-flex align-items-center">
                                    <Bootstrap.FormCheck
                                        type="checkbox"
                                        checked={selected.includes(index)}
                                        onChange={(e) => {
                                            if (selected.includes(index)) {
                                                setSelected(selected.filter((k) => k !== index))
                                            } else {
                                                setSelected([...selected, index])
                                            }
                                        }}
                                    />
                                </Bootstrap.Col> : null}
                                <Bootstrap.Col className="d-flex align-items-center mt-2 mb-2" sm={6} md={6} lg={6} xl={6}>
                                    <Bootstrap.Button
                                        variant="outline-secondary"
                                        className="w-100"
                                        onClick={() => {
                                            setMenu({ isEditing: index })
                                        }}
                                    >
                                        {key.name}
                                    </Bootstrap.Button>
                                </Bootstrap.Col>
                                <Bootstrap.Col className="d-flex align-items-center justify-content-center mt-2 mb-2" sm={6} md={6} lg={6} xl={6}>
                                    <Bootstrap.Form.Control style={{
                                    width: '150px'  ,
                                    maxWidth: '150px',
                                    minWidth: '150px'
                                }}
                                        type="text"
                                        className="text-center"
                                        disabled
                                        size="lg"
                                        value={key.code}
                                        onChange={(e) => { }}
                                    />
                                </Bootstrap.Col>
                            </Bootstrap.Row>
                        </Bootstrap.ListGroup.Item>
                    )
                })}
            </Bootstrap.ListGroup>
        </>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        keys: state.keys,
        ...ownProps
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
                }
            },
            secureStorage: {
                updateData: (index, key) => {
                    dispatch.secureStorage.updateData({
                        index,
                        key
                    })
                    dispatch.keys.reload()
                }
            }
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(KeyList);
