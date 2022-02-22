import React, {
  forwardRef,
  useEffect,
  useRef,
  useReducer,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import {
  classNames,
  mockState,
  startOfMonth,
  subMonths,
  addMonths,
  getDaysInMonth,
} from '@poool/junipero-utils';

import BaseField from '../BaseField';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';

const DateField = forwardRef(({
  animateMenu,
  autoFocus,
  className,
  label,
  max,
  min,
  placeholder,
  value,
  disabled = false,
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'],
  opened = false,
  required = false,
  trigger = 'click',
  weekDaysNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  onToggle = () => {},
  parseTitle = val => val?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  parseValue = val => val,
  validate = val => !required || typeof val !== 'undefined',
  ...rest
}, ref) => {
  const innerRef = useRef();
  const dropdownRef = useRef();
  const fieldRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    value,
    selected: value || new Date(),
    displayed: value || new Date(),
    valid: false,
    dirty: false,
    opened: opened ?? autoFocus,
    focused: autoFocus ?? false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    dropdownRef,
    fieldRef,
    internalValue: state.value,
    displayed: state.displayed,
    selected: state.selected,
    opened: state.opened,
    valid: state.valid,
    focus,
    blur,
    reset,
    isJunipero: true,
  }));

  useEffect(() => {
    if (autoFocus) {
      dropdownRef.current?.open();
    }
  }, []);

  useEffect(() => {
    if (value) {
      dispatch({ value, valid: validate(parseValue(value)) });
    }
  }, [value]);

  const onFocus_ = e => {
    dispatch({ focused: true, displayed: new Date(state.selected) });

    if (trigger !== 'manual') {
      dropdownRef.current?.open();
    }

    onFocus(e);
  };

  const onBlur_ = e => {
    dispatch({ focused: false });
    onBlur(e);
  };

  const onChange_ = (date, e) => {
    e.preventDefault();

    if (isDayDisabled(date)) {
      return;
    }

    state.value = date;
    state.valid = validate(parseValue(date));

    dispatch({
      valid: state.valid,
      dirty: true,
      value: new Date(state.value),
      selected: new Date(state.value),
      displayed: new Date(state.value),
    });

    if (trigger !== 'manual') {
      dropdownRef.current?.close();
    }

    onChange({ value: parseValue(state.value), valid: state.valid });
  };

  const onToggle_ = ({ opened }) => {
    dispatch({ opened });
    onToggle({ opened });
  };

  const onMouseDown_ = () => {
    if (trigger === 'manual') {
      return;
    }

    if (state.opened && state.focused) {
      dropdownRef.current?.close();
    } else {
      dropdownRef.current?.open();
    }
  };

  const focus = () => {
    fieldRef.current?.focus();

    if (trigger !== 'manual') {
      dropdownRef.current?.open();
    }
  };

  const blur = () => {
    fieldRef.current?.blur();

    if (trigger !== 'manual') {
      dropdownRef.current?.close();
    }
  };

  const reset = () => {
    dispatch({
      value,
      displayed: value || new Date(),
      selected: value || new Date(),
      valid: false,
      dirty: false,
    });
  };

  const onPreviousMonthClick = e => {
    e?.preventDefault();

    if (state.displayed.getMonth() === 0) {
      state.displayed.setFullYear(state.displayed.getFullYear() - 1);
    }

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

  const isDayDisabled = date => {
    return isBeforeMinDate(date) || isAfterMaxDate(date);
  };

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

  return (
    <div
      { ...rest }
      className={classNames(
        'junipero',
        'field',
        'date-picker',
        {
          dirty: state.dirty,
          focused: state.focused,
          disabled,
        },
        className,
      )}
      ref={innerRef}
    >
      <Dropdown
        trigger={trigger}
        onToggle={onToggle_}
        disabled={disabled}
        opened={state.opened}
        ref={dropdownRef}
      >
        <DropdownToggle trigger="manual" href={null} tag="div">
          <BaseField
            ref={fieldRef}
            disabled={disabled}
            placeholder={placeholder}
            label={label}
            value={parseTitle(state.value, true)}
            valid={state.valid}
            autoFocus={autoFocus}
            dirty={state.dirty}
            focused={state.focused}
            empty={!state.value}
            onFocus={onFocus_}
            onBlur={onBlur_}
            onMouseDown={onMouseDown_}
          />
          <div className="arrow" />
        </DropdownToggle>
        <DropdownMenu
          className="calendar"
          animate={animateMenu}
        >
          <div className="calendar-header">
            <a
              href="#"
              className="arrow-wrapper left"
              onClick={onPreviousMonthClick}
            >
              <i className="arrow" />
            </a>
            <div className="current-month">
              { getMonthName(state.displayed.getMonth()) }
              { ' ' }
              { state.displayed.getFullYear() }
            </div>
            <a
              href="#"
              className="arrow-wrapper right"
              onClick={onNextMonthClick}
            >
              <i className="arrow" />
            </a>
          </div>

          <div className="calendar-body">
            <div className="week-days">
              { weekDaysNames.map((day, index) => (
                <span key={index} className="week-day">{day}</span>
              ))}
            </div>

            <div className="days">
              { []
                .concat(getPreviousMonthDays(state.displayed))
                .concat(getMonthDays(state.displayed))
                .concat(getNextMonthDays(state.displayed))
                .map((day, index) => (
                  <React.Fragment key={index}>
                    <a
                      className={classNames('day', {
                        inactive: day.inactive,
                        active: !day.inactive && isDaySelected(day.date),
                        disabled: isDayDisabled(day.date),
                      })}
                      href="#"
                      onClick={onChange_.bind(null, day.date)}
                    >
                      { day.date.getDate() }
                    </a>

                    { (index + 1) % 7 === 0 && (
                      <div className="separator" />
                    )}
                  </React.Fragment>
                ))
              }
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
});

DateField.propTypes = {
  autoFocus: PropTypes.bool,
  animateMenu: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.bool,
  ]),
  max: PropTypes.instanceOf(Date),
  min: PropTypes.instanceOf(Date),
  monthNames: PropTypes.array,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  opened: PropTypes.bool,
  onToggle: PropTypes.func,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
  required: PropTypes.bool,
  trigger: PropTypes.string,
  validate: PropTypes.func,
  value: PropTypes.instanceOf(Date),
  weekDaysNames: PropTypes.array,
};

export default DateField;
