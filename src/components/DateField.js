import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles, omit } from '../utils';
import styles from '../theme/components/DateField.styl';

class DateField extends React.Component {

  static propTypes = {
    boxed: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    validate: PropTypes.func,
    value: PropTypes.instanceOf(Date),
    parseValue: PropTypes.func,
    parseTitle: PropTypes.func,
    monthNames: PropTypes.array,
    weekDaysNames: PropTypes.array,
    placement: PropTypes.string,
    theme: PropTypes.string,
  }

  static defaultProps = {
    boxed: false,
    className: '',
    disabled: false,
    label: null,
    onChange: () => {},
    placeholder: '',
    required: false,
    validate: value => !!value,
    value: null,
    parseValue: value => value,
    parseTitle: value => value.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'],
    weekDaysNames: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
    placement: 'bottom',
    theme: 'default',
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-date-field-styles', after: '#junipero-main-styles' });

    this.state = {
      opened: this.props.opened || false,
      valid: true,
      value: this.props.value,
      selected: this.props.value || new Date(),
      displayed: this.props.value || new Date(),
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside.bind(this), true);
  }


  onToggle(e) {
    e.preventDefault();

    if (this.props.disabled) {
      return;
    }

    const opened = !this.state.opened;

    this.setState({
      opened,
      selected: this.state.value || new Date(),
      displayed: this.state.value || new Date(),
    });
  }

  onClickOutside(e) {
    if (this.toggle && this.toggle === e.target) {
      return;
    }

    if (this.container && !this.container.contains(e.target)) {
      this.setState({
        opened: false,
        selected: this.state.value || new Date(),
        displayed: this.state.value || new Date(),
      });
    }
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

  onChange(date, e) {
    e?.preventDefault();

    const newDate = this.getDateToUTC(date.year, date.month, date.day);
    const valid = this.props.validate(newDate);

    this.setState({
      opened: false,
      value: new Date(newDate),
      selected: new Date(newDate),
      displayed: new Date(newDate),
      valid,
    }, () => {
      this.props.onChange({
        value: this.state.selected,
        valid,
      });
    });
  }

  getDateToUTC(year, month, day) {
    return new Date(Date.UTC(year, month, day, 0, 0, 0));
  }

  render() {
    const {
      disabled,
      required,
      boxed,
      className,
      id,
      label,
      placeholder,
      parseTitle,
      error,
      placement,
      theme,
      ...rest
    } = this.props;

    const { value, opened, displayed } = this.state;

    return (
      <div
        ref={(ref) => this.container = ref}
        className={[
          'junipero',
          'junipero-field',
          'junipero-date-field',
          'theme-' + theme,
          disabled ? 'disabled' : null,
          opened ? 'opened' : null,
          label ? 'with-label' : null,
          required ? 'required' : null,
          boxed ? 'boxed' : null,
          className,
        ].join(' ')}
      >
        <div className="field-wrapper">
          { label && (
            <label htmlFor={id}>{ label }</label>
          ) }

          <a
            {...omit(rest, [
              'monthNames', 'weekDaysNames', 'validate', 'parseValue',
            ])}
            href="#"
            className="field"
            onClick={this.onToggle.bind(this)}
          >
            { value ?
              parseTitle(value)
              : placeholder
            }
          </a>

          { opened && (
            <div
              ref={(ref) => this.toggle = ref}
              className={[
                'calendar',
                `placement-${placement}`,
              ].join(' ')}
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
            </div>
          )}

        </div>

        { error && (
          <span className="error">{ error }</span>
        ) }
      </div>
    );
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside.bind(this), true);
  }

}

export default DateField;
