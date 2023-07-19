import { exists } from '../core';

export const startOfMonth = date => {
  const d = new Date(date);
  d.setDate(1);

  return d;
};

export const endOfMonth = date => {
  const d = addMonths(date, 1);
  d.setDate(0);

  return d;
};

export const startOfDay = data => {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);

  return d;
};

export const endOfDay = data => {
  const d = new Date(data);
  d.setHours(23, 59, 59, 999);

  return d;
};

export const addMonths = (date, amount) => {
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

export const subMonths = (date, amount) => {
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

export const getDaysInMonth = date => endOfMonth(date).getDate();

export const closestIndexTo = (date, dates) => {
  const timeToCompare = date.getTime();

  let result, minDistance;

  dates.forEach((d, index) => {
    const distance = Math.abs(timeToCompare - d.getTime());

    if (!exists(result) || distance < minDistance) {
      result = index;
      minDistance = distance;
    }
  });

  return result;
};
