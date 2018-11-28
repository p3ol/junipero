import { connect } from 'react-redux';

import CodeFieldPage from '../components/CodeFieldPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
    error: state.tools.error,
  };
};

export default connect(mapStateToProps)(CodeFieldPage);
