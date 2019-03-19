import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from './Dropdown';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/DateField.styl';

class DateField extends React.Component {

  static propTypes = {
    boxed: PropTypes.bool,
    disabled: PropTypes.bool,
    forceLabel: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
    ]),
    monthNames: PropTypes.array,
    native: PropTypes.bool,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    theme: PropTypes.string,
    value: PropTypes.instanceOf(Date),
    weekDaysNames: PropTypes.array,
    animateMenu: PropTypes.func,
    onChange: PropTypes.func,
    parseTitle: PropTypes.func,
    parseValue: PropTypes.func,
    validate: PropTypes.func,
  }

  static defaultProps = {
    boxed: false,
    disabled: false,
    forceLabel: false,
    label: null,
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'],
    native: false,
    placeholder: '',
    readOnly: false,
    required: false,
    theme: 'default',
    value: null,
    weekDaysNames: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
    onChange: () => {},
    parseTitle: value => value?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    parseValue: value => value,
    validate: value => typeof value !== 'undefined' && value !== null,
  }

  state = {
    displayed: this.props.value || new Date(),
    nativeValue: this.props.value,
    opened: false,
    selected: this.props.value || new Date(),
    valid: true,
    value: this.props.value,
    dirty: false,
  };

  constructor(props) {
    super(props);
    inject(styles, 'junipero-date-field-styles');
  }

  componentDidMount() {
    if (this.props.value) {
      this.init();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== prevProps.value && this.props.value) {
      this.init();
    }
  }

  init() {
    const value = new Date(this.props.value);
    this.onChange({
      year: value.getFullYear(),
      month: value.getMonth(),
      day: value.getDate(),
    }, null, false);
  }

  onToggle(opened) {
    const { disabled, readOnly } = this.props;

    if (disabled || readOnly) {
      return;
    }

    this.setState({
      opened,
      selected: this.state.value || new Date(),
      displayed: this.state.value || new Date(),
    });
  }

  isDateSelected(date) {
    return date.year === this.state.selected.getFullYear() &&
      date.month === this.state.selected.getMonth() &&
      date.day === this.state.selected.getDate();
  }

  getMonthName(month) {
    return this.props.monthNames[month];
  }

  getWeekDaysNames() {
    return this.props.weekDaysNames;
  }

  getDaysCount(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  getWeekDayOfMonth(year, month, day = 1) {
    let weekDay = new Date(year, month, day).getDay();
    weekDay = weekDay === 0 ? 7 : weekDay;
    return weekDay;
  }

  getPreviousMonthDays(year, month) {
    const selectedMonth = month === 0 ? 11 : month - 1;
    const selectedYear = month === 0 ? year - 1 : year;
    const selectedWeekDay = this.getWeekDayOfMonth(year, month);
    const selectedDaysCount = this.getDaysCount(selectedYear, selectedMonth);

    return this.getMonthDays(selectedYear, selectedMonth, true)
      .slice(selectedDaysCount - (selectedWeekDay - 1));
  }

  getMonthDays(year, month, inactive = false) {
    return Array
      .from({ length: this.getDaysCount(year, month) }, (v, k) => ({
        year,
        month,
        day: k + 1,
        inactive,
      }));
  }

  getNextMonthDays(year, month) {
    const daysCount = this.getDaysCount(year, month);
    const weekDay = this.getWeekDayOfMonth(year, month) - 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    return Array
      .from({ length: 42 - daysCount - weekDay }, (v, k) => ({
        year: nextYear,
        month: nextMonth,
        day: k + 1,
        inactive: true,
      }));
  }

  onPreviousMonthClick(e) {
    e?.preventDefault();

    const { displayed } = this.state;

    this.setState({
      displayed: this.getDateToUTC(
        displayed.getMonth() === 0 ?
          displayed.getFullYear() - 1 :
          displayed.getFullYear(),
        displayed.getMonth() === 0 ?
          11 :
          displayed.getMonth() - 1,
        displayed.getDate()
      ),
    });
  }

  onNextMonthClick(e) {
    e?.preventDefault();

    const { displayed } = this.state;

    this.setState({
      displayed: this.getDateToUTC(
        displayed.getMonth() === 11 ?
          displayed.getFullYear() + 1 :
          displayed.getFullYear(),
        displayed.getMonth() === 11 ?
          0 :
          displayed.getMonth() + 1,
        displayed.getDate()
      ),
    });
  }

  onNativeChange(e) {
    const [year, month, day] = e.target.value?.split(/\D/);
    this.onChange({
      year,
      month: month - 1,
      day,
    }, e);
  }

  onChange(date, e, propagateChange = true) {
    e?.preventDefault();

    const newDate = this.getDateToUTC(date.year, date.month, date.day);
    const valid = this.props.validate(newDate);

    this.setState({
      opened: false,
      value: new Date(newDate),
      dirty: true,
      nativeValue: e?.target?.value,
      selected: new Date(newDate),
      displayed: new Date(newDate),
      valid,
    }, () => {
      if (propagateChange) {
        this.props.onChange({
          value: this.state.selected,
          valid,
        });
      }
    });
  }

  getDateToUTC(year, month, day) {
    return new Date(Date.UTC(year, month, day, 0, 0, 0));
  }

  render() {
    const {
      disabled,
      forceLabel,
      readOnly,
      required,
      boxed,
      className,
      id,
      label,
      placeholder,
      parseTitle,
      error,
      theme,
      native,
      animateMenu,
      ...rest
    } = this.props;

    const { value, opened, displayed, dirty, nativeValue } = this.state;

    return (
      <div
        ref={(ref) => this.container = ref}
        className={classNames(
          'junipero',
          'junipero-field',
          'junipero-date-field',
          'theme-' + theme,
          {
            native,
            disabled,
            opened,
            dirty,
            required,
            boxed,
            'force-label': forceLabel,
            'with-label': label,
          },
          className,
        )}
      >
        <div className="field-wrapper">
          { label !== false && (
            <label htmlFor={id}>{ label || placeholder }</label>
          ) }

          { native ? (
            <input
              { ...omit(rest, [
                'onChange', 'monthNames', 'weekDaysNames', 'validate',
                'parseValue',
              ]) }
              ref={(ref) => this.input = ref}
              className="field"
              type="date"
              readOnly={readOnly}
              disabled={disabled}
              required={required}
              value={nativeValue || ''}
              onChange={this.onNativeChange.bind(this)}
              validate={null}
              placeholder={placeholder}
            />
          ) : (
            <Dropdown
              { ...omit(rest, [
                'onChange', 'monthNames', 'weekDaysNames', 'validate',
                'parseValue',
              ]) }
              isOpen={opened}
              theme={theme}
              onToggle={this.onToggle.bind(this)}
            >
              <DropdownToggle
                tag="a"
                className="field"
              >
                { value ?
                  parseTitle(value)
                  : placeholder
                }
              </DropdownToggle>
              <DropdownMenu
                className="calendar"
                animate={animateMenu}
              >
                <div className="calendar-header">
                  <a
                    href="#"
                    className="arrow-wrapper left"
                    onClick={this.onPreviousMonthClick.bind(this)}
                  >
                    <i className="arrow" />
                  </a>
                  <div className="current-month">
                    {this.getMonthName(displayed.getMonth())}
                    { ' ' }
                    {displayed.getFullYear()}
                  </div>
                  <a
                    href="#"
                    className="arrow-wrapper right"
                    onClick={this.onNextMonthClick.bind(this)}
                  >
                    <i className="arrow" />
                  </a>
                </div>
                <div className="calendar-body">
                  <div className="week-days">
                    {this.getWeekDaysNames().map((day, index) => (
                      <span key={index} className="week-day">{day}</span>
                    ))}
                  </div>

                  <div className="days">
                    { []
                      .concat(this.getPreviousMonthDays(
                        displayed.getFullYear(),
                        displayed.getMonth()
                      ))
                      .concat(this.getMonthDays(
                        displayed.getFullYear(),
                        displayed.getMonth()
                      ))
                      .concat(this.getNextMonthDays(
                        displayed.getFullYear(),
                        displayed.getMonth()
                      ))
                      .map((date, index) => (
                        <React.Fragment
                          key={index}
                        >
                          <a
                            className={[
                              'day',
                              date.inactive ? 'inactive' : null,
                              this.isDateSelected(date) ? 'active' : null,
                            ].join(' ')}
                            href="#"
                            onClick={this.onChange.bind(this, date)}
                          >
                            { date.day }
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
          ) }
        </div>

        { error && (
          <span className="error">{ error }</span>
        ) }
      </div>
    );
  }

}

export default DateField;
