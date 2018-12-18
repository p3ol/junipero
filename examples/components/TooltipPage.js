import React from 'react';
import { Link } from 'react-router-dom';

import { Tooltip } from '@poool/junipero';

class TooltipPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: false,
      withoutTheming: false,
      iconHover: false,
      clickOnly: false,
      differentContainer: false,
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>Tooltip example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Tooltip
              placement="top"
              text="This is a tooltip"
              onToggle={this.onChange.bind(this, 'default')}
              disabled={this.props.disabled}
            >
              Hover to display a tooltip !
            </Tooltip>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Without theming</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Tooltip
              theme="none"
              placement="top"
              text="This is a tooltip with kind of a long text but not too long"
              onToggle={this.onChange.bind(this, 'withoutTheming')}
              disabled={this.props.disabled}
            >
              <span>Hover to display a tooltip !</span>
            </Tooltip>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.withoutTheming, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Placement: right</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Tooltip
              placement="right"
              text="This is a tooltip"
              onToggle={this.onChange.bind(this, 'iconHover')}
              disabled={this.props.disabled}
            >
              <i className="material-icons">info</i>
            </Tooltip>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.iconHover, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Trigger: click</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Tooltip
              trigger="click"
              text="This is a tooltip"
              onToggle={this.onChange.bind(this, 'clickOnly')}
              disabled={this.props.disabled}
            >
              <span>Click to display a tooltip !</span>
            </Tooltip>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.clickOnly, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Container: #testContainer</h2>
        <div
          id="testContainer"
          className="row mt-5"
          style={{ position: 'relative' }}
        >
          <div className="col-6">
            <Tooltip
              container="#testContainer"
              text="This is a tooltip"
              onToggle={this.onChange.bind(this, 'differentContainer')}
              disabled={this.props.disabled}
            >
              <span>Hover me !</span>
            </Tooltip>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.differentContainer, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default TooltipPage;
