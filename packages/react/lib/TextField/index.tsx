import {
  type ChangeEvent,
  type ComponentPropsWithRef,
  type FocusEvent,
  type MutableRefObject,
  type ReactNode,
  type WheelEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { type MockState, classNames, mockState, exists } from '@junipero/core';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';

export declare type TextFieldChangeEvent = {
  value: string | number;
  valid: boolean;
  dirty: boolean
}

export declare type TextFieldRef = {
  dirty: boolean;
  focused: boolean;
  isJunipero: boolean;
  valid: boolean;
  value: string | number;
  blur(): void;
  focus(): void;
  reset(): void;
  setDirty(dirty: boolean): void;
  innerRef: MutableRefObject<HTMLDivElement>;
  inputRef: MutableRefObject<HTMLInputElement | HTMLTextAreaElement>;
};

export declare type TextFieldChangeField = {
  value: string | number;
  valid: boolean;
  dirty: boolean;
}

export declare interface TextFieldProps extends ComponentPropsWithRef<any> {
  autoFocus?: boolean;
  children?: ReactNode | JSX.Element;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  valid?: boolean;
  value?: string | number;
  onBlur?(event: FocusEvent): void;
  onChange?(
    field: TextFieldChangeEvent
  ): void;
  onFocus?(event: FocusEvent): void;
  onWheel?(event: WheelEvent): void;
  onValidate?(
    val: string | number,
    flags: { required: boolean; dirty: boolean }
  ): boolean;
  ref?: MutableRefObject<TextFieldRef | undefined>;
}

export declare interface TextFieldState {
  value: string | number;
  valid: boolean;
  dirty: boolean;
  focused: boolean;
}

const TextField = forwardRef(({
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
  onValidate = (val, { required }) => !!val || !required,
  ...rest
}: TextFieldProps, ref) => {
  const innerRef = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>();
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer <MockState<TextFieldState>>(mockState, {
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

  const onBlur_ = (e: FocusEvent) => {
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
});

TextField.displayName = 'TextField';
TextField.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  type: PropTypes.string,
  valid: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onWheel: PropTypes.func,
  onValidate: PropTypes.func,
};

export default TextField;
