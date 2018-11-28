import { connect } from 'react-redux';

import PhoneFieldPage from '../components/PhoneFieldPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
    error: state.tools.error,
    placeholder: state.tools.placeholder,
    boxed: state.tools.boxed,
  };
};

export default connect(mapStateToProps)(PhoneFieldPage);
