import { exists } from '../core';

export const startOfYear = (date: Date | string | number): Date => {
  const d = new Date(date);
  d.setMonth(0, 1);

  return startOfMonth(d);
};

export const endOfYear = (date: Date | string | number): Date => {
  const d = new Date(date);
  d.setMonth(11, 31);

  return endOfMonth(d);
};

export const startOfMonth = (date: Date | string | number): Date => {
  const d = new Date(date);
  d.setDate(1);

  return startOfDay(d);
};

export const endOfMonth = (date: Date | string | number): Date => {
  const d = addMonths(date, 1);
  d.setDate(0);

  return endOfDay(d);
};

export const startOfDay = (data: Date | string | number): Date => {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);

  return d;
};

export const endOfDay = (data: Date | string | number): Date => {
  const d = new Date(data);
  d.setHours(23, 59, 59, 999);

  return d;
};

export const addMonths = (
  date: Date | string | number, amount: number
): Date => {
  const d = new Date(date);
  const nextMonthDays = new Date(
    d.getFullYear(),
    d.getMonth() + amount + 1,
    0
  ).getDate();

  return new Date(
    d.getFullYear(), d.getMonth() + amount, Math.min(nextMonthDays, d.getDate())
  );
};

export const subMonths = (
  date: Date | string | number, amount: number
): Date => {
  const d = new Date(date);

  const nextMonthDays = new Date(
    d.getFullYear(),
    d.getMonth() - amount + 1,
    0
  ).getDate();

  return new Date(
    d.getFullYear(), d.getMonth() - amount, Math.min(nextMonthDays, d.getDate())
  );
};

export const getDaysInMonth =
  (date: Date | number | string): number => endOfMonth(date).getDate();

export const closestIndexTo = (date: Date, dates: Date[]): number => {
  const timeToCompare = date.getTime();

  let result: number, minDistance: number;

  dates.forEach((d, index) => {
    const distance = Math.abs(timeToCompare - d.getTime());

    if (!exists(result) || distance < minDistance) {
      result = index;
      minDistance = distance;
    }
  });

  return result;
};
