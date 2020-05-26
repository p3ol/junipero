import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { Slider } from '@poool/junipero';

export default () => {
  const { disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: {},
    unthemed: {},
    decimals: {},
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>Slider example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Slider
            value={0}
            min={0}
            max={100}
            step={1}
            label="Count"
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
          <Slider
            theme="none"
            value={0}
            min={0}
            max={100}
            step={1}
            label="Count"
            disabled={disabled}
            onChange={onChange.bind(null, 'unthemed')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.unthemed, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">0.1 step</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Slider
            value={0}
            min={0}
            max={100}
            step={0.1}
            label="Count"
            disabled={disabled}
            onChange={onChange.bind(null, 'decimals')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.decimals, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
