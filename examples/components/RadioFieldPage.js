import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { RadioField } from '@poool/junipero';

export default () => {
  const { disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: {},
    objects: {},
    unthemed: {},
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  const options = ['One', 'Two', 'Three'];

  const optionsAsObjects = [{
    title: 'One',
    value: 'one',
  }, {
    title: 'Two',
    value: 'two',
  }, {
    title: 'Three',
    value: 'three',
  }];

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>RadioField example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <RadioField
            id="default"
            name="default"
            options={options}
            required={true}
            disabled={disabled}
            onChange={onChange.bind(null, 'default')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.default, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">With objects</h2>
      <div className="row mt-5">
        <div className="col-6">
            <RadioField
              id="with-objects"
              name="with-obejcts"
              options={optionsAsObjects}
              required={true}
              value="three"
              disabled={disabled}
              parseTitle={opt => opt?.title}
              parseValue={opt => opt?.value}
              onChange={onChange.bind(null, 'objects')}
            />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.objects, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Without theming</h2>
      <div className="row mt-5">
        <div className="col-6">
          <RadioField
            theme="none"
            value="Two"
            options={options}
            required={true}
            disabled={disabled}
            onChange={onChange.bind(null, 'unthemed')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.unthemed, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
