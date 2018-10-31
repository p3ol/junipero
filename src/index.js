import { injectStyles } from './utils';

import TextField from './components/TextField';
import CheckBox from './components/CheckBox';
import SelectField from './components/SelectField';
import Slider from './components/Slider';
import Switch from './components/Switch';
import DateField from './components/DateField';
import Button from './components/Button';
import TagsField from './components/TagsField';
import BreadCrumb from './components/BreadCrumb';
import Tabs from './components/Tabs';
import Tab from './components/Tab';

import styles from './theme/index.styl';
injectStyles(styles, { id: 'junipero-main-styles' });

export {
  TextField,
  CheckBox,
  SelectField,
  Slider,
  Switch,
  DateField,
  Button,
  TagsField,
  BreadCrumb,
  Tabs,
  Tab,
};
