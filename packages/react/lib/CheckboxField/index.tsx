import {
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  forwardRef,
  MutableRefObject,
  ReactNode,
  ComponentPropsWithRef,
} from 'react';
import { classNames, mockState } from '@junipero/core';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';
import { Check } from '../icons';
import { ForwardedProps, MockState } from '../utils';

export declare type CheckboxFieldRef = {
  checked: boolean;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
  inputRef: MutableRefObject<any>;
};

declare interface CheckboxFieldProps extends ComponentPropsWithRef<any> {
  checked?: boolean;
  children?: ReactNode | JSX.Element;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  valid?: boolean;
  value?: any;
  onChange?(changeEvent: { value: any; checked: boolean }): void;
  onValidate?(
    value: any,
    { dirty, required }: { dirty?: boolean; required?: boolean }
  ): boolean;
  ref?: MutableRefObject<CheckboxFieldRef | undefined>;
}
const CheckboxField = forwardRef(({
  checked = false,
  valid = true,
  disabled = false,
  required = false,
  children,
  value,
  id,
  name,
  className,
  onChange,
  onValidate = (val, { required }) => val || !required,
  ...rest
}: CheckboxFieldProps, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();
  const { update: updateControl } = useFieldControl();

  type CheckboxState = {
    checked: boolean,
    valid: boolean,
    dirty: boolean
  };
  const [state, dispatch] = useReducer<MockState<CheckboxState>>(mockState, {
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

  const onKeyPress_ = e => {
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

  const onChange_ = e => {
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
}) as ForwardedProps<CheckboxFieldProps, CheckboxFieldRef>;

CheckboxField.displayName = 'CheckboxField';
CheckboxField.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  onValidate: PropTypes.func,
  valid: PropTypes.bool,
};
export default CheckboxField;
