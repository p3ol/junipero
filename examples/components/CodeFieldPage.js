import React from 'react';
import { Link } from 'react-router-dom';

import { CodeField } from '@poool/junipero';

class CodeFieldPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      unthemed: {},
      threeNumbers: {},
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>CodeField example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <CodeField
              required={true}
              autofocus={true}
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
            <CodeField
              theme="none"
              required={true}
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'unthemed')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.unthemed, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Three digits, only numbers</h2>
        <div className="row mt-5">
          <div className="col-6">
            <CodeField
              required={true}
              size={3}
              validate={(value) => /^[0-9]*$/.test(value)}
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'threeNumbers')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.threeNumbers, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default CodeFieldPage;
