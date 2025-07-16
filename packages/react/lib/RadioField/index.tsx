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

export declare type RadioFieldValue = string | number | boolean | object | null;

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
  options?: (RadioFieldOptionObject | RadioFieldValue)[];
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
  parseValue = val => (val as RadioFieldOptionObject)?.value ?? val,
  parseTitle = val => (val as RadioFieldOptionObject)?.title ??
    val?.toString?.(),
  parseDescription = val => (val as RadioFieldOptionObject)?.description || '',
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (disabled || (option as RadioFieldOptionObject).disabled) {
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
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      const i = options.indexOf(option);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        optionRefs.current[(i + 1) % options.length]?.focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        optionRefs.current[(i - 1 + options.length) % options.length]?.focus();
      }
    } else if (
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
      role="radiogroup"
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
          id={index.toString()}
          role="radio"
          ref={el => { optionRefs.current[index] = el; }}
          className={classNames({
            checked: isChecked(option),
            disabled: disabled || (option as RadioFieldOptionObject).disabled,
          })}
          onKeyDown={onKeyDown.bind(null, option)}
          tabIndex={isChecked(option) || (index === 0 && !state.value)
            ? 0
            : -1
          }
        >
          <input
            id={(option as RadioFieldOptionObject).id?.toString()}
            name={name}
            ref={el => { inputRefs.current[index] = el; }}
            type="radio"
            value={parseValue(option) as string}
            checked={isChecked(option)}
            onChange={onChange_.bind(null, option)}
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
