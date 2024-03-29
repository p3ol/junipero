export const getFloatPrecision = val =>
  `${val}`.split('.')[1]?.length || 0;

export const ensureMinMax = (val = 0, min = 0, max = 0) =>
  Math.max(min, Math.min(max, val));

export const formatThousand = (count, separator = ' ') => `${count}`
  .replace(/(\B(?=(\d{3})+(?!\d)))/g, separator);
