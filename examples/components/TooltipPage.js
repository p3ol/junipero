import React from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition }  from 'react-transition-group';

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
      showLongText: false,
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  toggleLongText() {
    this.setState({ showLongText: !this.state.showLongText });
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

        <h2 className="mt-5">Animated</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Tooltip
              text="This is a tooltip"
              onToggle={this.onChange.bind(this, 'animated')}
              disabled={this.props.disabled}
              animate={(tooltip) => (
                <CSSTransition
                  in={this.state.animated}
                  appear
                  unmountOnExit={true}
                  timeout={300}
                  classNames="fade-in"
                  children={tooltip}
                />
              )}
            >
              <span>Click to display a tooltip !</span>
            </Tooltip>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.animated, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">forceUpdate</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Tooltip
              placement="top"
              text={this.state.showLongText
                ? 'This is a long tooltip text'
                : 'This is a tooltip'
              }
              forceUpdate={true}
              onToggle={this.onChange.bind(this, 'forceUpdate')}
              disabled={this.props.disabled}
            >
              <span
                role="presentation"
                onClick={this.toggleLongText.bind(this)}
              >
                Hover me then click me
              </span>
            </Tooltip>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.forceUpdate, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default TooltipPage;
