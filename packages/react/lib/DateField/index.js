import {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
} from 'react';
import {
  classNames,
  mockState,
  exists,
  startOfMonth,
  subMonths,
  addMonths,
  getDaysInMonth,
} from '@junipero/core';
import PropTypes from 'prop-types';

import { useFieldControl } from '../hooks';
import { ArrowLeft, ArrowRight, Arrows, Remove, Time } from '../icons';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';

const DateField = forwardRef(({
  animateMenu,
  className,
  max,
  min,
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
  ...rest
}, ref) => {
  const dropdownRef = useRef();
  const timeInputRef = useRef();
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState, {
    value: value ?? null,
    selected: value ?? new Date(),
    displayed: value ?? new Date(),
    valid: valid ?? false,
    dirty: false,
    opened: (autoFocus || opened) ?? false,
    focused: autoFocus ?? false,
    time: '',
    timeDirty: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef: dropdownRef,
    value: state.value,
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    opened: state.opened,
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

  const onSelectDate = (date, e) => {
    e.preventDefault();

    if (disabled || isDayDisabled(date)) {
      return;
    }

    state.value = new Date(date);
    applyTime();
    state.valid =
      onValidate(parseValue(state.value), { required, dirty: true });
    state.selected = new Date(date);
    state.displayed = new Date(date);
    onChange_();
  };

  const onChange_ = ({ close = true } = {}) => {
    if (disabled) {
      return;
    }

    dispatch({
      value: state.value,
      valid: state.valid,
      selected: state.selected,
      displayed: state.displayed,
      timeDirty: state.timeDirty,
      dirty: true,
    });
    onChange?.({ value: parseValue(state.value), valid: state.valid });
    updateControl?.({ valid: state.valid, dirty: true });
    close && trigger !== 'manual' && dropdownRef.current?.close?.();
  };

  const onTimeChange = e => {
    const val = e.target.value;

    state.time = val.length % 3 === 0 &&
      val.length > state.time.length &&
      val.slice(-1) !== ':' &&
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

  const onClear = e => {
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

  const onFocus_ = e => {
    focus();
    onFocus?.(e);
  };

  const onBlur_ = e => {
    blur();
    onBlur?.(e);
  };

  const onToggle_ = ({ opened }) => {
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
      state.timeDirty && onTimeBlur();
    }

    updateControl?.({ focused: opened });
    onToggle?.({ opened });
  };

  const focus = () => {
    dispatch({ focused: true, displayed: new Date(state.selected) });
    dropdownRef.current?.open();
  };

  const blur = () => {
    dispatch({ focused: false });
  };

  const reset = () => {
    dispatch({
      value: value ?? '',
      valid: valid ?? false,
      dirty: false,
    });
    updateControl?.({ dirty: false, valid: valid ?? false });
  };

  const onPreviousMonthClick = e => {
    e?.preventDefault();

    if (state.displayed.getMonth() === 0) {
      state.displayed.setFullYear(state.displayed.getFullYear() - 1);
    }

    const maxDaysPreviousMonth = getDaysInMonth(
      new Date(
        state.displayed.getFullYear(),
        state.displayed.getMonth() === 0 ? 11 : state.displayed.getMonth() - 1,
      )
    );
    state.displayed.setDate(
      Math.min(maxDaysPreviousMonth, state.displayed.getDate())
    );

    state.displayed.setMonth(
      state.displayed.getMonth() === 0 ? 11 : state.displayed.getMonth() - 1
    );

    dispatch({ displayed: state.displayed });
  };

  const onNextMonthClick = e => {
    e?.preventDefault();

    if (state.displayed.getMonth() === 11) {
      state.displayed.setFullYear(state.displayed.getFullYear() + 1);
    }

    const maxDaysPreviousMonth = getDaysInMonth(
      new Date(
        state.displayed.getFullYear(),
        state.displayed.getMonth() === 11 ? 0 : state.displayed.getMonth() + 1,
      )
    );
    state.displayed.setDate(
      Math.min(maxDaysPreviousMonth, state.displayed.getDate())
    );

    state.displayed.setMonth(
      state.displayed.getMonth() === 11 ? 0 : state.displayed.getMonth() + 1
    );

    dispatch({ displayed: state.displayed });
  };

  const isBeforeMinDate = date => {
    if (!min) {
      return false;
    }

    return date.getTime() < min.getTime();
  };

  const isAfterMaxDate = date => {
    if (!max) {
      return false;
    }

    return date.getTime() > max.getTime();
  };

  const isDayDisabled = date =>
    isBeforeMinDate(date) || isAfterMaxDate(date);

  const isDaySelected = date =>
    date.getFullYear() === state.selected.getFullYear() &&
    date.getMonth() === state.selected.getMonth() &&
    date.getDate() === state.selected.getDate();

  const getMonthName = month =>
    monthNames[month];

  const getWeekDayOfMonth = date => {
    const weekDay = date.getDay();

    return weekDay === 0 ? 7 : weekDay;
  };

  const getMonthDays = (date, props = {}) => Array
    .from({ length: getDaysInMonth(date) }, (v, k) => ({
      date: new Date(date.getFullYear(), date.getMonth(), k + 1),
      ...props,
    }));

  const getPreviousMonthDays = date => {
    const previousDate = startOfMonth(subMonths(date, 1));
    const selectedWeekDay = getWeekDayOfMonth(startOfMonth(date));
    const selectedDaysCount = getDaysInMonth(previousDate);

    return getMonthDays(previousDate, { inactive: true })
      .slice(selectedDaysCount - (selectedWeekDay - 1));
  };

  const getNextMonthDays = date => {
    const nextDate = startOfMonth(addMonths(date, 1));
    const daysCount = getDaysInMonth(date);
    const weekDay = getWeekDayOfMonth(startOfMonth(date)) - 1;

    return Array
      .from({ length: 42 - daysCount - weekDay }, (v, k) => ({
        date: new Date(nextDate.getFullYear(), nextDate.getMonth(), k + 1),
        inactive: true,
      }));
  };

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
        <div className="content">
          <div className="calendar-header">
            <div className="current-month">
              <strong>{ getMonthName(state.displayed.getMonth()) }</strong>
              { ' ' + state.displayed.getFullYear() }
            </div>
            <div className="navigation">
              <ArrowLeft onClick={onPreviousMonthClick} />
              <ArrowRight onClick={onNextMonthClick} />
            </div>
          </div>

          <div className="calendar-body">
            { weekDaysNames.map((day, index) => (
              <span key={index} className="week-day junipero info">
                { day }
              </span>
            )) }

            { []
              .concat(getPreviousMonthDays(state.displayed))
              .concat(getMonthDays(state.displayed))
              .concat(getNextMonthDays(state.displayed))
              .map((day, index) => (
                <a
                  key={index}
                  className={classNames('day junipero info', {
                    inactive: day.inactive,
                    active: !day.inactive && isDaySelected(day.date),
                    disabled: isDayDisabled(day.date),
                  })}
                  href="#"
                  onClick={onSelectDate.bind(null, day.date)}
                >
                  { day.date.getDate() }
                </a>
              ))
            }
          </div>

          { time && (
            <div className="calendar-footer">
              <Time />
              <input
                ref={timeInputRef}
                className="time-field"
                type="text"
                placeholder={timePlaceholder}
                value={state.time}
                onChange={onTimeChange}
                onBlur={onTimeBlur}
              />
            </div>
          ) }
        </div>
      </DropdownMenu>
    </Dropdown>
  );
});

DateField.displayName = 'DateField';
DateField.propTypes = {
  animateMenu: PropTypes.func,
  autoFocus: PropTypes.bool,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  valid: PropTypes.bool,
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  monthNames: PropTypes.array,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onValidate: PropTypes.func,
  opened: PropTypes.bool,
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
  weekDaysNames: PropTypes.array,
  onToggle: PropTypes.func,
  time: PropTypes.bool,
  timePlaceholder: PropTypes.string,
  parseTime: PropTypes.func,
  trigger: PropTypes.oneOf(['click', 'hover', 'manual']),
};

export default DateField;
