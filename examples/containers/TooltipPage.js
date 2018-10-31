import { connect } from 'react-redux';

import TooltipPage from '../components/TooltipPage';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    disabled: state.tools.disabled,
  };
};

export default connect(mapStateToProps)(TooltipPage);
