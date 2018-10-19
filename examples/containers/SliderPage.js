import { connect } from 'react-redux';

import SliderPage from '../components/SliderPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(SliderPage);
