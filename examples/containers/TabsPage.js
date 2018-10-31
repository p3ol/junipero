import { connect } from 'react-redux';

import TabsPage from '../components/TabsPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(TabsPage);
