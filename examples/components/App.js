import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import rootReducer from '../reducers';

import Home from './Home';
import TextFieldPage from '../containers/TextFieldPage';
import Toolbox from '../containers/Toolbox';

const store = createStore(
  rootReducer,
  applyMiddleware(
    createLogger(),
  )
);

class App extends React.Component {

  constructor(props) {
    super(props);

    this.history = createHistory();
    this.unlisten = this.history.listen(() => {
      window.scrollTo(0, 0);
    });
  }

  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
          <Router history={this.history}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/text-field" component={TextFieldPage} />
            </Switch>
          </Router>

          <Toolbox />
        </React.Fragment>
      </Provider>
    );
  }

}

export default App;
