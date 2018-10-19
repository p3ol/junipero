import React from 'react';
import { Link } from 'react-router-dom';

import { CheckBox } from '@poool/junipero';

class CheckBoxPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>CheckBox example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <CheckBox
              value="test"
              required={true}
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'default')}
            >
              Label
            </CheckBox>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default CheckBoxPage;
