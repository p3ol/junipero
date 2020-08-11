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
  const years = Math.floor(amount / 12);
  const remaining = amount % 12;

  d.setFullYear(
    d.getFullYear() + years +
    (d.getMonth() === 11 && remaining > 0 ? 1 : 0)
  );

  d.setMonth(d.getMonth() === 11 ? remaining : d.getMonth() + remaining);

  return d;
};

export const subMonths = (date, amount) => {
  const d = new Date(date);
  const years = Math.floor(amount / 12);
  const remaining = amount % 12;

  d.setFullYear(
    d.getFullYear() - years -
    (d.getMonth() === 0 && remaining > 0 ? 1 : 0)
  );

  d.setMonth((d.getMonth() === 0 ? 11 : d.getMonth()) - remaining);

  return d;
};

export const getDaysInMonth = date => {
  return endOfMonth(date).getDate();
};
