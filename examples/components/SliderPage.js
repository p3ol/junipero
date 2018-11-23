import React from 'react';
import { Link } from 'react-router-dom';

import { Slider } from '@poool/junipero';

class SliderPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      unthemed: {},
      decimals: {},
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>Slider example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Slider
              value={0}
              min={0}
              max={100}
              step={1}
              label="Count"
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
            <Slider
              theme="none"
              value={0}
              min={0}
              max={100}
              step={1}
              label="Count"
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'unthemed')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.unthemed, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">0.1 step</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Slider
              value={0}
              min={0}
              max={100}
              step={0.1}
              label="Count"
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this, 'decimals')}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.decimals, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default SliderPage;
