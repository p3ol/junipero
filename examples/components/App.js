import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import Home from './Home';
import TextFieldPage from './TextFieldPage';

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
      <Router history={this.history}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/text-field" component={TextFieldPage} />
        </Switch>
      </Router>
    );
  }

}

export default App;
