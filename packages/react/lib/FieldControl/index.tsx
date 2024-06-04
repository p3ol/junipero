import { ComponentPropsWithRef, useCallback, useReducer } from 'react';
import { type MockState, mockState } from '@junipero/core';

import { FieldControlContext, FieldContextType } from '../contexts';

export declare interface FieldControlState {
  valid: boolean;
  dirty: boolean;
  focused: boolean;
}

const FieldControl = (props: ComponentPropsWithRef<any>): JSX.Element => {
  const [state, dispatch] = useReducer<
    MockState<FieldControlState>
  >(mockState, {
    valid: true,
    dirty: false,
    focused: false,
  });

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
