import { connect } from 'react-redux';

import TextFieldPage from '../components/TextFieldPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
    error: state.tools.error,
    boxed: state.tools.boxed,
  };
};

export default connect(mapStateToProps)(TextFieldPage);
