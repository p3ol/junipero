import { connect } from 'react-redux';

import ButtonPage from '../components/ButtonPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(ButtonPage);
