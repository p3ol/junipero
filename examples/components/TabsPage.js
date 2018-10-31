import React from 'react';
import { Link } from 'react-router-dom';

import { Tabs, Tab } from '@poool/junipero';

class TabsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      default: 0,
    };
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>Tabs example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <Tabs
              disabled={this.props.disabled}
              activeTab={this.state.default}
              onChange={this.onChange.bind(this, 'default')}
            >
              <Tab title="Tab 1">
                Content 1
              </Tab>
              <Tab title="Disabled tab" disabled={true}>
                Content 2
              </Tab>
              <Tab title={(<strong>Bold title tab</strong>)}>
                Content 3
              </Tab>
            </Tabs>
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default TabsPage;
