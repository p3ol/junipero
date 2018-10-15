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
      <div>
        <h1>TextField example</h1>
        <TextField
          required={true}
          onChange={this.onChange.bind(this)}
        />
        <p>Current value :</p>
        <pre>{ JSON.stringify(this.state.field)}</pre>
      </div>
    );
  }

}

export default TextFieldPage;
