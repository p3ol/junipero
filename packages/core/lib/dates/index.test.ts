import {
  addMonths,
  subMonths,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  getDaysInMonth,
  closestIndexTo,
} from '.';

describe('dates', () => {
  describe('addMonths(date, amount)', () => {
    it('should allow to add a month to a date', () => {
      expect(addMonths(new Date(2020, 0, 1), 1).getMonth()).toBe(1);
    });

    it('should allow to add several months to a date', () => {
      expect(addMonths(new Date(2020, 0, 1), 5).getMonth()).toBe(5);
    });

    it('should add a year if months go over 12', () => {
      expect(addMonths(new Date(2020, 10, 1), 29).getFullYear()).toBe(2023);
      expect(addMonths(new Date(2020, 10, 1), 29).getMonth()).toBe(3);
    });

    it('should change date if next month has ' +
    'less days than current', () => {
      expect(addMonths(new Date(2022, 0, 31), 1).getDate()).toBe(28);
      expect(addMonths(new Date(2022, 0, 31), 1).getMonth()).toBe(1);
    });
  });

  describe('subMonths(date, amount)', () => {
    it('should allow to sub a month to a date', () => {
      expect(subMonths(new Date(2020, 1, 1), 1).getMonth()).toBe(0);
    });

    it('should allow to sub several months to a date', () => {
      expect(subMonths(new Date(2020, 6, 1), 5).getMonth()).toBe(1);
    });

    it('should sub one or several years if months go over 12', () => {
      expect(subMonths(new Date(2020, 10, 1), 29).getFullYear()).toBe(2018);
      expect(subMonths(new Date(2020, 10, 1), 29).getMonth()).toBe(5);
    });

    it('should change date if next month has ' +
    'less days than current', () => {
      expect(subMonths(new Date(2022, 2, 31), 1).getDate()).toBe(28);
      expect(subMonths(new Date(2022, 2, 31), 1).getMonth()).toBe(1);
    });
  });

  describe('startOfYear(date)', () => {
    it('should return the start of the year', () => {
      const date = startOfYear(new Date(2020, 10, 1, 12, 30, 30, 300));

      expect(date.getMilliseconds()).toBe(0);
      expect(date.getSeconds()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getHours()).toBe(0);
      expect(date.getDate()).toBe(1);
      expect(date.getMonth()).toBe(0);
      expect(date.getFullYear()).toBe(2020);
    });
  });

  describe('endOfYear(date)', () => {
    it('should return the end of the year', () => {
      const date = endOfYear(new Date(2020, 10, 1, 12, 30, 30, 300));

      expect(date.getMilliseconds()).toBe(999);
      expect(date.getSeconds()).toBe(59);
      expect(date.getMinutes()).toBe(59);
      expect(date.getHours()).toBe(23);
      expect(date.getDate()).toBe(31);
      expect(date.getMonth()).toBe(11);
      expect(date.getFullYear()).toBe(2020);
    });
  });

  describe('startOfMonth(date)', () => {
    it('should return the start of the month', () => {
      const date = startOfMonth(new Date(2020, 10, 1, 12, 30, 30, 300));

      expect(date.getMilliseconds()).toBe(0);
      expect(date.getSeconds()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getHours()).toBe(0);
      expect(date.getDate()).toBe(1);
      expect(date.getMonth()).toBe(10);
      expect(date.getFullYear()).toBe(2020);
    });
  });

  describe('endOfMonth(date)', () => {
    it('should return the end of the month', () => {
      const date = endOfMonth(new Date(2020, 10, 1, 12, 30, 30, 300));

      expect(date.getMilliseconds()).toBe(999);
      expect(date.getSeconds()).toBe(59);
      expect(date.getMinutes()).toBe(59);
      expect(date.getHours()).toBe(23);
      expect(date.getDate()).toBe(30);
      expect(date.getMonth()).toBe(10);
      expect(date.getFullYear()).toBe(2020);
    });
  });

  describe('startOfDay(date)', () => {
    it('should return the start of the day', () => {
      const date = startOfDay(new Date(2020, 10, 8, 12, 30, 30, 300));

      expect(date.getMilliseconds()).toBe(0);
      expect(date.getSeconds()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getHours()).toBe(0);
      expect(date.getDate()).toBe(8);
      expect(date.getMonth()).toBe(10);
      expect(date.getFullYear()).toBe(2020);
    });
  });

  describe('endOfDay(date)', () => {
    it('should return the end of the day', () => {
      const date = endOfDay(new Date(2020, 10, 8, 12, 30, 30, 300));

      expect(date.getMilliseconds()).toBe(999);
      expect(date.getSeconds()).toBe(59);
      expect(date.getMinutes()).toBe(59);
      expect(date.getHours()).toBe(23);
      expect(date.getDate()).toBe(8);
      expect(date.getMonth()).toBe(10);
      expect(date.getFullYear()).toBe(2020);
    });
  });

  describe('getDaysInMonth(date)', () => {
    it('should return the number of days in a month', () => {
      expect(getDaysInMonth(new Date(2020, 0, 1))).toBe(31);
      expect(getDaysInMonth(new Date(2020, 1, 1))).toBe(29);
      expect(getDaysInMonth(new Date(2020, 2, 1))).toBe(31);
      expect(getDaysInMonth(new Date(2020, 3, 1))).toBe(30);
      expect(getDaysInMonth(new Date(2020, 4, 1))).toBe(31);
      expect(getDaysInMonth(new Date(2020, 5, 1))).toBe(30);
      expect(getDaysInMonth(new Date(2020, 6, 1))).toBe(31);
      expect(getDaysInMonth(new Date(2020, 7, 1))).toBe(31);
      expect(getDaysInMonth(new Date(2020, 8, 1))).toBe(30);
      expect(getDaysInMonth(new Date(2020, 9, 1))).toBe(31);
      expect(getDaysInMonth(new Date(2020, 10, 1))).toBe(30);
      expect(getDaysInMonth(new Date(2020, 11, 1))).toBe(31);
    });
  });

  describe('closestIndexTo(date, dates)', () => {
    it('should return the index of the closest date', () => {
      const dates = [
        new Date(2020, 0, 1),
        new Date(2020, 0, 2),
        new Date(2020, 0, 3),
        new Date(2020, 0, 4),
        new Date(2020, 0, 5),
      ];

      expect(closestIndexTo(new Date(2020, 0, 1), dates)).toBe(0);
      expect(closestIndexTo(new Date(2020, 0, 2), dates)).toBe(1);
      expect(closestIndexTo(new Date(2020, 0, 3), dates)).toBe(2);
      expect(closestIndexTo(new Date(2020, 0, 4), dates)).toBe(3);
      expect(closestIndexTo(new Date(2020, 0, 5), dates)).toBe(4);
      expect(closestIndexTo(new Date(2020, 0, 6), dates)).toBe(4);
      expect(closestIndexTo(new Date(2020, 0, 2, 12), dates)).toBe(1);
      expect(closestIndexTo(new Date(2020, 0, 3, 12, 30), dates)).toBe(3);
    });
  });
});
