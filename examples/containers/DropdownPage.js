import { connect } from 'react-redux';

import DropdownPage from '../components/DropdownPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(DropdownPage);
