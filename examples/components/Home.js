import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className="container">
    <h1>Junipero - Examples</h1>

    <h2>Components</h2>
    <ul>
      <li><Link to="/bread-crumb">BreadCrumb</Link></li>
      <li><Link to="/button">Button</Link></li>
      <li><Link to="/check-box">CheckBox</Link></li>
      <li><Link to="/code-field">CodeField</Link></li>
      <li><Link to="/color-picker">ColorPicker</Link></li>
      <li><Link to="/date-field">DateField</Link></li>
      <li><Link to="/dropdown">Dropdown</Link></li>
      <li><Link to="/modal">Modal</Link></li>
      <li><Link to="/radio-field">RadioField</Link></li>
      <li><Link to="/select-field">SelectField</Link></li>
      <li><Link to="/slider">Slider</Link></li>
      <li><Link to="/switch">Switch</Link></li>
      <li><Link to="/tabs">Tabs</Link></li>
      <li><Link to="/tags-field">TagsField</Link></li>
      <li><Link to="/text-field">TextField</Link></li>
      <li><Link to="/toggle">Toggle</Link></li>
      <li><Link to="/tooltip">Tooltip</Link></li>
    </ul>
  </div>
);
