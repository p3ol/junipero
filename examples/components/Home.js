import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="container">
    <h1>Undefined - Examples</h1>

    <h2>Components</h2>
    <ul>
      <li><Link to="/text-field">TextField</Link></li>
      <li><Link to="/check-box">CheckBox</Link></li>
      <li><Link to="/select-field">SelectField</Link></li>
      <li><Link to="/slider">SliderPage</Link></li>
    </ul>
  </div>
);

export default Home;
