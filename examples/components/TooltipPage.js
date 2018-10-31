import React from 'react';
import { Link } from 'react-router-dom';

import { Tooltip } from '@poool/junipero';

class TooltipPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: {},
      iconHover: {},
      clickOnly: {},
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
            <span
              id="text-hover-tooltip">
              Hover to display a tooltip !
            </span>
            <Tooltip
              elementId="text-hover-tooltip"
              placement="top"
              onToggle={this.onChange.bind(this, 'default')}
              disabled={this.props.disabled}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Icon - hiden arrow, place-right</h2>
        <div className="row mt-5">
          <div className="col-6">
            <i
              id="icon-hover-tooltip"
              className="material-icons">
              info
            </i>
            <Tooltip
              elementId="icon-hover-tooltip"
              placement="right"
              hideArrow={true}
              onToggle={this.onChange.bind(this, 'iconHover')}
              disabled={this.props.disabled}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.iconHover, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Display on click</h2>
        <div className="row mt-5">
          <div className="col-6">
            <span
              id="on-click-tooltip">
              Click to display a tooltip !
            </span>
            <Tooltip
              elementId="on-click-tooltip"
              placement="right"
              eventType="click"
              onToggle={this.onChange.bind(this, 'clickOnly')}
              disabled={this.props.disabled}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.clickOnly, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default TooltipPage;
