import {
  type RefObject,
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  FieldContent,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import { mockState } from '../utils';
import { useFieldControl } from '../hooks';
import { Check } from '../icons';

export declare interface CheckboxFieldRef extends JuniperoRef {
  checked: boolean;
  innerRef: RefObject<HTMLLabelElement>;
  inputRef: RefObject<HTMLInputElement>;
}

export declare interface CheckboxFieldProps extends Omit<
  SpecialComponentPropsWithRef<'label', CheckboxFieldRef>,
  'onChange'
> {
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  valid?: boolean;
  value?: any;
  onChange?(changeEvent: FieldContent): void;
  onValidate?(
    value: any,
    { dirty, required }: { dirty?: boolean; required?: boolean }
  ): boolean;
}

export declare interface CheckboxFieldState {
  checked: boolean;
  valid: boolean;
  dirty: boolean;
}

const CheckboxField = ({
  ref,
  children,
  value,
  id,
  name,
  className,
  checked = false,
  valid = true,
  disabled = false,
  required = false,
  onChange,
  onValidate = (val, { required }) => val || !required,
  ...rest
}: CheckboxFieldProps) => {
  const innerRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState<CheckboxFieldState>, {
    checked: checked ?? false,
    valid: valid ?? true,
    dirty: false,
  });

  useEffect(() => {
    const valid = onValidate(checked ?? false, {
      dirty: state.dirty, required,
    });
    dispatch({ checked: checked ?? false, valid });
    updateControl?.({ dirty: state.dirty, valid });
  }, [checked]);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    checked: state.checked,
    isJunipero: true,
  }));

  const onKeyPress_ = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault?.();

      state.checked = !state.checked;
      const valid = onValidate?.(state.checked, { dirty: true, required });
      dispatch({ checked: state.checked, valid, dirty: true });
      onChange?.({ value, checked: state.checked });
      updateControl?.({ dirty: true, valid });

      return false;
    }

    return true;
  };

  const onChange_ = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    const checked = e?.target?.checked ?? false;
    const valid = onValidate(checked, { dirty: true, required });
    dispatch({ checked, valid, dirty: true });
    onChange?.({ value, checked });
    updateControl?.({ dirty: true, valid });
  };

  return (
    <label
      htmlFor={id}
      { ...rest }
      ref={innerRef}
      className={classNames(
        'junipero',
        'checkbox-field',
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        {
          disabled,
          checked: state.checked,
        },
        className
      )}
      onKeyPress={onKeyPress_}
      tabIndex={disabled ? -1 : 1}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        ref={inputRef}
        value={checked ? value : ''}
        checked={state.checked}
        onChange={onChange_}
        tabIndex={-1}
      />
      <div className="inner">
        <Check />
      </div>
      <div className="content">{children}</div>
    </label>
  );
};

CheckboxField.displayName = 'CheckboxField';

export default CheckboxField;
