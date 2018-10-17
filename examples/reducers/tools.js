import {
  TOGGLE_DISABLED,
  TOGGLE_ERROR,
  TOGGLE_PLACEHOLDER,
} from '../actions/tools';

const tools = (state = {}, action) => {

  switch (action.type) {
    case TOGGLE_DISABLED:
      return {
        ...state,
        disabled: !state.disabled,
      };

    case TOGGLE_ERROR:
      return {
        ...state,
        error: state.error ? null : 'There is an error',
      };

    case TOGGLE_PLACEHOLDER:
      return {
        ...state,
        placeholder: state.placeholder ? null : 'Placeholder',
      };

    default:
      return state;
  }

};

export default tools;
