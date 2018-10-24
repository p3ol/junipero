import React from 'react';
import PropTypes from 'prop-types';

import '../theme/components/DateField.styl';

const propTypes = {
  arrowComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  boxed: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  lang: PropTypes.string,
  monthNames: PropTypes.array,
  onChange: PropTypes.func,
  options: PropTypes.object,
  placeholder: PropTypes.string,
  prefix: PropTypes.object,
  required: PropTypes.bool,
  suffix: PropTypes.object,
  tabIndex: PropTypes.number,
  validate: PropTypes.func,
  value: PropTypes.instanceOf(Date),
  weekDaysShort: PropTypes.array,
};

const defaultProps = {
  arrowComponent: (<i className="select-arrow-icon" />),
  boxed: false,
  className: '',
  disabled: false,
  label: 'Label',
  lang: 'en-EN',
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'],
  onChange: () => {},
  options: {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  placeholder: 'Pick a date...',
  prefix: null,
  required: false,
  suffix: null,
  tabIndex: 0,
  validate: value => !!value,
  value: null,
  weekDaysShort: ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'],
};

class DateField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentDay: this.props.value?.getDate() || new Date().getDate(),
      currentMonth: this.props.value?.getMonth() || new Date().getMonth(),
      initialMonth: null,
      currentYear: this.props.value?.getFullYear() || new Date().getFullYear(),
      opened: this.props.opened || false,
      value: this.props.value?.toLocaleDateString(
        this.props.lang, this.props.options) || null,
    };

    this.febNumberOfDays = '';
    this.totalDaysPerMonth = ['31', `${this.getFebTotalDay()}`, '31', '30',
      '31', '30', '31', '31', '30', '31', '30', '31'];
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside.bind(this), true);
    this.setState({ initialMonth: this.state.currentMonth });
  }

  getFebTotalDay() {
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

    this.setState({ opened: !this.state.opened });
  }

  onClickOutside(e) {
    if (this.toggle && this.toggle === e.target) {
      return;
    }

    if (this.container && !this.container.contains(e.target)) {
      this.setState({ opened: false });
    }
  }

  onDayClick(day, increaseMonth = false, decreaseMonth = false) {
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

  onChange(value) {
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

  formatDate(day) {
    return new Date(this.state.currentYear, this.state.currentMonth, day)
      .toLocaleDateString(this.props.lang, this.props.options);
  }

  getNumOfDays() {
    return this.totalDaysPerMonth[this.state.currentMonth];
  }

  getFirstDaysOfNextMonth() {
    return new Date(
      this.state.currentYear,
      this.state.currentMonth,
      this.getNumOfDays()
    ).getDay();
  }

  getFirstDayOfMonth() {
    return new Date(this.state.currentYear, this.state.currentMonth).getDay();
  }

  getPreviousMonth() {
    if (this.state.currentMonth == 0) {
      this.setState({
        currentMonth: 11,
        currentYear: this.state.currentYear - 1,
      });
    } else {
      this.setState({ currentMonth: this.state.currentMonth - 1 });
    }
  }

  getNextMonth() {
    if (this.state.currentMonth == 11) {
      this.setState({
        currentMonth: 0,
        currentYear: this.state.currentYear + 1,
      });
    } else {
      this.setState({ currentMonth: this.state.currentMonth + 1 });
    }
  }

  getFirstRowEmptySlots() {
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

  getMonthDays() {
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

  buildCalendar() {
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

  render() {
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
              { this.state.value || this.props.placeholder }
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
            className="junipero-calendar"
          >
            <div className="junipero-calendar-head">
              <div className="arrow-inner">
                <button
                  className="left-arrow"
                  onClick={this.getPreviousMonth.bind(this)}>
                  <span className="left-arrow-icon"></span>
                </button>
              </div>
              <div className="junipero-current-date">
                {this.props.monthNames[this.state.currentMonth]}
                <span className="p-1">{this.state.currentYear}</span>
              </div>
              <div className="arrow-inner right">
                <button
                  className="right-arrow"
                  onClick={this.getNextMonth.bind(this)}>
                  <span className="right-arrow-icon"></span>
                </button>
              </div>
            </div>
            <div className="junipero-calendar-body">
              <div className="d-flex justify-content-center">
                {this.props.weekDaysShort.map((day, index) => {
                  return (
                    <div key={index} className="junipero-week-day">{day}</div>
                  );
                })}
              </div>
              {this.buildCalendar(this)}
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
