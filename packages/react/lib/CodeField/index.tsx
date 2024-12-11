import {
  type RefObject,
  type ClipboardEvent,
  type FocusEvent,
  type ChangeEvent,
  useReducer,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';
import { classNames, mockState } from '@junipero/core';

import type {
  FieldContent,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import { useFieldControl } from '../hooks';

export declare interface CodeFieldRef extends JuniperoRef {
  dirty: boolean;
  valid: boolean;
  value: string;
  focus(index: number): void;
  blur(index: number): void;
  reset(): void;
  innerRef: RefObject<HTMLDivElement>;
  inputsRef: RefObject<Array<HTMLInputElement>>;
  inputRef: RefObject<HTMLInputElement>;
}

export declare interface CodeFieldProps extends Omit<
  SpecialComponentPropsWithRef<'div', CodeFieldRef>,
  'onChange' | 'onFocus' | 'onBlur'
> {
  autoFocus?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  size?: number;
  valid?: boolean;
  value?: string;
  onValidate?(
    value: string,
    { dirty, required }: { dirty?: boolean; required?: boolean }
  ): boolean;
  onChange?(field: FieldContent<string>): void;
  onPaste?(e: ClipboardEvent): void;
  onFocus?(e: FocusEvent<HTMLInputElement>): void;
  onBlur?(e: FocusEvent<HTMLInputElement>): void;
}

export declare interface CodeFieldState {
  values: Array<string>;
  valid: boolean;
  dirty: boolean;
  active: number;
}

const CodeField = ({
  ref,
  className,
  id,
  name,
  value,
  valid,
  autoFocus = false,
  disabled = false,
  required = false,
  size = 6,
  onChange,
  onPaste,
  onFocus,
  onBlur,
  onValidate = (val, { required } = {}) => !!val || !required,
  ...rest
}: CodeFieldProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState<CodeFieldState>, {
    valid: valid ?? false,
    values: value?.split('').slice(0, size) || [],
    dirty: false,
    active: autoFocus ? 0 : -1,
  });

  useImperativeHandle(ref, () => ({
    value: state.values?.join(''),
    dirty: state.dirty,
    valid: state.valid,
    focus,
    blur,
    reset,
    innerRef,
    inputsRef,
    inputRef,
    isJunipero: true,
  }));

  useEffect(() => {
    if (value) {
      state.values = value.split('').slice(0, size);
      state.valid = onValidate(value, { dirty: state.dirty, required });
      dispatch({ values: state.values, valid: state.valid });
      updateControl?.({ valid: state.valid, dirty: state.dirty });
    }
  }, [value]);

  useEffect(() => {
    dispatch({ valid: valid ?? false });
    updateControl?.({ valid: state.valid });
  }, [valid]);

  const focus = (index: number = 0) => {
    inputsRef.current[index]?.focus();
  };

  const blur = (index: number) => {
    inputsRef.current[index]?.blur();
  };

  const reset = () => {
    dispatch({
      dirty: false,
      values: value?.split('').slice(0, size) || [],
      valid: valid ?? false,
    });
    updateControl?.({ dirty: false, valid: valid ?? false });
  };

  const onChange_ = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return;
    }

    state.values[index] = e?.target?.value || '';
    state.valid = onValidate?.(state.values.join(''),
      { dirty: state.dirty, required }) || false;
    dispatch({ values: state.values, dirty: true, valid: state.valid });
    onChange?.({ value: state.values.join(''), valid: state.valid });
    updateControl?.({ dirty: true, valid: state.valid });

    if (state.values[index]) {
      focus(index + 1);
    }
  };

  const onKeyDown_ = (index: number, e: KeyboardEvent) => {
    if (disabled) {
      return;
    }

    const current = inputsRef.current?.[index];
    const prev = inputsRef.current?.[index - 1];
    const next = inputsRef.current?.[index + 1];

    switch (e.key) {
      case 'Backspace':
        if (
          current.selectionStart !== current.selectionEnd ||
          current.selectionStart === 1 ||
          index === 0
        ) {
          return;
        }

        onChange_(
          index - 1,
          { target: { value: '' } } as ChangeEvent<HTMLInputElement>
        );
        prev?.focus();
        break;

      case 'ArrowLeft':
        if (current.selectionStart !== current.selectionEnd || index === 0) {
          return;
        }

        prev.selectionStart = current.selectionStart;
        prev.selectionEnd = current.selectionStart;
        prev.focus();
        break;

      case 'ArrowRight':
        if (
          current.selectionStart !== current.selectionEnd ||
          index === size - 1
        ) {
          return;
        }

        next.selectionStart = current.selectionStart;
        next.selectionEnd = current.selectionStart;
        next.focus();
        break;
    }
  };

  const onPaste_ = (e: ClipboardEvent) => {
    e.preventDefault();
    const value = e.clipboardData.getData('text/plain');

    state.values = value.split('').slice(0, size);
    state.valid = onValidate(value, { dirty: state.dirty, required });
    dispatch({ values: state.values, valid: state.valid });
    focus(Math.min(size - 1, state.values.length));
    onChange?.({ value: state.values.join(''), valid: state.valid });
    onPaste?.(e);
  };

  const onFocus_ = (index: number, e: FocusEvent<HTMLInputElement>) => {
    dispatch({ active: index });
    updateControl?.({ focused: true });
    onFocus?.(e);
  };

  const onBlur_ = (_: number, e: FocusEvent<HTMLInputElement>) => {
    dispatch({ active: -1 });
    updateControl?.({ focused: false });
    onBlur?.(e);
  };

  const isEmpty = () =>
    state.values?.length > 0;

  const inputs = useMemo(() => (
    Array.from({ length: size })
  ), [size]);

  return (
    <div
      { ...rest }
      className={classNames(
        'junipero',
        'code-field',
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        { empty: isEmpty(), focused: state.active !== -1, disabled },
        className
      )}
      ref={innerRef}
    >
      { inputs.map((_, index) => (
        <input
          ref={ref => { inputsRef.current[index] = ref; }}
          disabled={disabled}
          size={1}
          maxLength={1}
          autoFocus={index === 0 && autoFocus}
          type="tel"
          className={classNames({ active: index === state.active })}
          key={index}
          value={state.values[index] || ''}
          required={required}
          onChange={onChange_.bind(null, index)}
          onKeyDown={onKeyDown_.bind(null, index)}
          onFocus={onFocus_.bind(null, index)}
          onBlur={onBlur_.bind(null, index)}
          onPaste={onPaste_}
        />
      )) }
      <input
        ref={inputRef}
        type="hidden"
        name={name}
        id={id}
        value={state.values?.join?.('') || ''}
      />
    </div>
  );
};

CodeField.displayName = 'CodeField';

export default CodeField;
