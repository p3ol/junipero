import { connect } from 'react-redux';

import TogglePage from '../components/TogglePage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(TogglePage);
