import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { SelectField } from '@poool/junipero';

const basicOptions = [
  5,
  10,
  15,
  20,
];

const objectOptions = [
  { title: '5 items', value: 5 },
  { title: '10 items', value: 10 },
  { title: '15 items', value: 15 },
  { title: '20 items with a very very long name', value: 20 },
];

const autoCompleteOptions = [
  'Dave',
  'Astrid',
  'Freeman',
  'Lizbeth',
  'Annette',
];

export default () => {
  const { error, boxed, disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: {},
    enhanced: {},
    unthemed: {},
    objects: {},
    objectsForceValue: {},
    autocomplete: {},
    forceLabel: {},
    emptyResults: {},
    animated: {},
    acceptAnyOption: {},
    animating: false,
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>SelectField example</h1>

      <h2 className="mt-5">Default (native)</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            native={true}
            required={true}
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'default')}
            label="Label"
            placeholder="Select one..."
            options={basicOptions}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.default, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Default (enhanced)</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            required={true}
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'enhanced')}
            placeholder="Select one..."
            options={basicOptions}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.enhanced, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Without theming</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            required={true}
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'unthemed')}
            placeholder="Select one..."
            label="Label"
            theme="none"
            options={basicOptions}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.unthemed, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Object options</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            required={true}
            label="Label"
            disabled={disabled}
            boxed={boxed}
            error={error}
            onChange={onChange.bind(null, 'objects')}
            placeholder="Select one..."
            parseTitle={item => item.title}
            options={objectOptions}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.objects, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Object options with value enforced</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            required={false}
            label="Label"
            disabled={disabled}
            boxed={boxed}
            error={error}
            value={15}
            parseValue={item => item.value}
            parseTitle={item => item.title}
            onChange={onChange.bind(null, 'objectsForceValue')}
            placeholder="Select one..."
            options={objectOptions}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.objectsForceValue, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Auto-Complete</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            required={true}
            label="Label"
            disabled={disabled}
            boxed={boxed}
            error={error}
            onChange={onChange.bind(null, 'autocomplete')}
            placeholder="Select one..."
            options={autoCompleteOptions}
            autoComplete={(val, cb) => {
              const search = new RegExp(val, 'ig');
              cb(autoCompleteOptions.filter((item) => (
                search.test(item)
              )));
            }}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.autocomplete, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Force label</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            required={true}
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'forceLabel')}
            label="Label"
            forceLabel={true}
            placeholder="Select one..."
            options={basicOptions}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.forceLabel, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Animated</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            required={true}
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'animated')}
            placeholder="Select one..."
            options={basicOptions}
            animateMenu={menu => (
              <CSSTransition
                in={state.animating}
                mountOnEnter={true}
                unmountOnExit={true}
                timeout={100}
                classNames="slide-in-up-dropdown"
                children={menu}
              />
            )}
            onToggle={opened => dispatch({ animating: opened })}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.animated, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Empty results</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            required={true}
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'emptyResults')}
            label="Label"
            placeholder="Select one..."
            options={[]}
            emptyText="There is no data."
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.emptyResults, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Accept any option</h2>
      <div className="row mt-5">
        <div className="col-6">
          <SelectField
            required={true}
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'acceptAnyOption')}
            label="Label"
            placeholder="Select one..."
            options={objectOptions}
            parseTitle={val => val.title}
            parseValue={val => val.value}
            value={{ title: '100 items', value: 100 }}
            acceptAnyOption
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.acceptAnyOption, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
