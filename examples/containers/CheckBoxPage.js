import { connect } from 'react-redux';

import CheckBoxPage from '../components/CheckBoxPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(CheckBoxPage);
