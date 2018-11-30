import React from 'react';
import { Link } from 'react-router-dom';

import { Switch } from '@poool/junipero';

class SwitchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      unthemed: {},
      objectOptions: {},
      withValue: {},
    };

    this.options = [
      'Left',
      'Middle',
      'Right',
    ];

    this.objectOptions = [
      { title: 'Left', value: 0 },
      { title: 'Middle', value: 1 },
      { title: 'Right', value: false },
    ];
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>Switch example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Switch
              required={true}
              disabled={this.props.disabled}
              options={this.options}
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
            <Switch
              theme="none"
              required={true}
              disabled={this.props.disabled}
              options={this.options}
              onChange={this.onChange.bind(this, 'unthemed')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.unthemed, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Objects options</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Switch
              required={true}
              options={this.objectOptions}
              parseTitle={(option) => option.title}
              onChange={this.onChange.bind(this, 'objectOptions')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.objectOptions, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">With value set</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Switch
              required={true}
              options={this.objectOptions}
              parseTitle={(option) => option.title}
              value={this.objectOptions[2]}
              onChange={this.onChange.bind(this, 'withValue')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.withValue, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default SwitchPage;
