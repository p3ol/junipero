import React from 'react';
import { Link } from 'react-router-dom';

import { SelectField } from '@poool/junipero';

class SelectFieldPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      default: {},
      objects: {},
      objectsForceValue: {},
      autocomplete: {},
    };

    this.objectOptions = [
      { title: '5 items', value: 5 },
      { title: '10 items', value: 10 },
      { title: '15 items', value: 15 },
      { title: '20 items with a very very long name', value: 20 },
    ];

    this.autoCompleteOptions = [
      'Dave',
      'Astrid',
      'Freeman',
      'Lizbeth',
      'Annette',
    ];
  }

  onChange(name, field) {
    this.setState({ [name]: field });
  }

  render() {
    return (
      <div className="container">
        <p><Link to="/">Back</Link></p>
        <h1>SelectField example</h1>

        <h2 className="mt-5">Default</h2>
        <div className="row mt-5">
          <div className="col-6">
            <SelectField
              required={true}
              label="Label"
              disabled={this.props.disabled}
              error={this.props.error}
              valid={!this.props.error}
              boxed={this.props.boxed}
              onChange={this.onChange.bind(this, 'default')}
              emptyComponent="Select one..."
              options={[
                5,
                10,
                15,
                20,
              ]}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Object options</h2>
        <div className="row mt-5">
          <div className="col-6">
            <SelectField
              required={true}
              label="Label"
              disabled={this.props.disabled}
              boxed={this.props.boxed}
              error={this.props.error}
              valid={!this.props.error}
              onChange={this.onChange.bind(this, 'objects')}
              emptyComponent="Select one..."
              options={this.objectOptions}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.objects, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Object options with value enforced</h2>
        <div className="row mt-5">
          <div className="col-6">
            <SelectField
              required={true}
              label="Label"
              disabled={this.props.disabled}
              boxed={this.props.boxed}
              error={this.props.error}
              valid={!this.props.error}
              forceValue={true}
              onChange={this.onChange.bind(this, 'objectsForceValue')}
              emptyComponent="Select one..."
              options={this.objectOptions}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.objectsForceValue, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Auto-Complete</h2>
        <div className="row mt-5">
          <div className="col-6">
            <SelectField
              required={true}
              label="Label"
              disabled={this.props.disabled}
              boxed={this.props.boxed}
              error={this.props.error}
              valid={!this.props.error}
              value={this.autoCompleteOptions[0]}
              onChange={this.onChange.bind(this, 'autocomplete')}
              emptyComponent="Select one..."
              options={this.autoCompleteOptions}
              autoComplete={(val, cb) => {
                const search = new RegExp(val, 'ig');
                cb(this.autoCompleteOptions.filter((item) => (
                  search.test(item)
                )));
              }}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.autocomplete, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default SelectFieldPage;
