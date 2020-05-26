import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';

import { ColorPicker } from '@poool/junipero';

export default () => {
  const { boxed, error, disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: {},
    enhanced: {},
    unthemed: {},
    animated: {},
    animating: false,
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>ColorPicker example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <ColorPicker
            native={true}
            required={true}
            boxed={boxed}
            error={error}
            label="Label"
            value="#000000"
            disabled={disabled}
            onChange={onChange.bind(null, 'default')}
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
          <ColorPicker
            required={true}
            boxed={boxed}
            error={error}
            placeholder="Label"
            disabled={disabled}
            onChange={onChange.bind(null, 'enhanced')}
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
          <ColorPicker
            required={true}
            theme="none"
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

      <h2 className="mt-5">Animated</h2>
      <div className="row mt-5">
        <div className="col-6">
          <ColorPicker
            required={true}
            boxed={boxed}
            error={error}
            placeholder="Label"
            disabled={disabled}
            onChange={onChange.bind(null, 'animated')}
            animateMenu={(menu) => (
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
