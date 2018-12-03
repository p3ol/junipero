import React from 'react';
import { Link } from 'react-router-dom';

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from '@poool/junipero';

class DropdownPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: false,
      unthemed: false,
      cssOnly: false,
      customTag: false,
      bodyContainer: false,
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>Dropdown example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Dropdown
              isOpen={this.state.default}
              disabled={this.props.disabled}
              onToggle={this.onChange.bind(this, 'default')}
            >
              <DropdownToggle>Click me</DropdownToggle>
              <DropdownMenu>
                <DropdownItem><a>Test 1</a></DropdownItem>
                <DropdownItem><a>Test 2</a></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Without theming</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Dropdown
              theme="none"
              isOpen={this.state.unthemed}
              disabled={this.props.disabled}
              onToggle={this.onChange.bind(this, 'unthemed')}
            >
              <DropdownToggle>Click me</DropdownToggle>
              <DropdownMenu>
                <DropdownItem><a>Test 1</a></DropdownItem>
                <DropdownItem><a>Test 2</a></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.unthemed, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">CSS only apparition</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Dropdown
              isOpen={this.state.cssOnly}
              disabled={this.props.disabled}
              onToggle={this.onChange.bind(this, 'cssOnly')}
            >
              <DropdownToggle>Click me</DropdownToggle>
              <DropdownMenu
                apparition="css"
              >
                <DropdownItem><a>Test 1</a></DropdownItem>
                <DropdownItem><a>Test 2</a></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.cssOnly, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Custom toggle tag</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Dropdown
              isOpen={this.state.customTag}
              disabled={this.props.disabled}
              onToggle={this.onChange.bind(this, 'customTag')}
            >
              <DropdownToggle tag="a">Click me</DropdownToggle>
              <DropdownMenu>
                <DropdownItem><a>Test 1</a></DropdownItem>
                <DropdownItem><a>Test 2</a></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.customTag, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Container: body</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Dropdown
              isOpen={this.state.bodyContainer}
              disabled={this.props.disabled}
              onToggle={this.onChange.bind(this, 'bodyContainer')}
            >
              <DropdownToggle>Click me</DropdownToggle>
              <DropdownMenu container="body">
                <DropdownItem><a>Test 1</a></DropdownItem>
                <DropdownItem><a>Test 2</a></DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.bodyContainer, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default DropdownPage;
