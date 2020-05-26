import React, { useReducer, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { mockState } from '../services/reducers';
import { Modal } from '@poool/junipero';

export default () => {
  const defaultModalRef = useRef();
  const unthemedModalRef = useRef();
  const cssOnlyModalRef = useRef();
  const animatedModalRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    default: {},
    unthemed: {},
    cssOnly: {},
    animated: false,
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>Modal example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Modal ref={defaultModalRef}>
            test
          </Modal>
          <button onClick={() => defaultModalRef.current.open()}>
            Open me
          </button>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.default, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Without theming</h2>
      <div className="row mt-5">
        <div className="col-6">

          <Modal theme="none" ref={unthemedModalRef}>
            test without theming
          </Modal>
          <button onClick={() => unthemedModalRef.current.open()}>
            Open me
          </button>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.unthemed, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">CSS only apparition</h2>
      <div className="row mt-5">
        <div className="col-6">

          <Modal apparition="css" ref={cssOnlyModalRef}>
            test with css apparition
          </Modal>
          <button onClick={() => cssOnlyModalRef.current.open()}>
            Open me
          </button>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.cssOnly, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Animated</h2>
      <div className="row mt-5">
        <div className="col-6">

          <Modal
            ref={animatedModalRef}
            onToggle={onChange.bind(null, 'animated')}
            animate={modal => (
              <CSSTransition
                in={state.animated}
                appear
                unmountOnExit={true}
                timeout={600}
                classNames="fade-in-modal"
                children={modal}
              />
            )}
            animateContent={(content) => (
              <CSSTransition
                in={state.animated}
                appear
                unmountOnExit={true}
                timeout={600}
                classNames="slide-in-up"
                children={content}
              />
            )}
          >
            test with animation
          </Modal>
          <button onClick={() => animatedModalRef.current.open()}>
            Open me
          </button>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.animated, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
