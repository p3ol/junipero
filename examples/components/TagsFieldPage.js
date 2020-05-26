import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { TagsField } from '@poool/junipero';

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
    unthemed: {},
    autocomplete: {},
    animated: {},
    animating: false,
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>TagsField example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <TagsField
            label="Keywords"
            disabled={disabled}
            boxed={boxed}
            error={error}
            placeholder="Type a keyword..."
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
          <TagsField
            theme="none"
            label="Keywords"
            disabled={disabled}
            boxed={boxed}
            error={error}
            placeholder="Type a keyword..."
            onChange={onChange.bind(null, 'unthemed')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.unthemed, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">With autocomplete</h2>
      <div className="row mt-5">
        <div className="col-6">
          <TagsField
            label="Keywords"
            disabled={disabled}
            boxed={boxed}
            error={error}
            placeholder="Type a keyword..."
            onChange={onChange.bind(null, 'autocomplete')}
            autoCompleteUniqueValues={true}
            autoComplete={(val, cb) => {
              const search = new RegExp(val, 'i');
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

      <h2 className="mt-5">Animated</h2>
      <div className="row mt-5">
        <div className="col-6">
          <TagsField
            label="Keywords"
            disabled={disabled}
            boxed={boxed}
            error={error}
            placeholder="Type a keyword..."
            onChange={onChange.bind(null, 'animated')}
            autoCompleteUniqueValues={true}
            autoComplete={(val, cb) => {
              const search = new RegExp(val, 'i');
              cb(autoCompleteOptions.filter((item) => (
                search.test(item)
              )));
            }}
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
    </div>
  );
};
