import React from 'react';
import { Link } from 'react-router-dom';

import { TextField } from '@poool/undefined';

class TextFieldPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      password: {},
      suffix: {},
      showPassword: false,
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
              label="Label"
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder={this.props.placeholder}
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'default')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Password</h2>
        <div className="row mt-5">
          <div className="col-6">
            <TextField
              label="Label"
              type={ this.state.showPassword ? 'text' : 'password'}
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder={this.props.placeholder}
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'password')}
              suffix={(
                <a
                  className="mr-2 ml-1"
                  tabIndex="0"
                  role="button"
                  onClick={this.togglePassword.bind(this)}
                >
                  <i className="material-icons">
                    { this.state.showPassword && 'visibility_off' ||
                      'visibility' }
                  </i>
                </a>
              )}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.password, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default TextFieldPage;
