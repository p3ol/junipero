import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { TextField } from '@poool/junipero';

export default () => {
  const { error, boxed, disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: {},
    number: {},
    unthemed: {},
    password: {},
    suffix: {},
    multiline: {},
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>TextField example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <TextField
            required={true}
            boxed={boxed}
            error={error}
            placeholder="Label"
            disabled={disabled}
            onChange={onChange.bind(null, 'default')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.default, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Without theming</h2>
      <div className="row mt-5">
        <div className="col-6">
          <TextField
            theme="none"
            required={true}
            boxed={boxed}
            error={error}
            placeholder="Label"
            disabled={disabled}
            onChange={onChange.bind(null, 'unthemed')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.unthemed, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Number</h2>
      <div className="row mt-5">
        <div className="col-6">
          <TextField
            required={true}
            boxed={boxed}
            error={error}
            placeholder="Label"
            disabled={disabled}
            value={0}
            onChange={onChange.bind(null, 'number')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.number, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Password</h2>
      <div className="row mt-5">
        <div className="col-6">
          <TextField
            type="password"
            required={true}
            boxed={boxed}
            error={error}
            placeholder="Label"
            disabled={disabled}
            onChange={onChange.bind(null, 'password')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.password, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Multiline</h2>
      <div className="row mt-5">
        <div className="col-6">
          <TextField
            rows={5}
            required={true}
            boxed={boxed}
            error={error}
            placeholder="Label"
            disabled={disabled}
            onChange={onChange.bind(null, 'multiline')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.multiline, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Force label</h2>
      <div className="row mt-5">
        <div className="col-6">
          <TextField
            required={true}
            boxed={boxed}
            error={error}
            placeholder="Placeholder"
            label="Label"
            forceLabel={true}
            disabled={disabled}
            onChange={onChange.bind(null, 'multiline')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.multiline, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
