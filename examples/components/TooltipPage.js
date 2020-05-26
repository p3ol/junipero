import React, { useContext, useReducer, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { Tooltip } from '@poool/junipero';

export default () => {
  const forceUpdateTooltipRef = useRef();
  const { disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: false,
    withoutTheming: false,
    iconHover: false,
    clickOnly: false,
    differentContainer: false,
    showLongText: false,
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  const toggleLongText = () => {
    dispatch({ showLongText: !state.showLongText });
    forceUpdateTooltipRef.current?.scheduleUpdate();
  };

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>Tooltip example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Tooltip
            placement="top"
            text="This is a tooltip"
            onToggle={onChange.bind(null, 'default')}
            disabled={disabled}
          >
            Hover to display a tooltip !
          </Tooltip>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.default, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Without theming</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Tooltip
            theme="none"
            placement="top"
            text="This is a tooltip with kind of a long text but not too long"
            onToggle={onChange.bind(null, 'withoutTheming')}
            disabled={disabled}
          >
            <span>Hover to display a tooltip !</span>
          </Tooltip>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.withoutTheming, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Placement: right</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Tooltip
            placement="right"
            text="This is a tooltip"
            onToggle={onChange.bind(null, 'iconHover')}
            disabled={disabled}
          >
            <i className="material-icons">info</i>
          </Tooltip>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.iconHover, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Trigger: click</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Tooltip
            trigger="click"
            text="This is a tooltip"
            onToggle={onChange.bind(null, 'clickOnly')}
            disabled={disabled}
          >
            <span>Click to display a tooltip !</span>
          </Tooltip>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.clickOnly, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Container: #testContainer</h2>
      <div
        id="testContainer"
        className="row mt-5"
        style={{ position: 'relative' }}
      >
        <div className="col-6">
          <Tooltip
            container="#testContainer"
            text="This is a tooltip"
            onToggle={onChange.bind(null, 'differentContainer')}
            disabled={disabled}
          >
            <span>Hover me !</span>
          </Tooltip>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.differentContainer, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Animated</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Tooltip
            text="This is a tooltip"
            onToggle={onChange.bind(null, 'animated')}
            disabled={disabled}
            animate={tooltip => (
              <CSSTransition
                in={state.animated}
                appear
                unmountOnExit={true}
                timeout={300}
                classNames="fade-in"
                children={tooltip}
              />
            )}
          >
            <span>Click to display a tooltip !</span>
          </Tooltip>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.animated, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">forceUpdate</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Tooltip
            placement="top"
            text={state.showLongText
              ? 'This is a long tooltip text'
              : 'This is a tooltip'
            }
            ref={forceUpdateTooltipRef}
            onToggle={onChange.bind(null, 'forceUpdate')}
            disabled={disabled}
          >
            <span
              role="presentation"
              onClick={toggleLongText.bind(null)}
            >
              Hover me then click me
            </span>
          </Tooltip>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.forceUpdate, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
