import {
  type RefObject,
  type ReactNode,
  type ChangeEvent,
  type FocusEvent,
  type MouseEvent,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
} from 'react';
import { type FixedArray, classNames, exists, mockState } from '@junipero/core';

import type { TransitionProps } from '../Transition';
import type {
  JuniperoRef,
  FieldContent,
  SpecialComponentPropsWithRef,
} from '../types';
import { useFieldControl } from '../hooks';
import { Arrows, Remove, Time } from '../icons';
import Dropdown, { type DropdownRef } from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import Calendar from '../Calendar';

export declare interface DateFieldRef extends JuniperoRef {
  dirty: boolean;
  focused: boolean;
  isJunipero: boolean;
  opened: boolean;
  valid: boolean;
  value: Date;
  blur(): void;
  focus(): void;
  reset(): void;
  open(): void;
  close(): void;
  toggle(): void;
  innerRef: RefObject<DropdownRef>;
  inputRef: RefObject<HTMLInputElement>;
  timeInputRef: RefObject<HTMLInputElement>;
}

export declare interface DateFieldProps extends Omit<
  SpecialComponentPropsWithRef<typeof Dropdown, DateFieldRef>,
  'onChange'
> {
  autoFocus?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  id?: string;
  max?: Date;
  min?: Date;
  monthNames?: FixedArray<string, 12>;
  name?: string;
  opened?: boolean;
  placeholder?: string;
  required?: boolean;
  time?: boolean;
  timePlaceholder?: string;
  valid?: boolean;
  value?: Date;
  weekDaysNames?: FixedArray<string, 7>;
  animateMenu?(
    menu: ReactNode,
    opts: { opened: boolean } & Partial<TransitionProps>
  ): ReactNode;
  onBlur?(e: FocusEvent<HTMLInputElement>): void;
  onChange?(field: FieldContent<Date>): void;
  onFocus?(e: FocusEvent<HTMLInputElement>): void;
  onToggle?(props: { opened: boolean }): void;
  onValidate?(
    value: Date,
    options: { required?: boolean; dirty?: boolean }
  ): boolean;
  parseTime?(time: string): FixedArray<number, 3>;
  parseTitle?(
    value: Date,
    options?: { time?: boolean, isValue?: boolean}
  ): string;
  parseValue?(value: Date, options?: { required?: boolean }): Date;
}

export declare interface DateFieldState {
  value?: Date;
  selected: Date;
  displayed: Date;
  valid: boolean;
  dirty: boolean;
  opened: boolean;
  focused: boolean;
  time: string;
  timeDirty: boolean;
}

const DateField = ({
  ref,
  className,
  id,
  max,
  min,
  name,
  opened,
  placeholder,
  trigger,
  value,
  valid,
  autoFocus = false,
  clearable = true,
  disabled = false,
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'],
  required = false,
  time = true,
  timePlaceholder = '00:00:00',
  weekDaysNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
  animateMenu,
  onChange,
  onFocus,
  onBlur,
  onToggle,
  parseTitle = (val, { time }) => val ? val.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ' ' + (time ? val?.toLocaleTimeString('en-US') : '') : '',
  parseValue = val => val,
  parseTime,
  onValidate = (val, { required }) => !!val || !required,
  children,
  ...rest
}: DateFieldProps) => {
  const dropdownRef = useRef<DropdownRef>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState<DateFieldState>, {
    value: value ?? null,
    selected: value ?? new Date(),
    displayed: value ?? new Date(),
    valid: valid ?? false,
    dirty: false,
    opened: (autoFocus || opened) ?? false,
    focused: autoFocus ?? false,
    time: value ? value.toLocaleTimeString('en-US', {
      hourCycle: 'h23',
    }) : '',
    timeDirty: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef: dropdownRef,
    inputRef,
    timeInputRef,
    value: state.value,
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    opened: state.opened,
    open,
    close,
    toggle,
    focus,
    blur,
    reset,
    isJunipero: true,
  }));

  useEffect(() => {
    if (exists(value)) {
      dispatch({
        value,
        valid: onValidate(parseValue(value), { required, dirty: true }),
      });
    }
  }, [value]);

  const onSelectDate = (date: Date) => {
    if (disabled || isDayDisabled(date)) {
      return;
    }

    state.value = new Date(date);
    applyTime();
    state.valid =
      onValidate(parseValue(state.value), { required, dirty: true });
    state.selected = new Date(date);
    onChange_();
  };

  const onChange_ = ({ close = true }: { close?: boolean} = {}) => {
    if (disabled) {
      return;
    }

    dispatch({
      value: state.value,
      valid: state.valid,
      selected: state.selected,
      timeDirty: state.timeDirty,
      dirty: true,
    });
    onChange?.({ value: parseValue(state.value), valid: state.valid });
    updateControl?.({ valid: state.valid, dirty: true });

    if (close && trigger !== 'manual') {
      dropdownRef.current?.close?.();
    }
  };

  const onTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    state.time = val.length % 3 === 0 &&
      val.length > state.time.length &&
      !val.endsWith(':') &&
      (val.match(/:/g) || []).length < 2
      ? val.slice(0, -1) + ':' + val.slice(-1) : val;

    dispatch({ time: state.time, timeDirty: true });
  };

  const applyTime = () => {
    if (!time || !state.value) {
      return;
    }

    let timeValue;

    if (!parseTime) {
      const matches = state.time.split(':').map(v => parseInt(v, 10) || 0);
      timeValue = matches.slice(0, 3);
    } else {
      timeValue = parseTime(state.time) || [];
    }

    if (/[ap]m/i.test(state.time)) {
      state.value.setHours(
        Math.min(23, timeValue[0] ?? 0) +
        (timeValue[0] < 12 && /pm/i.test(state.time) ? 12 : 0)
      );
    } else {
      state.value.setHours(Math.min(23, timeValue[0] ?? 0));
    }

    state.value.setMinutes(Math.min(60, timeValue[1] ?? 0));
    state.value.setSeconds(Math.min(60, timeValue[2] ?? 0));
  };

  const onTimeBlur = () => {
    if (!time) {
      return;
    }

    applyTime();
    state.valid =
      onValidate(parseValue(state.value), { required, dirty: true });
    state.timeDirty = false;
    onChange_({ close: false });
  };

  const onClear = (e: MouseEvent) => {
    e.stopPropagation();

    if (!clearable || disabled) {
      return;
    }

    state.value = undefined;
    state.time = '';
    state.valid =
      onValidate(parseValue(state.value), { required, dirty: true });
    onChange_({ close: false });
  };

  const onFocus_ = (e: FocusEvent<HTMLInputElement>) => {
    focus();
    onFocus?.(e);
  };

  const onBlur_ = (e: FocusEvent<HTMLInputElement>) => {
    blur();
    onBlur?.(e);
  };

  const onToggle_ = ({ opened }: { opened?: boolean}) => {
    if (disabled) {
      return;
    }

    state.opened = opened;
    state.focused = opened;

    if (opened) {
      dispatch({
        opened,
        focused: opened,
        displayed: new Date(state.selected),
      });
    } else {
      dispatch({ opened, focused: opened });

      if (state.timeDirty) {
        onTimeBlur();
      }
    }

    updateControl?.({ focused: opened });
    onToggle?.({ opened });
  };

  const focus = () => {
    dispatch({ focused: true, displayed: new Date(state.selected) });
    dropdownRef.current?.open();
  };

  const open = () => {
    if (disabled) {
      return;
    }

    dispatch({
      opened: true,
      focused: true,
      displayed: new Date(state.selected),
    });
  };

  const close = () => {
    if (disabled) {
      return;
    }

    dispatch({ opened: false, focused: false });
  };

  const toggle = () => {
    if (disabled) {
      return;
    }

    if (state.opened) {
      close();
    } else {
      open();
    }
  };

  const blur = () => {
    dispatch({ focused: false });
  };

  const reset = () => {
    dispatch({
      value: value ?? null,
      valid: valid ?? false,
      dirty: false,
    });
    updateControl?.({ dirty: false, valid: valid ?? false });
  };

  const isBeforeMinDate = (date: Date) => {
    if (!min) {
      return false;
    }

    return date.getTime() < min.getTime();
  };

  const isAfterMaxDate = (date: Date) => {
    if (!max) {
      return false;
    }

    return date.getTime() > max.getTime();
  };

  const isDayDisabled = (date: Date) =>
    isBeforeMinDate(date) || isAfterMaxDate(date);

  const isEmpty = () =>
    !exists(state.value) || !state.dirty;

  return (
    <Dropdown
      { ...rest }
      opened={state.opened}
      ref={dropdownRef}
      disabled={disabled}
      trigger={trigger}
      clickOptions={{ toggle: false, keyboardHandlers: false }}
      className={classNames(
        'date-field',
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        {
          empty: isEmpty(),
          focused: state.focused,
        },
        className
      )}
      onToggle={onToggle_}
    >
      <DropdownToggle>
        <div
          className="field"
          title={parseTitle(state.value, { isValue: true, time })}
        >
          <input
            ref={inputRef}
            id={id}
            name={name}
            type="text"
            readOnly={true}
            placeholder={placeholder}
            value={parseTitle(state.value, { isValue: true, time })}
            onFocus={onFocus_}
            onBlur={onBlur_}
          />
          <div className="icons">
            { !!state.value && clearable && state.dirty && (
              <Remove onClick={onClear} />
            ) }
            <Arrows />
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu animate={animateMenu} className="calendar-menu">
        <Calendar
          active={state.selected}
          onSelect={onSelectDate}
          min={min}
          max={max}
          monthNames={monthNames}
          weekDaysNames={weekDaysNames}
          disabled={disabled}
        />

        { time && (
          <div className="time-field">
            <Time />
            <input
              ref={timeInputRef}
              type="text"
              placeholder={timePlaceholder}
              value={state.time}
              onChange={onTimeChange}
              onBlur={onTimeBlur}
            />
          </div>
        ) }
      </DropdownMenu>
      { children }
    </Dropdown>
  );
};

DateField.displayName = 'DateField';

export default DateField;
