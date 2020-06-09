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
} from '../utils';
import TextField from '../TextField';
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
  required = false,
  weekDaysNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
  onChange = () => {},
  onFocus = () => {},
  parseTitle = val => val?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  parseValue = val => val,
  validate = val => typeof val !== 'undefined',
}, ref) => {
  const innerRef = useRef();
  const dropdownRef = useRef();
  const inputRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    value,
    displayed: value || new Date(),
    selected: value || new Date(),
    valid: false,
  });

  useEffect(() => {
    if (autoFocus) {
      dropdownRef.current?.open();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    innerRef,
    dropdownRef,
  }));

  const onFocus_ = e => {
    dropdownRef.current?.open();
    onFocus(e);
  };

  const onChange_ = (date, e) => {
    e.preventDefault();

    state.value = date;
    state.valid = validate(date);

    dispatch({
      valid: state.valid,
      selected: state.value,
      value: state.value,
      displayed: state.value,
    });

    dropdownRef.current?.close();
    inputRef.current?.setDirty(true);

    onChange({ value: parseValue(state.value), valid: state.valid });
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

    return date < min;
  };

  const isAfterMaxDate = date => {
    if (!max) {
      return false;
    }

    return date > max;
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
      className={classNames(
        'junipero',
        'field',
        'date-picker',
      )}
      ref={innerRef}
    >
      <Dropdown disabled={disabled} ref={dropdownRef}>
        <DropdownToggle trigger="manual" href={null} tag="div">
          <TextField
            ref={inputRef}
            disabled={disabled}
            placeholder={placeholder}
            label={label}
            value={parseTitle(state.value)}
            valid={state.valid}
            validate={() => state.valid}
            readOnly={true}
            autoFocus={autoFocus}
            onFocus={onFocus_}
          />
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
                      onClick={onChange_.bind(this, day.date)}
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
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
  required: PropTypes.bool,
  validate: PropTypes.func,
  value: PropTypes.instanceOf(Date),
  weekDaysNames: PropTypes.array,
};

export default DateField;
