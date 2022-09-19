import {
  addMonths,
  subMonths,
} from './';

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
  });
});
