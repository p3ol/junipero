import { useCallback, useReducer } from 'react';
import { mockState } from '@junipero/core';

import { FieldControlContext } from '../contexts';

const FieldControl = props => {
  const [state, dispatch] = useReducer(mockState, {
    valid: true,
    dirty: false,
    focused: false,
  });

  const getContext = useCallback(() => ({
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    update: dispatch,
  }), [state.valid, state.dirty, state.focused]);

  return (
    <FieldControlContext.Provider value={getContext()} {...props} />
  );
};

FieldControl.displayName = 'FieldControl';

export default FieldControl;
