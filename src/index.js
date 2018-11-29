import { injectStyles } from './utils';

import TextField from './components/TextField';
import PhoneField from './components/PhoneField';
import CodeField from './components/CodeField';
import CheckBox from './components/CheckBox';
import SelectField from './components/SelectField';
import Slider from './components/Slider';
import Switch from './components/Switch';
import DateField from './components/DateField';
import Button from './components/Button';
import TagsField from './components/TagsField';
import BreadCrumb from './components/BreadCrumb';
import Tooltip from './components/Tooltip';
import Tabs from './components/Tabs';
import Tab from './components/Tab';
import Modal from './components/Modal';
import ColorPicker from './components/ColorPicker';

import styles from './theme/index.styl';
injectStyles(styles, { id: 'junipero-main-styles' });

export {
  TextField,
  PhoneField,
  CodeField,
  CheckBox,
  SelectField,
  Slider,
  Switch,
  DateField,
  Button,
  TagsField,
  BreadCrumb,
  Tooltip,
  Tabs,
  Tab,
  Modal,
  ColorPicker,
};
