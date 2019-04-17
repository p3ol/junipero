import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';

import rootReducer from '../reducers';

import Home from './Home';
import TextFieldPage from '../containers/TextFieldPage';
import CodeFieldPage from '../containers/CodeFieldPage';
import CheckBoxPage from '../containers/CheckBoxPage';
import SelectFieldPage from '../containers/SelectFieldPage';
import SliderPage from '../containers/SliderPage';
import TogglePage from '../containers/TogglePage';
import DateFieldPage from '../containers/DateFieldPage';
import ButtonPage from '../containers/ButtonPage';
import TagsFieldPage from '../containers/TagsFieldPage';
import BreadCrumbPage from '../containers/BreadCrumbPage';
import TooltipPage from '../containers/TooltipPage';
import TabsPage from '../containers/TabsPage';
import ModalPage from '../containers/ModalPage';
import ColorPickerPage from '../containers/ColorPickerPage';
import SwitchPage from '../containers/SwitchPage';
import DropdownPage from '../containers/DropdownPage';

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

    this.history = createBrowserHistory();
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
              <Route exact path="/code-field" component={CodeFieldPage} />
              <Route exact path="/check-box" component={CheckBoxPage} />
              <Route exact path="/select-field" component={SelectFieldPage} />
              <Route exact path="/slider" component={SliderPage} />
              <Route exact path="/toggle" component={TogglePage} />
              <Route exact path="/date-field" component={DateFieldPage} />
              <Route exact path="/button" component={ButtonPage} />
              <Route exact path="/tags-field" component={TagsFieldPage} />
              <Route exact path="/bread-crumb" component={BreadCrumbPage} />
              <Route exact path="/tooltip" component={TooltipPage} />
              <Route exact path="/tabs" component={TabsPage} />
              <Route exact path="/modal" component={ModalPage} />
              <Route exact path="/color-picker" component={ColorPickerPage} />
              <Route exact path="/switch" component={SwitchPage} />
              <Route exact path="/dropdown" component={DropdownPage} />
            </Switch>
          </Router>

          <Toolbox />
        </React.Fragment>
      </Provider>
    );
  }

}

export default App;
