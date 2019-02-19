import React from 'react';
import { Link } from 'react-router-dom';

import { DateField } from '@poool/junipero';

class DateFieldPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      enhanced: {},
      unthemed: {},
      currentDay: {
        value: new Date(),
        valid: true,
      },
      customTitle: {},
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>DateField example</h1>

        <h2 className="mt-5">Default (native)</h2>
        <div className="row mt-5">
          <div className="col-6">
            <DateField
              native={true}
              placeholder="Pick a date"
              disabled={this.props.disabled}
              error={this.props.error}
              boxed={this.props.boxed}
              onChange={this.onChange.bind(this, 'default')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Default (enhanced)</h2>
        <div className="row mt-5">
          <div className="col-6">
            <DateField
              placeholder="Pick a date"
              disabled={this.props.disabled}
              error={this.props.error}
              boxed={this.props.boxed}
              onChange={this.onChange.bind(this, 'enhanced')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{JSON.stringify(this.state.enhanced, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Without theming</h2>
        <div className="row mt-5">
          <div className="col-6">
            <DateField
              theme="none"
              placeholder="Pick a date"
              disabled={this.props.disabled}
              error={this.props.error}
              boxed={this.props.boxed}
              onChange={this.onChange.bind(this, 'unthemed')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{JSON.stringify(this.state.unthemed, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Current Day</h2>
        <div className="row mt-5">
          <div className="col-6">
            <DateField
              label="Label"
              value={this.state.currentDay.value}
              disabled={this.props.disabled}
              error={this.props.error}
              boxed={this.props.boxed}
              onChange={this.onChange.bind(this, 'currentDay')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{JSON.stringify(this.state.currentDay, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Custom title</h2>
        <div className="row mt-5">
          <div className="col-6">
            <DateField
              label="Label"
              disabled={this.props.disabled}
              error={this.props.error}
              boxed={this.props.boxed}
              forceLabel={true}
              placeholder="Pick a date"
              onChange={this.onChange.bind(this, 'customTitle')}
              parseTitle={value => value.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{JSON.stringify(this.state.customTitle, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }
}

export default DateFieldPage;
