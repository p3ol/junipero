import { connect } from 'react-redux';

import {
  toggleDisabled,
  toggleError,
  togglePlaceholder,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbox);
