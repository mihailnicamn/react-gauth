
import * as Bootstrap from 'react-bootstrap';
import * as  React from 'react';
import { connect } from 'react-redux';

const millisecondsUntilRefresh = () => {
    // return milliseconds untill next 30 second interval
    const now = Date.now();
    const seconds = Math.floor(now / 1000);
    const secondsUntilNextInterval = 30 - (seconds % 30);
    return secondsUntilNextInterval * 1000;
}

const SafeInterval = (callback, delay) => {
    const savedCallback = React.useRef();

    // Remember the latest callback.
    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    React.useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

const Counter = (props) => {

    const { keys, actions } = props;
    const [menu, setMenu] = React.useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            show: false,
            secondsUntillRefresh: parseInt(millisecondsUntilRefresh() / 1000)
        }
    )

    const handleRefresh = React.useCallback(() => {
        actions.keys.reload();
    }, [actions.keys]);

    SafeInterval(() => {
        const _ms = parseInt(millisecondsUntilRefresh() / 1000);
        if (_ms === 30) {
            handleRefresh();
        }
        setMenu({ secondsUntillRefresh: _ms });
    }, 1000);

    return (
        <>

            <Bootstrap.Button
                size='sm'
                variant="outline-primary"
            >
              
              Codes Refresh :&nbsp;&nbsp;{menu.secondsUntillRefresh}
            </Bootstrap.Button>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        keys: state.keys
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: {
            keys: {
                list: () => {
                    dispatch.keys.list()
                },
                reload: () => {
                    dispatch.keys.reload()
                }
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);