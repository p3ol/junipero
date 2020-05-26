import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { DateField } from '@poool/junipero';

const today = new Date();

export default () => {
  const { error, boxed, disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: {},
    enhanced: {},
    unthemed: {},
    currentDay: {
      value: new Date(),
      valid: true,
    },
    limited: {},
    customTitle: {},
    animated: {},
    animating: false,
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>DateField example</h1>

      <h2 className="mt-5">Default (native)</h2>
      <div className="row mt-5">
        <div className="col-6">
          <DateField
            native={true}
            placeholder="Pick a date"
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'default')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{JSON.stringify(state.default, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Default (enhanced)</h2>
      <div className="row mt-5">
        <div className="col-6">
          <DateField
            placeholder="Pick a date"
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'enhanced')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{JSON.stringify(state.enhanced, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Without theming</h2>
      <div className="row mt-5">
        <div className="col-6">
          <DateField
            theme="none"
            placeholder="Pick a date"
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'unthemed')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{JSON.stringify(state.unthemed, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Current Day</h2>
      <div className="row mt-5">
        <div className="col-6">
          <DateField
            label="Label"
            value={state.currentDay.value}
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'currentDay')}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{JSON.stringify(state.currentDay, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Custom title</h2>
      <div className="row mt-5">
        <div className="col-6">
          <DateField
            label="Label"
            disabled={disabled}
            error={error}
            boxed={boxed}
            forceLabel={true}
            placeholder="Pick a date"
            onChange={onChange.bind(null, 'customTitle')}
            parseTitle={value => value.toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{JSON.stringify(state.customTitle, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Animated</h2>
      <div className="row mt-5">
        <div className="col-6">
          <DateField
            placeholder="Pick a date"
            disabled={disabled}
            error={error}
            boxed={boxed}
            onChange={onChange.bind(null, 'animated')}
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
          <pre>{JSON.stringify(state.animated, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">2 Weeks limited</h2>
      <div className="row mt-5">
        <div className="col-6">
          <DateField
            label="Label"
            value={state.limited.value}
            disabled={disabled}
            error={error}
            boxed={boxed}
            placeholder="Pick a date"
            onChange={onChange.bind(null, 'limited')}
            minDate={new Date().setDate(today.getDate() - 7)}
            maxDate={new Date().setDate(today.getDate() + 7)}
          />
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{JSON.stringify(state.limited, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
