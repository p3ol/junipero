import { connect } from 'react-redux';

import ModalPage from '../components/ModalPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ModalPage);
