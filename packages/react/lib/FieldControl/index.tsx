import { ComponentPropsWithRef, useCallback, useReducer } from 'react';
import { mockState } from '@junipero/core';

import { FieldControlContext, FieldContextType } from '../contexts';
import { MockState } from '../utils';

const FieldControl = (props: ComponentPropsWithRef<any>) => {

  type FieldControlState = {
    valid: boolean,
    dirty: boolean,
    focused: boolean,
  }
  const [state, dispatch] = useReducer<MockState<FieldControlState>>(
    mockState, {
      valid: true,
      dirty: false,
      focused: false,
    }
  );

  const getContext = useCallback<() => FieldContextType>(() => ({
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
