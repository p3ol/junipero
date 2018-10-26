import { connect } from 'react-redux';

import BreadcrumbPage from '../components/BreadcrumbPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(BreadcrumbPage);