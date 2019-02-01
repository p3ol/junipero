import React from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition }  from 'react-transition-group';

import { Modal } from '@poool/junipero';

class ModalPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      unthemed: {},
      cssOnly: {},
      animated: false,
    };

    this.modals = {};
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>Modal example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Modal ref={(ref) => this.modals.default = ref}>
              test
            </Modal>
            <button onClick={() => this.modals.default.open()}>Open me</button>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Without theming</h2>
        <div className="row mt-5">
          <div className="col-6">

            <Modal theme="none" ref={(ref) => this.modals.unthemed = ref}>
              test without theming
            </Modal>
            <button onClick={() => this.modals.unthemed.open()}>Open me</button>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.unthemed, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">CSS only apparition</h2>
        <div className="row mt-5">
          <div className="col-6">

            <Modal apparition="css" ref={(ref) => this.modals.cssOnly = ref}>
              test with css apparition
            </Modal>
            <button onClick={() => this.modals.cssOnly.open()}>Open me</button>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.cssOnly, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Animated</h2>
        <div className="row mt-5">
          <div className="col-6">

            <Modal
              ref={(ref) => this.modals.animated = ref}
              onToggle={this.onChange.bind(this, 'animated')}
              animate={(modal) => (
                <CSSTransition
                  in={this.state.animated}
                  appear
                  unmountOnExit={true}
                  timeout={600}
                  classNames="fade-in-modal"
                  children={modal}
                />
              )}
              animateContent={(content) => (
                <CSSTransition
                  in={this.state.animated}
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
            <button onClick={() => this.modals.animated.open()}>Open me</button>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.animated, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default ModalPage;
