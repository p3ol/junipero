import { connect } from 'react-redux';

import {
  toggleDisabled,
  toggleError,
  togglePlaceholder,
  toggleBoxed,
} from '../actions/tools';

import Toolbox from '../components/Toolbox';

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleDisabled: () => {
      dispatch(toggleDisabled());
    },
    toggleError: () => {
      dispatch(toggleError());
    },
    togglePlaceholder: () => {
      dispatch(togglePlaceholder());
    },
    toggleBoxed: () => {
      dispatch(toggleBoxed());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox);
