import React from 'react';
import * as Bootstrap from 'react-bootstrap';


const Purge = (props) => {
    const [menu, setMenu] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            show: false,
        }
    )
    return (
        <>
        <a href="#" onClick={() => {
                setMenu({ show: !menu.show })
                }}>
                Purge Information
        </a>
            
        <Bootstrap.Modal
            show={menu.show}
            centered
            onHide={() => { setMenu({ show: false }) }}
        >
            <Bootstrap.Modal.Header closeButton>
                <Bootstrap.Modal.Title>Purge Information</Bootstrap.Modal.Title>
            </Bootstrap.Modal.Header>

            <Bootstrap.Modal.Body>
                <p>
                    Are you sure you want to purge all information?
                </p>
            </Bootstrap.Modal.Body>
             
            <Bootstrap.Modal.Footer>
                <Bootstrap.ButtonGroup className="w-100">
                <Bootstrap.Button variant="primary" onClick={() => { setMenu({ show: false }) }}>
                    Cancel
                </Bootstrap.Button>
                <Bootstrap.Button variant="danger" onClick={() => {
                    localStorage.removeItem('gauth');
                    setMenu({ show: false })
                    window.location.reload();
                }}>
                    Purge
                </Bootstrap.Button>
                </Bootstrap.ButtonGroup>
            </Bootstrap.Modal.Footer>
        </Bootstrap.Modal>
        </>
    )
}

export default Purge