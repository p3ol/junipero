import { connect } from 'react-redux';

import SelectFieldPage from '../components/SelectFieldPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
    error: state.tools.error,
    boxed: state.tools.boxed,
  };
};

export default connect(mapStateToProps)(SelectFieldPage);
