import React, { useReducer, useContext } from 'react';
import { Link } from 'react-router-dom';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { Button } from '@poool/junipero';

export default () => {
  const { disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: 0,
    primary: 0,
    danger: 0,
  });

  const onClick = name => {
    state[name]++;
    dispatch({ [name]: state[name] });
  };

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>Button example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Button
            disabled={disabled}
            onClick={onClick.bind(null, 'default')}
          >
            Label
          </Button>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>Clicked: { state.default }</pre>
        </div>
      </div>

      <h2 className="mt-5">Primary</h2>
      <div className="row mt-5">
        <div className="col-6">
          <p>
            <Button
              type="primary"
              disabled={disabled}
              onClick={onClick.bind(null, 'primary')}
            >
              Label
            </Button>
            <Button
              className="ml-2"
              type="primary"
              reversed={true}
              disabled={disabled}
              onClick={onClick.bind(null, 'primary')}
            >
              Label
            </Button>
          </p>
          <p className="mt-4">
            <Button
              type="primary"
              size="big"
              disabled={disabled}
              onClick={onClick.bind(null, 'primary')}
            >
              Label
            </Button>
            <Button
              className="ml-2"
              type="primary"
              size="big"
              reversed={true}
              disabled={disabled}
              onClick={onClick.bind(null, 'primary')}
            >
              Label
            </Button>
          </p>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>Clicked: { state.primary }</pre>
        </div>
      </div>

      <h2 className="mt-5">Danger</h2>
      <div className="row mt-5">
        <div className="col-6">
          <p>
            <Button
              type="danger"
              disabled={disabled}
              onClick={onClick.bind(null, 'danger')}
            >
              Label
            </Button>
            <Button
              className="ml-2"
              type="danger"
              reversed={true}
              disabled={disabled}
              onClick={onClick.bind(null, 'danger')}
            >
              Label
            </Button>
          </p>
          <p className="mt-4">
            <Button
              type="danger"
              size="big"
              disabled={disabled}
              onClick={onClick.bind(null, 'danger')}
            >
              Label
            </Button>
            <Button
              className="ml-2"
              type="danger"
              size="big"
              reversed={true}
              disabled={disabled}
              onClick={onClick.bind(null, 'danger')}
            >
              Label
            </Button>
          </p>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>Clicked: { state.danger }</pre>
        </div>
      </div>
    </div>
  );
};
