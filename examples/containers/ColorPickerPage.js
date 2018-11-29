import { connect } from 'react-redux';

import ColorPickerPage from '../components/ColorPickerPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
    error: state.tools.error,
    boxed: state.tools.boxed,
  };
};

export default connect(mapStateToProps)(ColorPickerPage);
