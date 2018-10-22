import React from 'react';
import { Link } from 'react-router-dom';

import { DateField } from '@poool/junipero';

class DateFieldPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      password: {},
      suffix: {},
      showPassword: false,
    };
  }

  // onChange(name, field) {
  //   this.setState({ [name]: field });
  // }
  //
  // togglePassword() {
  //   this.setState({ showPassword: !this.state.showPassword });
  // }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>DateField example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <DateField />
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

export default DateFieldPage;
