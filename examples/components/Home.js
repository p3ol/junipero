import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="container">
    <h1>Junipero - Examples</h1>

    <h2>Components</h2>
    <ul>
      <li><Link to="/text-field">TextField</Link></li>
      <li><Link to="/check-box">CheckBox</Link></li>
      <li><Link to="/select-field">SelectField</Link></li>
      <li><Link to="/slider">Slider</Link></li>
      <li><Link to="/switch">Switch</Link></li>
      <li><Link to="/date-field">DateField</Link></li>
      <li><Link to="/button">Button</Link></li>
      <li><Link to="/tags-field">TagsField</Link></li>
      <li><Link to="/bread-crumb">BreadCrumb</Link></li>
      <li><Link to="/tooltip">Tooltip</Link></li>
      <li><Link to="/tabs">Tabs</Link></li>
      <li><Link to="/modal">Modal</Link></li>
    </ul>
  </div>
);

export default Home;
