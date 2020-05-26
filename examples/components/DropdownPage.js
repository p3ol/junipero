import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@poool/junipero';

export default () => {
  const { disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: false,
    unthemed: false,
    cssOnly: false,
    customTag: false,
    button: false,
    bodyContainer: false,
    animated: false,
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>Dropdown example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Dropdown
            disabled={disabled}
            onToggle={onChange.bind(null, 'default')}
          >
            <DropdownToggle>Click me</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a>Test 1</a></DropdownItem>
              <DropdownItem><a>Test 2</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.default, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Without theming</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Dropdown
            theme="none"
            disabled={disabled}
            onToggle={onChange.bind(null, 'unthemed')}
          >
            <DropdownToggle>Click me</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a>Test 1</a></DropdownItem>
              <DropdownItem><a>Test 2</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.unthemed, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">With custom toggle</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Dropdown
            disabled={disabled}
            onToggle={onChange.bind(null, 'button')}
          >
            <DropdownToggle>
              <Button type="primary">Click me</Button>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a>Test 1</a></DropdownItem>
              <DropdownItem><a>Test 2</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.button, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">CSS only apparition</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Dropdown
            disabled={disabled}
            onToggle={onChange.bind(null, 'cssOnly')}
          >
            <DropdownToggle>Click me</DropdownToggle>
            <DropdownMenu
              apparition="css"
            >
              <DropdownItem><a>Test 1</a></DropdownItem>
              <DropdownItem><a>Test 2</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.cssOnly, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Custom toggle tag</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Dropdown
            disabled={disabled}
            onToggle={onChange.bind(null, 'customTag')}
          >
            <DropdownToggle tag="a">Click me</DropdownToggle>
            <DropdownMenu>
              <DropdownItem><a>Test 1</a></DropdownItem>
              <DropdownItem><a>Test 2</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.customTag, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Container: body</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Dropdown
            disabled={disabled}
            onToggle={onChange.bind(null, 'bodyContainer')}
          >
            <DropdownToggle>Click me</DropdownToggle>
            <DropdownMenu container="body">
              <DropdownItem><a>Test 1</a></DropdownItem>
              <DropdownItem><a>Test 2</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.bodyContainer, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Animated</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Dropdown
            disabled={disabled}
            onToggle={onChange.bind(null, 'animated')}
          >
            <DropdownToggle>Click me</DropdownToggle>
            <DropdownMenu
              animate={menu => (
                <CSSTransition
                  in={state.animated}
                  mountOnEnter={true}
                  unmountOnExit={true}
                  timeout={300}
                  classNames="slide-in-up-dropdown"
                  children={menu}
                />
              )}
            >
              <DropdownItem><a>Test 1</a></DropdownItem>
              <DropdownItem><a>Test 2</a></DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.animated, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
