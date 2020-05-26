import React, { useEffect, useReducer } from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { defaultHistory } from '../services/history';
import { AppContext } from '../services/contexts';
import { mockState } from '../services/reducers';
import Home from './Home';
import TextFieldPage from './TextFieldPage';
import CodeFieldPage from './CodeFieldPage';
import CheckBoxPage from './CheckBoxPage';
import SelectFieldPage from './SelectFieldPage';
import SliderPage from './SliderPage';
import TogglePage from './TogglePage';
import DateFieldPage from './DateFieldPage';
import ButtonPage from './ButtonPage';
import TagsFieldPage from './TagsFieldPage';
import BreadCrumbPage from './BreadCrumbPage';
import TooltipPage from './TooltipPage';
import TabsPage from './TabsPage';
import ModalPage from './ModalPage';
import ColorPickerPage from './ColorPickerPage';
import SwitchPage from './SwitchPage';
import DropdownPage from './DropdownPage';
import Toolbox from './Toolbox';

export default () => {
  const [state, dispatch] = useReducer(mockState, {});

  useEffect(() => {
    return defaultHistory.listen(() => window.scrollTo(0, 0));
  }, []);

  const getContext = () => ({
    ...state,
    update: dispatch,
  });

  return (
    <AppContext.Provider value={getContext()}>
      <>
        <Router history={defaultHistory}>
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
      </>
    </AppContext.Provider>
  );
};
