import React, {
  forwardRef,
  useRef,
  useReducer,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';

import { classNames, mockState } from '../utils';
import TextField from '../TextField';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';

const DateTimeField = forwardRef(({
  animateMenu,
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
  onFocus = () => {},
}, ref) => {
  const innerRef = useRef();
  const dropdownRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    value,
    displayed: value || new Date(),
    selected: value || new Date(),
    valid: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
  }));

  const onFocus_ = e => {
    dropdownRef.current?.open();
    onFocus(e);
  };

  const onChange_ = (date, e) => {
    e.preventDefault();

    dispatch({ selected: date, value: date });
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

  const isEmpty = () =>
    !state.value;

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

  const getDaysCount = date =>
    new Date(date.getFullYear(), date.getMonth(), 0).getDate();

  const getWeekDayOfMonth = date => {
    const weekDay = date.getDay();
    return weekDay === 0 ? 7 : weekDay;
  };

  const getMonthDays = (date, props = {}) => Array
    .from({ length: getDaysCount(date) }, (v, k) => ({
      date: new Date(date.getFullYear(), date.getMonth(), k + 1),
      ...props,
    }));

  const getPreviousMonthDays = date => {
    const previousDate = new Date(
      date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear(),
      date.getMonth() === 0 ? 11 : date.getMonth() - 1,
      0
    );

    const selectedWeekDay = getWeekDayOfMonth(date);
    const selectedDaysCount = getDaysCount(previousDate);

    return getMonthDays(previousDate, { inactive: true })
      .slice(selectedDaysCount - (selectedWeekDay - 1));
  };

  const getNextMonthDays = date => {
    const nextDate = new Date(
      date.getMonth() === 11 ? date.getFullYear() + 1 : date.getFullYear(),
      date.getMonth() === 11 ? 0 : date.getMonth() + 1,
      0
    );
    const daysCount = getDaysCount(date);
    const weekDay = getWeekDayOfMonth(date) - 1;

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
        'date-time-picker',
      )}
      ref={innerRef}
    >
      <Dropdown ref={dropdownRef}>
        <DropdownToggle trigger="manual" href={null} tag="div">
          <TextField
            disabled={disabled}
            value={state.value}
            validate={() => state.valid}
            readOnly={true}
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

DateTimeField.propTypes = {
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
  onFocus: PropTypes.func,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  required: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  weekDaysNames: PropTypes.array,
};

export default DateTimeField;
