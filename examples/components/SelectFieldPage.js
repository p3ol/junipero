import React from 'react';
import { Link } from 'react-router-dom';

import { SelectField } from '@poool/junipero';

class SelectFieldPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      default: {},
      enhanced: {},
      unthemed: {},
      objects: {},
      objectsForceValue: {},
      autocomplete: {},
    };

    this.options = [
      5,
      10,
      15,
      20,
    ];

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

        <h2 className="mt-5">Default (native)</h2>
        <div className="row mt-5">
          <div className="col-6">
            <SelectField
              native={true}
              required={true}
              disabled={this.props.disabled}
              error={this.props.error}
              boxed={this.props.boxed}
              onChange={this.onChange.bind(this, 'default')}
              placeholder="Select one..."
              options={this.options}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.default, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Default (enhanced)</h2>
        <div className="row mt-5">
          <div className="col-6">
            <SelectField
              required={true}
              disabled={this.props.disabled}
              error={this.props.error}
              boxed={this.props.boxed}
              onChange={this.onChange.bind(this, 'enhanced')}
              placeholder="Select one..."
              options={this.options}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.enhanced, null, 2)}</pre>
          </div>
        </div>

        <h2 className="mt-5">Without theming</h2>
        <div className="row mt-5">
          <div className="col-6">
            <SelectField
              required={true}
              disabled={this.props.disabled}
              error={this.props.error}
              boxed={this.props.boxed}
              onChange={this.onChange.bind(this, 'unthemed')}
              placeholder="Select one..."
              label="Label"
              theme="none"
              options={this.options}
            />
          </div>
          <div className="col-6">
            <p>Current state :</p>
            <pre>{ JSON.stringify(this.state.unthemed, null, 2)}</pre>
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
              onChange={this.onChange.bind(this, 'objects')}
              placeholder="Select one..."
              parseTitle={(item) => item.title}
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
              required={false}
              label="Label"
              disabled={this.props.disabled}
              boxed={this.props.boxed}
              error={this.props.error}
              value={15}
              parseValue={(item) => item.value}
              parseTitle={(item) => item.title}
              onChange={this.onChange.bind(this, 'objectsForceValue')}
              placeholder="Select one..."
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
              onChange={this.onChange.bind(this, 'autocomplete')}
              placeholder="Select one..."
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
