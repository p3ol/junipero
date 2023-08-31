import {
  ComponentPropsWithRef,
  MutableRefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
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

import { ArrowLeft, ArrowRight } from '../icons';
import { FixedArray, ForwardedProps } from '../utils';

export declare type CalendarRef = {
  value: Date;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface CalendarProps extends ComponentPropsWithRef<any> {
  active?: Date;
  className?: string;
  disabled?: boolean;
  max?: Date;
  min?: Date;
  monthNames?: FixedArray<string, 12>;
  weekDaysName?: FixedArray<string, 7>;
  onSelect?(value: Date): void;
  ref?: MutableRefObject<CalendarRef | undefined>;
}

const Calendar = forwardRef(({
  className,
  active,
  max,
  min,
  disabled = false,
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'],
  weekDaysNames = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
  onSelect,
  ...rest
}: CalendarProps, ref) => {
  const innerRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    value: active ?? new Date(),
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    value: state.value,
    isJunipero: true,
  }));

  useEffect(() => {
    if (exists(active)) {
      dispatch({ value: active });
    }
  }, [active]);

  const onSelectDate = (date, e) => {
    e.preventDefault();

    if (disabled || isDayDisabled(date)) {
      return;
    }

    state.value = new Date(date);
    dispatch({ value: state.value });
    onSelect?.(state.value);
  };

  const onPreviousMonthClick = e => {
    e?.preventDefault();
    const value = new Date(state.value);

    if (value.getMonth() === 0) {
      value.setFullYear(value.getFullYear() - 1);
    }

    const maxDaysPreviousMonth = getDaysInMonth(
      new Date(
        value.getFullYear(),
        value.getMonth() === 0 ? 11 : value.getMonth() - 1,
      )
    );

    value.setDate(
      Math.min(maxDaysPreviousMonth, value.getDate())
    );

    value.setMonth(
      value.getMonth() === 0 ? 11 : value.getMonth() - 1
    );

    dispatch({ value });
  };

  const onNextMonthClick = e => {
    e?.preventDefault();
    const value = new Date(state.value);

    if (value.getMonth() === 11) {
      value.setFullYear(value.getFullYear() + 1);
    }

    const maxDaysPreviousMonth = getDaysInMonth(
      new Date(
        value.getFullYear(),
        value.getMonth() === 11 ? 0 : value.getMonth() + 1,
      )
    );

    value.setDate(
      Math.min(maxDaysPreviousMonth, value.getDate())
    );

    value.setMonth(
      state.value.getMonth() === 11 ? 0 : value.getMonth() + 1
    );

    dispatch({ value });
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

  const isDaySelected = date => {
    const current = active ?? new Date();

    return date.getFullYear() === current.getFullYear() &&
      date.getMonth() === current.getMonth() &&
      date.getDate() === current.getDate();
  };

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

  const previousMonthDays = useMemo(() => {
    const previousDate = startOfMonth(subMonths(state.value, 1));
    const selectedWeekDay = getWeekDayOfMonth(startOfMonth(state.value));
    const selectedDaysCount = getDaysInMonth(previousDate);

    return getMonthDays(previousDate, { inactive: true })
      .slice(selectedDaysCount - (selectedWeekDay - 1));
  }, [state.value]);

  const currentMonthDays = useMemo(() => (
    getMonthDays(state.value)
  ), [state.value]);

  const nextMonthDays = useMemo(() => {
    const nextDate = startOfMonth(addMonths(state.value, 1));
    const daysCount = getDaysInMonth(state.value);
    const weekDay = getWeekDayOfMonth(startOfMonth(state.value)) - 1;

    return Array
      .from({ length: 42 - daysCount - weekDay }, (v, k) => ({
        date: new Date(nextDate.getFullYear(), nextDate.getMonth(), k + 1),
        inactive: true,
      }));
  }, [state.value]);

  const days = useMemo(() => (
    []
      .concat(previousMonthDays)
      .concat(currentMonthDays)
      .concat(nextMonthDays)
  ), [currentMonthDays, nextMonthDays, previousMonthDays]);

  return (
    <div
      { ...rest }
      ref={innerRef}
      className={classNames('junipero calendar', className)}
    >
      <div className="calendar-header">
        <div className="current-month">
          <strong>{ getMonthName(state.value.getMonth()) }</strong>
          { ' ' + state.value.getFullYear() }
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

        { days.map((day, index) => (
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
        )) }
      </div>
    </div>
  );
}) as ForwardedProps<CalendarProps, CalendarRef>;

Calendar.displayName = 'Calendar';
Calendar.propTypes = {
  active: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
  min: PropTypes.instanceOf(Date),
  max: PropTypes.instanceOf(Date),
  monthNames: PropTypes.any, //TODO: fixme
  weekDaysNames: PropTypes.any,
  onSelect: PropTypes.func,
};
export default Calendar;
