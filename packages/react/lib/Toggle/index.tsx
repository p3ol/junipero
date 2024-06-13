import {
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type MutableRefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { classNames, mockState } from '@junipero/core';

import type { FieldContent, JuniperoRef, StateReducer } from '../types';

export declare type ToggleValue = any;

export declare interface ToggleRef extends JuniperoRef {
  checked: boolean;
  innerRef: MutableRefObject<HTMLLabelElement>;
  inputRef: MutableRefObject<HTMLInputElement>;
}

export declare interface ToggleProps
  extends Omit<ComponentPropsWithRef<'input'>, 'onChange'> {
  checked?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  value?: ToggleValue;
  onChange?(field: FieldContent<ToggleValue>): void;
}

export declare interface ToggleState {
  checked: boolean;
}

const Toggle = forwardRef<ToggleRef, ToggleProps>(({
  checked = false,
  disabled = false,
  tabIndex = 1,
  children,
  className,
  value,
  onChange,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLLabelElement>();
  const inputRef = useRef<HTMLInputElement>();
  const [state, dispatch] = useReducer<StateReducer<ToggleState>>(mockState, {
    checked,
  });

  useEffect(() => {
    dispatch({ checked });
  }, [checked]);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    checked: state.checked,
    isJunipero: true,
  }));

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onChange_();
    }
  };

  const onChange_ = () => {
    if (disabled) {
      /* istanbul ignore next: canoot be tested */
      return;
    }

    state.checked = !state.checked;

    dispatch({ checked: state.checked });
    onChange?.({ value, checked: state.checked });
  };

  return (
    <label
      ref={innerRef}
      className={classNames(
        'junipero',
        'toggle-field',
        {
          disabled,
          checked: state.checked,
        },
        className
      )}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      <input
        { ...rest }
        ref={inputRef}
        type="checkbox"
        value={value}
        disabled={disabled}
        checked={state.checked}
        onChange={onChange_}
        tabIndex={-1}
      />
      <div className="inner">
        <div className="handle" />
      </div>
      { children && (
        <div className="label">
          { children }
        </div>
      ) }
    </label>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;
