import React, { useContext, useReducer } from 'react';
import { Link } from 'react-router-dom';

import { mockState } from '../services/reducers';
import { AppContext } from '../services/contexts';
import { Tabs, Tab } from '@poool/junipero';

export default () => {
  const { disabled } = useContext(AppContext);
  const [state, dispatch] = useReducer(mockState, {
    default: 0,
  });

  const onChange = (name, field) =>
    dispatch({ [name]: field });

  return (
    <div className="container">
      <p><Link to="/">Back</Link></p>
      <h1>Tabs example</h1>

      <h2 className="mt-5">Default</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Tabs
            disabled={disabled}
            activeTab={state.default}
            onChange={onChange.bind(null, 'default')}
          >
            <Tab title="Tab 1">
              Content 1
            </Tab>
            <Tab title="Disabled tab" disabled={true}>
              Content 2
            </Tab>
            <Tab title={<strong>Bold title tab</strong>}>
              Content 3
            </Tab>
          </Tabs>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.default, null, 2)}</pre>
        </div>
      </div>

      <h2 className="mt-5">Without theming</h2>
      <div className="row mt-5">
        <div className="col-6">
          <Tabs
            theme="none"
            disabled={disabled}
            activeTab={state.withoutTheming}
            onChange={onChange.bind(null, 'withoutTheming')}
          >
            <Tab title="Tab 1">
              Content 1
            </Tab>
            <Tab title="Disabled tab" disabled={true}>
              Content 2
            </Tab>
            <Tab title={<strong>Bold title tab</strong>}>
              Content 3
            </Tab>
          </Tabs>
        </div>
        <div className="col-6">
          <p>Current state:</p>
          <pre>{ JSON.stringify(state.withoutTheming, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};
