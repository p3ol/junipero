import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@poool/junipero';

class ButtonPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: 0,
      primary: 0,
      danger: 0,
    };
  }

  onClick(name) {
    this.setState({ [name]: this.state[name] + 1 });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>Button example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Button
              disabled={this.props.disabled}
              onClick={this.onClick.bind(this, 'default')}
            >
              Label
            </Button>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>Clicked : { this.state.default }</pre>
          </div>
        </div>

        <h2 className="mt-5">Primary</h2>
        <div className="row mt-5">
          <div className="col-6">
            <p>
              <Button
                type="primary"
                disabled={this.props.disabled}
                onClick={this.onClick.bind(this, 'primary')}
              >
                Label
              </Button>
              <Button
                className="ml-2"
                type="primary"
                reversed={true}
                disabled={this.props.disabled}
                onClick={this.onClick.bind(this, 'primary')}
              >
                Label
              </Button>
            </p>
            <p className="mt-4">
              <Button
                type="primary"
                size="big"
                disabled={this.props.disabled}
                onClick={this.onClick.bind(this, 'primary')}
              >
                Label
              </Button>
              <Button
                className="ml-2"
                type="primary"
                size="big"
                reversed={true}
                disabled={this.props.disabled}
                onClick={this.onClick.bind(this, 'primary')}
              >
                Label
              </Button>
            </p>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>Clicked : { this.state.primary }</pre>
          </div>
        </div>

        <h2 className="mt-5">Danger</h2>
        <div className="row mt-5">
          <div className="col-6">
            <p>
              <Button
                type="danger"
                disabled={this.props.disabled}
                onClick={this.onClick.bind(this, 'danger')}
              >
                Label
              </Button>
              <Button
                className="ml-2"
                type="danger"
                reversed={true}
                disabled={this.props.disabled}
                onClick={this.onClick.bind(this, 'danger')}
              >
                Label
              </Button>
            </p>
            <p className="mt-4">
              <Button
                type="danger"
                size="big"
                disabled={this.props.disabled}
                onClick={this.onClick.bind(this, 'danger')}
              >
                Label
              </Button>
              <Button
                className="ml-2"
                type="danger"
                size="big"
                reversed={true}
                disabled={this.props.disabled}
                onClick={this.onClick.bind(this, 'danger')}
              >
                Label
              </Button>
            </p>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>Clicked : { this.state.danger }</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default ButtonPage;
