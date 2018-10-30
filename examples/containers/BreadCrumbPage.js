import { connect } from 'react-redux';

import BreadCrumbPage from '../components/BreadCrumbPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
  };
};

export default connect(mapStateToProps)(BreadCrumbPage);
