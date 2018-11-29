import React from 'react';
import { Link } from 'react-router-dom';

import { ColorPicker } from '@poool/junipero';

class ColorPickerPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      enhanced: {},
      unthemed: {},
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>ColorPicker example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <ColorPicker
              native={true}
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              label="Label"
              value="#000000"
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'default')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Default (enhanced)</h2>
        <div className="row mt-5">
          <div className="col-6">
            <ColorPicker
              required={true}
              boxed={this.props.boxed}
              error={this.props.error}
              placeholder="Label"
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'enhanced')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.enhanced, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Without theming</h2>
        <div className="row mt-5">
          <div className="col-6">
            <ColorPicker
              required={true}
              theme="none"
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
      </div>
    );
  }

}

export default ColorPickerPage;
