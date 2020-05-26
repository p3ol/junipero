import React from 'react';
import { Link } from 'react-router-dom';

import { BreadCrumb } from '@poool/junipero';

const items = ['Access', 'Appearence', 'Messages', 'Scenarios'];

export default () => (
  <div className="container">
    <p><Link to="/">Back</Link></p>
    <h1>BreadCrumb Example</h1>
    <div className="row mt-5">
      <div className="col-12">
        <BreadCrumb items={items} />
      </div>
    </div>
  </div>
);
