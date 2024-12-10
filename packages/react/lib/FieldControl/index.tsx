import { type ComponentPropsWithoutRef, useCallback, useReducer } from 'react';

import { type FieldContextType, FieldControlContext } from '../contexts';
import { mockState } from '../utils';

export declare interface FieldControlProps extends Omit<
  ComponentPropsWithoutRef<typeof FieldControlContext.Provider>, 'value'
> {}

export declare interface FieldControlState {
  valid: boolean;
  dirty: boolean;
  focused: boolean;
}

const FieldControl = (props: FieldControlProps) => {
  const [state, dispatch] = useReducer(mockState<FieldControlState>, {
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
    <FieldControlContext.Provider { ...props } value={getContext()} />
  );
};

FieldControl.displayName = 'FieldControl';

export default FieldControl;
