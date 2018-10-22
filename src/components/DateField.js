import React from 'react';
import PropTypes from 'prop-types';

import '../theme/components/DateField.styl';

const propTypes = {
  className: PropTypes.string,
};

const defaultProps = {
  className: null,
};

class DateField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};

    this.febNumberOfDays = '';

    this.dateNow = new Date();
    this.currentDay = this.dateNow.getDate();
    this.currentMonth = this.dateNow.getMonth();
    this.currentYear = this.dateNow.getFullYear();

    // Months and week days
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    // this.currentDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
    //   'Thrusday', 'Friday', 'Saturday'];
    this.weekDaysShort = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.totalDaysPerMonth = ['31', `${this.getFebTotalDay()}`, '31', '30',
      '31', '30', '31', '31', '30', '31', '30', '31'];

    this.firstDay = new Date(this.dateNow.getFullYear(),
      this.dateNow.getMonth(), 1).getDate();
    this.numOfDays = this.totalDaysPerMonth[this.currentMonth];
  }

  getFebTotalDay() {
    if ((this.currentYear % 100 != 0) && (this.currentYear % 4 == 0) ||
      (this.currentYear % 400 == 0)) {
      return 29;
    } else {
      return 28;
    }
  }

  getPreviousMonthDays() {
    let blanks = [];
    for (let i = 1; i < this.firstDay; i++ ) {
      blanks.push(<td className="empty"></td>);
    }
    return blanks;
  }

  getMonthDays() {
    let daysInMonth = [];
    for (let dayNumber = 1; dayNumber <= this.numOfDays; dayNumber++) {
      daysInMonth.push(
        <td
          key={dayNumber}
          className={dayNumber == this.currentDay ? 'junipero-day ' +
          'junipero-current-day' : 'junipero-day'}
        >
          <span>{dayNumber}</span>
        </td>
      );
    }
    return daysInMonth;
  }

  buildCalendar() {
    let blanks = this.getPreviousMonthDays();
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
      return <tr key={index}>{row}</tr>;
    });
  }

  render() {
    return (
      <div
        className={[
          'junipero',
          'date-field',
          this.props.className,
        ].join(' ')}
      >
        <table className="calendar">
          <thead>
            <tr>
              <th className="junipero-current-month" colSpan="7">
                {this.monthNames[this.currentMonth]} {this.currentYear}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {this.weekDaysShort.map((day, index) => {
                return <td key={index} className="junipero-week-day">{day}</td>;
              })}
            </tr>
            {this.buildCalendar()}
          </tbody>
        </table>
      </div>
    );
  }
}

DateField.propTypes = propTypes;
DateField.defaultProps = defaultProps;

export default DateField;
