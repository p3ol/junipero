import {
  type RefObject,
  type KeyboardEvent,
  type ChangeEvent,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { classNames, mockState } from '@junipero/core';

import type {
  FieldContent,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
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
  onKeyDown,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    checked: state.checked,
    isJunipero: true,
  }));

  const onKeyDown_ = (e: KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault?.();

      state.checked = !state.checked;
      const valid = onValidate?.(state.checked, { dirty: true, required });
      dispatch({ checked: state.checked, valid, dirty: true });
      onChange?.({ value, checked: state.checked });
      updateControl?.({ dirty: true, valid });
    }

    onKeyDown?.(e);
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
      onKeyDown={onKeyDown_}
      tabIndex={disabled ? -1 : 1}
      // WCAG 2.0
      role="checkbox"
      aria-checked={state.checked}
      aria-disabled={disabled}
      aria-required={required}
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
