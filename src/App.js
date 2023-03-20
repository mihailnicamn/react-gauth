import React from 'react';
import logo from './logo.svg';
import './App.css';
import Keys from './views/keys';
import * as Bootstrap from 'react-bootstrap';
const isSecure = () => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}
const InstallPWA = (props) => {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);
  return (
    <>
      <Bootstrap.Button 
        variant="outline-primary"
        onClick={() => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the install prompt');
            } else {
              console.log('User dismissed the install prompt');
            }
          });
        }}
        size={props.size}
      >
        Install
        </Bootstrap.Button>
    </>
  )
}
function App() {
  return (
    <>
      {isSecure() ? <Keys /> :
      <div >
        <div className='d-flex justify-content-center' style={{ marginTop: '20vh' }}>
          <div role="alert" className="alert alert-danger text-center">
            <h4 className="alert-heading">Sorry 😅 !</h4>
            <p>The application is only available over HTTPS or localhost.</p>
            <hr />
            <p className="mb-0">If you want to know more about this, please read the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Crypto#crypto.subtle">MDN documentation</a>.</p>
            <hr />
            <p className="mb-0">You can still <InstallPWA size="sm" /> the application on your computer and use it locally and securely (<a href="https://en.wikipedia.org/wiki/Progressive_web_app">why?</a>).</p>
          </div>
        </div>
        <div className='d-flex justify-content-center' style={{ marginTop: '1em' }}>
        <InstallPWA size="lg" className="d-flex align-self-center" />
        </div>
        </div>
      }
    </>
  );
}

export default App;
