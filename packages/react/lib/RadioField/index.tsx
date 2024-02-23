import {
  forwardRef,
  useReducer,
  useRef,
  useImperativeHandle,
  useEffect,
  MutableRefObject,
  ComponentPropsWithRef,
  KeyboardEvent,
} from 'react';
import PropTypes from 'prop-types';
import { classNames, mockState } from '@junipero/core';

import { useFieldControl } from '../hooks';
import { ForwardedProps, MockState } from '../utils';

export declare type RadioFieldRef = {
  dirty: boolean;
  isJunipero: boolean;
  valid: boolean;
  value: any;
  innerRef: MutableRefObject<any>;
  inputRefs: MutableRefObject<Array<any>>;
  optionRefs: MutableRefObject<Array<any>>;
};

export declare interface RadioFieldProps extends ComponentPropsWithRef<any> {
  className?: string;
  disabled?: boolean;
  name?: string;
  options?: Array<any>;
  required?: boolean;
  valid?: boolean;
  value?: any;
  onChange?(props: { value: any; valid: boolean }): void;
  onValidate?(
    value: any,
    flags: { dirty: boolean; required: boolean }
  ): boolean;
  parseDescription?(option: any): string;
  parseTitle?(option: any): string;
  parseValue?(option: any): any;
  ref?: MutableRefObject<RadioFieldRef | undefined>;
}
const RadioField = forwardRef(({
  disabled = false,
  required = false,
  valid = true,
  options = [],
  className,
  name,
  value,
  onChange,
  onValidate = (val, { required }) =>
    (typeof val !== 'undefined' && val !== null) || !required,
  parseValue = val => val?.value ?? val,
  parseTitle = val => val?.title ?? val?.toString?.(),
  parseDescription = val => val?.description || '',
  ...rest
}: RadioFieldProps, ref) => {
  const inputRefs = useRef([]);
  const optionRefs = useRef([]);
  const innerRef = useRef();
  const { update: updateControl } = useFieldControl();

  type RadioFieldState = {
    dirty: boolean;
    value: any;
    valid: boolean;
  }
  const [state, dispatch] = useReducer<MockState<RadioFieldState>>(mockState, {
    dirty: false,
    value,
    valid,
  });

  useEffect(() => {
    if (
      value !== state.value
    ) {
      const valid = onValidate(value, { dirty: state.dirty, required });
      dispatch({
        value: options?.find(o => parseValue(o) === parseValue(value)),
        valid,
      });
      updateControl?.({
        dirty: state.dirty,
        valid,
      });
    }
  }, [value, options]);

  useImperativeHandle(ref, () => ({
    optionRefs,
    inputRefs,
    innerRef,
    dirty: state.dirty,
    value: state.value,
    isJunipero: true,
    valid: state.valid,
  }));

  const isChecked = (option: any) => parseValue(option) === parseValue(state.value);

  const onChange_ = (option: any) => {
    if (disabled || option.disabled) {
      /* istanbul ignore next: canoot be tested */
      return;
    }

    const valid = onValidate(parseValue(option), { dirty: true, required });
    dispatch({ value: option, valid, dirty: true });

    onChange?.({ value: parseValue(option), valid });

    updateControl?.({ dirty: true, valid });
  };

  const onKeyDown = (option: any, e: KeyboardEvent) => {
    if (
      state.value !== option &&
      state.value !== parseValue(option) &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      onChange_(option);
    }

    return true;
  };

  const isDescriptionAvailable = (option: any) => {
    const desc = parseDescription(option);

    return desc !== null && desc !== undefined && desc !== '';
  };

  return (
    <div
      { ...rest }
      className={classNames(
        'junipero',
        'radio-field',
        { disabled },
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        className,
      )}
      ref={innerRef}
    >
      { options.map((option, index) => (
        <label
          key={index}
          ref={el => { optionRefs.current[index] = el; }}
          className={classNames({
            checked: isChecked(option),
            disabled: disabled || option.disabled,
          })}
          onKeyDown={onKeyDown.bind(null, option)}
          tabIndex={disabled ? -1 : index + 1}
        >
          <input
            id={option.id}
            name={name}
            ref={el => { inputRefs.current[index] = el; }}
            type="radio"
            value={parseValue(option)}
            checked={isChecked(option)}
            onChange={onChange_.bind(null, option)}
            tabIndex={-1}
          />
          <div className="inner" />
          <div className="label">
            <div className="title">{ parseTitle(option) }</div>
            { isDescriptionAvailable(option) && (
              <div className="description">{ parseDescription(option) }</div>
            ) }
          </div>
        </label>
      ))}
    </div>
  );
}) as ForwardedProps<RadioFieldProps, RadioFieldRef>;

RadioField.displayName = 'RadioField';
RadioField.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  required: PropTypes.bool,
  valid: PropTypes.bool,
  options: PropTypes.array,
  parseValue: PropTypes.func,
  parseDescription: PropTypes.func,
  parseTitle: PropTypes.func,
  value: PropTypes.any,
  name: PropTypes.string,
};

export default RadioField;
