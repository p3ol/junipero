import {
  type ChangeEvent,
  type FocusEvent,
  type RefObject,
  type WheelEvent,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { classNames, exists } from '@junipero/core';

import type {
  FieldContent,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import { mockState } from '../utils';
import { useFieldControl } from '../hooks';

export declare interface TextFieldRef extends JuniperoRef {
  dirty: boolean;
  focused: boolean;
  valid: boolean;
  value: string | number;
  blur(): void;
  focus(): void;
  reset(): void;
  setDirty(dirty: boolean): void;
  innerRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>;
}

export declare interface TextFieldProps
  extends SpecialComponentPropsWithRef<any, TextFieldRef> {
  autoFocus?: boolean;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  valid?: boolean;
  value?: string | number;
  onBlur?(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onChange?(field: FieldContent<string | number>): void;
  onFocus?(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onWheel?(event: WheelEvent<HTMLInputElement | HTMLTextAreaElement>): void;
  onValidate?(
    val: string | number,
    flags: { required: boolean; dirty: boolean }
  ): boolean;
}

export declare interface TextFieldState {
  value: string | number;
  valid: boolean;
  dirty: boolean;
  focused: boolean;
}

const TextField = ({
  ref,
  autoFocus,
  children,
  className,
  valid,
  value,
  disabled = false,
  required = false,
  type = 'text',
  onBlur,
  onChange,
  onFocus,
  onWheel,
  onValidate = (val: string | number, opts?: { required: boolean }) =>
    !!val || !opts?.required,
  ...rest
}: TextFieldProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState<TextFieldState>, {
    value: value ?? '',
    valid: valid ?? false,
    focused: autoFocus ?? false,
    dirty: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    value: state.value,
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    focus,
    blur,
    reset,
    setDirty,
    isJunipero: true,
  }));

  useEffect(() => {
    if (exists(value)) {
      state.value = value;
      state.valid = onValidate(state.value, { dirty: state.dirty, required });
      dispatch({ value: state.value, valid: state.valid });
      updateControl?.({ valid: state.valid, dirty: state.dirty });
    }
  }, [value]);

  useEffect(() => {
    dispatch({ valid: valid ?? false });
    updateControl?.({ valid: state.valid });
  }, [valid]);

  const parseValue = (value?: string) => {
    const value_ = value.replace(',', '.');
    const parsedValue = parseFloat(value_);

    return !isNaN(parsedValue) ? parsedValue : value_;
  };

  const onChange_ = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    /* html input disabled attribute will prevent onChange if present anyway */
    /* istanbul ignore next: just in case */
    if (disabled) {
      return;
    }

    if (type === 'number') {
      value = parseValue(e?.target?.value);
    } else {
      value = e?.target?.value;
    }

    state.value = value;
    state.dirty = true;
    state.valid = onValidate(
      state.value, { dirty: state.dirty, required }
    );
    dispatch({ value: state.value, dirty: state.dirty });
    onChange?.({ value: state.value, valid: state.valid, dirty: state.dirty });
    updateControl?.({ dirty: true, valid: state.valid });
  };

  const onFocus_ = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ focused: true });
    updateControl?.({ focused: true });
    onFocus?.(e);
  };

  const onBlur_ = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ focused: false });
    updateControl?.({ focused: false });
    onBlur?.(e);
  };

  const focus = () => {
    inputRef.current?.focus();
  };

  const blur = () => {
    inputRef.current?.blur();
  };

  const reset = () => {
    dispatch({ value: value ?? '', valid: valid ?? false, dirty: false });
    updateControl?.({ dirty: false, valid: valid ?? false });
  };

  const isEmpty = () =>
    !exists(state.value) || state.value === '';

  const setDirty = (dirty: boolean) => {
    state.dirty = dirty;
    dispatch({ dirty });
    updateControl?.({ dirty });
  };

  const Tag = rest.rows > 1 ? 'textarea' : 'input';

  return (
    <div
      ref={innerRef}
      className={classNames(
        'junipero',
        'text-field',
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        { empty: isEmpty(), focused: state.focused, disabled },
        className
      )}
    >
      <Tag
        { ...rest }
        autoFocus={autoFocus}
        className="field"
        ref={inputRef}
        disabled={disabled}
        required={required}
        type={Tag === 'textarea' ? undefined : type}
        value={state.value}
        onChange={onChange_}
        onFocus={onFocus_}
        onBlur={onBlur_}
        onWheel={onWheel ?? ((_: WheelEvent) => inputRef.current?.blur())}
      />
      { children }
    </div>
  );
};

TextField.displayName = 'TextField';

export default TextField;
