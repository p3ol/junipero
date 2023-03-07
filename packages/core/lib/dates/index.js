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
