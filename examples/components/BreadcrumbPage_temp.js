import React from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumb } from '@poool/junipero';

class BreadcrumbPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items : ['Access', 'Appearence', 'Messages', 'Scenarios'],
        }
    }

    render() {
        return(
            <div className="container">
                <p><Link to="/">Back</Link></p>
                <h1>Breadcrumb Example</h1>
                <div className="row mt-5">
                    <Breadcrumb items={this.state.items}/>
                </div>
            </div>
        );
    }
}

export default BreadcrumbPage;