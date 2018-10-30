import React from 'react';
import { Link } from 'react-router-dom';

import { BreadCrumb } from '@poool/junipero';

class BreadCrumbPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      items : ['Access', 'Appearence', 'Messages', 'Scenarios'],
    };
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>BreadCrumb Example</h1>
        <div className="row mt-5">
          <div className="col-12">
            <BreadCrumb items={this.state.items} />
          </div>
        </div>
      </div>
    );
  }
}

export default BreadCrumbPage;
