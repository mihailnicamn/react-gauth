import * as Bootstrap from 'react-bootstrap';
import * as  React from 'react';
import QrReader from 'modern-react-qr-reader'
class Test extends React.Component {
  constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            result: 'No result'
        }

        this.handleError = this.handleError.bind(this);
        this.handleScan = this.handleScan.bind(this);
    }

  handleScan = data => {
    if (data) {
        alert(JSON.stringify(data, null, 2));
      this.state.result = data;
        console.log(this.state.result);
        this.setState({result: data});
        this.props.setData(data);
    }
  }
  
  handleError = err => {
    console.error(err)
  }
  
  render() {
    return (
      <Bootstrap.Container fluid style={{
        borderRadius: '0.25rem 0.25rem 0.25rem 0.25rem',
      }}>
        <QrReader
          delay={300}
          facingMode={"environment"}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%',
          borderRadius: '0.25rem 0.25rem 0.25rem 0.25rem', 
        }}
        />
        </Bootstrap.Container>
    )
  }
}
const QrScan = (props) => {
    const { data, setData } = props;
    const [menu, setMenu] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            show: false,
            data: null

        }
    )

    return (
        <>
            <Bootstrap.Button variant="outline-primary"
                style={props.style}
                className={props.className}
                onClick={() => { setMenu({ show: !menu.show }) }}
            > <i className="bi bi-qr-code-scan"></i>
                {props.children}
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
                        Scan QR Code
                    </Bootstrap.Modal.Title>
                </Bootstrap.Modal.Header>
                <Bootstrap.Modal.Body className="d-flex justify-content-center mt-4 mb-4">
                    <Test setData={(data)=>{
                        setData(data);
                        setMenu({ show: false });
                    }} />
                </Bootstrap.Modal.Body>
            </Bootstrap.Modal>
        </>
    )
}

export default QrScan;
