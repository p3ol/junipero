import {
  type RefObject,
  type KeyboardEvent,
  useReducer,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { classNames, mockState } from '@junipero/core';

import type {
  FieldContent,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import { useFieldControl } from '../hooks';

export declare type RadioFieldValue = any;

export declare interface RadioFieldOptionObject {
  id?: string | number;
  title?: string;
  description?: string;
  value?: RadioFieldValue;
  disabled?: boolean;
}

export declare interface RadioFieldRef extends JuniperoRef {
  dirty: boolean;
  valid: boolean;
  value: RadioFieldValue;
  innerRef: RefObject<HTMLDivElement>;
  inputRefs: RefObject<HTMLInputElement[]>;
  optionRefs: RefObject<HTMLLabelElement[]>;
}

export declare interface RadioFieldProps extends Omit<
  SpecialComponentPropsWithRef<'div', RadioFieldRef>,
  'onChange'
> {
  disabled?: boolean;
  name?: string;
  options?: Array<RadioFieldOptionObject | RadioFieldValue>;
  required?: boolean;
  valid?: boolean;
  value?: RadioFieldValue;
  onChange?(field: FieldContent<RadioFieldValue>): void;
  onValidate?(
    value: RadioFieldValue,
    flags: { dirty: boolean; required: boolean }
  ): boolean;
  parseDescription?(
    option: RadioFieldValue | RadioFieldOptionObject,
  ): string;
  parseTitle?(
    option: RadioFieldValue | RadioFieldOptionObject,
  ): string;
  parseValue?(
    option: RadioFieldValue | RadioFieldOptionObject,
  ): RadioFieldValue;
}

export declare interface RadioFieldState {
  dirty: boolean;
  value: any;
  valid: boolean;
}

const RadioField = ({
  ref,
  className,
  name,
  value,
  disabled = false,
  required = false,
  valid = true,
  options = [],
  onChange,
  onValidate = (val, { required }) =>
    (typeof val !== 'undefined' && val !== null) || !required,
  parseValue = val => val?.value ?? val,
  parseTitle = val => val?.title ?? val?.toString?.(),
  parseDescription = val => val?.description || '',
  ...rest
}: RadioFieldProps) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const optionRefs = useRef<HTMLLabelElement[]>([]);
  const innerRef = useRef<HTMLDivElement>(null);
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState<RadioFieldState>, {
    dirty: false,
    value,
    valid,
  });

  useEffect(() => {
    if (value !== state.value) {
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

  const isChecked = (option: RadioFieldValue | RadioFieldOptionObject) =>
    parseValue(option) === parseValue(state.value);

  const onChange_ = (option: RadioFieldValue | RadioFieldOptionObject) => {
    if (disabled || option.disabled) {
      /* istanbul ignore next: canoot be tested */
      return;
    }

    const valid = onValidate(parseValue(option), { dirty: true, required });
    dispatch({ value: option, valid, dirty: true });

    onChange?.({ value: parseValue(option), valid });

    updateControl?.({ dirty: true, valid });
  };

  const onKeyDown = (
    option: RadioFieldValue | RadioFieldOptionObject,
    e: KeyboardEvent
  ) => {
    if (
      state.value !== option &&
      state.value !== parseValue(option) &&
      (e.key === 'Enter' || e.key === ' ')
    ) {
      onChange_(option);
    }

    return true;
  };

  const isDescriptionAvailable = (
    option: RadioFieldValue | RadioFieldOptionObject,
  ) => {
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
          tabIndex={disabled ? -1 : 0}
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
};

RadioField.displayName = 'RadioField';

export default RadioField;
