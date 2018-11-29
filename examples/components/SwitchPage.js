import React from 'react';
import { Link } from 'react-router-dom';

import { Switch } from '@poool/junipero';

class SwitchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      unthemed: {},
      objects: {},
    };
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
              options={['Left', 'Middle', 'Right']}
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
              options={['Left', 'Middle', 'Right']}
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
              disabled={this.props.disabled}
              options={[
                { title: 'Left', value: 0 },
                { title: 'Middle', value: 1 },
                { title: 'Right', value: false },
              ]}
              parseTitle={(option) => option.title}
              onChange={this.onChange.bind(this, 'objects')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.objects, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default SwitchPage;
