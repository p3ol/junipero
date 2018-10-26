import React from 'react';
import PropTypes from 'prop-types';

import '../theme/components/DateField.styl';

const propTypes = {
  arrowComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  boxed: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func,
  // options: PropTypes.object,
  placeholder: PropTypes.string,
  prefix: PropTypes.object,
  required: PropTypes.bool,
  suffix: PropTypes.object,
  tabIndex: PropTypes.number,
  validate: PropTypes.func,
  value: PropTypes.instanceOf(Date),
  parseValue: PropTypes.func,
  monthNames: PropTypes.array,
  weekDaysNames: PropTypes.array,
  placement: PropTypes.string,
};

const defaultProps = {
  arrowComponent: (<i className="select-arrow-icon" />),
  boxed: false,
  className: '',
  disabled: false,
  label: 'Label',
  onChange: () => {},
  // options: {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  // },
  placeholder: 'Pick a date...',
  prefix: null,
  required: false,
  suffix: null,
  tabIndex: 0,
  validate: value => !!value,
  value: null,
  parseValue: value => value.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'],
  weekDaysNames: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
  placement: 'bottom',
};

class DateField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    // currentDay: this.props.value?.getDate() || new Date().getDate(),
    // currentMonth: this.props.value?.getMonth() || new Date().getMonth(),
    // initialMonth: null,
    // currentYear: this.props.value?.getFullYear() || new Date().getFullYear(),
      opened: this.props.opened || false,
      // value: this.props.value?.toLocaleDateString(
      //   this.props.lang, this.props.options) || null,
      valid: true,
      value: this.props.value,
      selected: this.props.value || new Date(),
      displayed: this.props.value || new Date(),
    };

    // this.febNumberOfDays = '';
    // this.totalDaysPerMonth = ['31', `${this.getFebTotalDay()}`, '31', '30',
    //   '31', '30', '31', '31', '30', '31', '30', '31'];
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside.bind(this), true);
    //this.setState({ initialMonth: this.state.currentMonth });
  }

  _getFebTotalDay() {
    if ((this.state.currentYear % 100 != 0) &&
      (this.state.currentYear % 4 == 0) ||
      (this.state.currentYear % 400 == 0)) {
      return 29;
    } else {
      return 28;
    }
  }

  onToggle() {
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

  _onDayClick(day, increaseMonth = false, decreaseMonth = false) {
    if (increaseMonth == true) { this.getNextMonth(); }
    if (decreaseMonth == true) { this.getPreviousMonth(); }
    this.setState({
      currentDay: day,
      opened: false,
    }, () => {
      this.onChange(day);
    });
    return false;
  }

  _onChange(value) {
    if (this.props.disabled) {
      return;
    }
    this.setState({ initialMonth: this.state.currentMonth }, () => {
      value = this.formatDate(value);
      const { validate } = this.props;
      const valid = validate(value);

      this.setState({ valid, value, opened: false }, () => {
        this.props.onChange({
          value: new Date(Date.UTC(
            this.state.currentYear,
            this.state.currentMonth,
            this.state.currentDay,
          )),
          valid,
        });
      });
    });
  }

  _formatDate(day) {
    return new Date(this.state.currentYear, this.state.currentMonth, day)
      .toLocaleDateString(this.props.lang, this.props.options);
  }

  _getNumOfDays() {
    return this.totalDaysPerMonth[this.state.currentMonth];
  }

  _getFirstDaysOfNextMonth() {
    return new Date(
      this.state.currentYear,
      this.state.currentMonth,
      this.getNumOfDays()
    ).getDay();
  }

  _getFirstDayOfMonth() {
    return new Date(this.state.currentYear, this.state.currentMonth).getDay();
  }

  _getPreviousMonth() {
    if (this.state.currentMonth == 0) {
      this.setState({
        currentMonth: 11,
        currentYear: this.state.currentYear - 1,
      });
    } else {
      this.setState({ currentMonth: this.state.currentMonth - 1 });
    }
  }

  _getNextMonth() {
    if (this.state.currentMonth == 11) {
      this.setState({
        currentMonth: 0,
        currentYear: this.state.currentYear + 1,
      });
    } else {
      this.setState({ currentMonth: this.state.currentMonth + 1 });
    }
  }

  _getFirstRowEmptySlots() {
    let blanks = [];
    let prevMonthDaysCounter = this.getFirstDayOfMonth() - 2;
    let prevMonthDays = this.state.currentMonth == 0 ?
      31 : this.totalDaysPerMonth[this.state.currentMonth - 1];

    // Get last days of previous month for first empty cols
    for (let i = this.getFirstDayOfMonth(); i > 1; i-- ) {
      let day = prevMonthDays - prevMonthDaysCounter;
      blanks.push(
        <div
          key={`prev-${i}`}
          className="junipero-day text-muted"
          onClick={this.onDayClick.bind(this, day, false, true )}
          role="button"
          tabIndex={this.props.tabIndex}
        >
          <span>{day}</span>
        </div>
      );
      prevMonthDaysCounter--;
    }
    return blanks;
  }

  _getMonthDays() {
    let daysInMonth = [];
    let totalDays = this.getNumOfDays();
    let nextMonthDayCounter = 1;

    // Get all days of current month
    for (let dayNumber = 1; dayNumber <= totalDays; dayNumber++) {
      daysInMonth.push(
        <div
          key={dayNumber}
          className={dayNumber == this.state.currentDay &&
            this.state.currentMonth == this.state.initialMonth ?
            'junipero-day junipero-current-day' :
            'junipero-day'}
        >
          <a
            href="#"
            onClick={this.onDayClick.bind(this, dayNumber)}
          >
            {dayNumber}
          </a>
        </div>
      );
    }

    // Get first days of next month for last empty cols
    for (let i = this.getFirstDaysOfNextMonth(); i < 7; i++) {
      daysInMonth.push(
        <div
          key={totalDays + nextMonthDayCounter}
          className="junipero-day text-muted"
        >
          <a
            href="#"
            onClick={this.onDayClick.bind(this, nextMonthDayCounter, true)}
          >
            {nextMonthDayCounter}
          </a>
        </div>
      );
      nextMonthDayCounter++;
    }
    return daysInMonth;
  }

  _buildCalendar() {
    let blanks = this.getFirstRowEmptySlots();
    let daysInMonth = this.getMonthDays();

    let totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if (i % 7 != 0) {
        cells.push(row);
      } else {
        let insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }
      if (i == totalSlots.length - 1) {
        let insertRow = cells.slice();
        rows.push(insertRow);
      }
    });

    return rows.map((row, index) => {
      return <div className="junipero-number-list" key={index}>{row}</div>;
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

  onPreviousMonthClick() {
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

  onNextMonthClick() {
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

  onChange(date) {
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
    const { displayed } = this.state;

    return (
      <div
        ref={(ref) => this.container = ref}
        className={[
          'junipero',
          'junipero-field',
          'date-field',
          this.props.disabled ? 'disabled' : null,
          this.state.opened ? 'opened' : null,
          this.props.required ? 'required' : null,
          this.props.boxed ? 'boxed' : null,
          this.props.className,
        ].join(' ')}
      >
        <a
          className="field-wrapper"
          onClick={this.onToggle.bind(this)}
          role="button"
          tabIndex={this.props.tabIndex}
        >
          { this.props.prefix && (
            <div className="field-prefix">{ this.props.prefix }</div>
          ) }

          <div className="field-inner">
            <div className="field">
              { this.state.value ?
                this.props.parseValue(this.state.value)
                : this.props.placeholder
              }
            </div>

            { this.props.label && (
              <span className="label">{ this.props.label }</span>
            ) }
          </div>

          { this.props.arrowComponent && (
            <div className="select-arrow">
              { this.props.arrowComponent }
            </div>
          ) }

          { this.props.suffix && (
            <div className="field-suffix">{ this.props.suffix }</div>
          ) }
        </a>

        { this.props.error && (
          <span className="error">{ this.props.error }</span>
        ) }

        {this.state.opened && (
          <div
            ref={(ref) => this.toggle = ref}
            className={[
              'calendar',
              `placement-${this.props.placement}`,
            ].join(' ')}
          >
            <div className="calendar-header">
              <a
                className="arrow-wrapper left"
                role="button"
                tabIndex={this.props.tabIndex}
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
                className="arrow-wrapper right"
                role="button"
                tabIndex={this.props.tabIndex}
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
                      key={index}>
                      <a
                        className={[
                          'day',
                          date.inactive ? 'inactive' : null,
                          this.isDateSelected(date) ? 'active' : null,
                        ].join(' ')}
                        role="button"
                        tabIndex={this.props.tabIndex}
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
    );
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside.bind(this), true);
  }

}

DateField.propTypes = propTypes;
DateField.defaultProps = defaultProps;

export default DateField;
