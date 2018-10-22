import { connect } from 'react-redux';

import DateFieldPage from '../components/DateFieldPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(DateFieldPage);
