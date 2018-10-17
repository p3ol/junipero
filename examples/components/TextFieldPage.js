import React from 'react';

import { TextField } from '@poool/undefined';

class TextFieldPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      field: {},
    };
  }

  onChange(field) {
    this.setState({ field });
  }

  render() {
    return (
      <div className="container">
        <h1>TextField example</h1>

        <div className="row mt-5">
          <div className="col-6">
            <TextField
              style={{ marginTop: 10 }}
              label="Label"
              required={true}
              error={this.props.error}
              placeholder={this.props.placeholder}
              disabled={this.props.disabled}
              onChange={this.onChange.bind(this)}
            />
          </div>
          <div className="col-6">
            <p>Current value :</p>
            <pre>{ JSON.stringify(this.state.field)}</pre>
          </div>
        </div>
      </div>
    );
  }

}

export default TextFieldPage;
