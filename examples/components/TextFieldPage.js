import React from 'react';
import { Link } from 'react-router-dom';

import { TextField } from '@poool/junipero';

class TextFieldPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      number: {},
      unthemed: {},
      password: {},
      suffix: {},
      multiline: {},
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  togglePassword() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>TextField example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TextField
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Label"
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'default')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Without theming</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TextField
              theme="none"
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Label"
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'unthemed')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.unthemed, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Number</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TextField
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Label"
              disabled={this.props.disabled}
              value={0}
              onChange={this.onChange.bind(this, 'number')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.number, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Password</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TextField
              type="password"
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Label"
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'password')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.password, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Multiline</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TextField
              rows={5}
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Label"
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'multiline')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.multiline, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default TextFieldPage;
