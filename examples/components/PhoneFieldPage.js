import React from 'react';
import { Link } from 'react-router-dom';

import { PhoneField } from '@poool/junipero';

class PhoneFieldPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      unthemed: {},
      forcedCountry: {},
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>PhoneField example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <PhoneField
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
            <PhoneField
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

        <h2 className="mt-5">Force country</h2>
        <div className="row mt-5">
          <div className="col-6">
            <PhoneField
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Label"
              defaultCountry="fr"
              forceDefaultCountry={true}
              preferredCountries={[]}
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'forcedCountry')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.forcedCountry, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default PhoneFieldPage;
