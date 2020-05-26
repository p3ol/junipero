import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { Switch } from '@poool/junipero';

const basicOptions = [
  'Left',
  'Middle',
  'Right',
];

const objectOptions = [
  { title: 'Left', value: 0 },
  { title: 'Middle', value: 1 },
  { title: 'Right', value: false, disabled: true },
];

export default () => {
  const { disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: {},
    unthemed: {},
    objectOptions: {},
    withValue: {},
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>Switch example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Switch
            required={true}
            disabled={disabled}
            options={basicOptions}
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
          <Switch
            theme="none"
            required={true}
            disabled={disabled}
            options={basicOptions}
            onChange={onChange.bind(null, 'unthemed')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.unthemed, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Objects options</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Switch
            required={true}
            options={objectOptions}
            parseTitle={option => option.title}
            onChange={onChange.bind(null, 'objectOptions')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.objectOptions, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">With value set</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Switch
            required={true}
            options={objectOptions}
            parseTitle={(option) => option.title}
            value={objectOptions[1]}
            onChange={onChange.bind(null, 'withValue')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.withValue, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
