import { connect } from 'react-redux';

import SwitchPage from '../components/SwitchPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(SwitchPage);
