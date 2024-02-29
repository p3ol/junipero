export const getFloatPrecision = (val: number | string): number =>
  `${val}`.split('.')[1]?.length || 0;

export const ensureMinMax = (
  val: number = 0, min: number = 0, max: number = 0
): number => Math.max(min, Math.min(max, val));

export const formatThousand = (
  count: number | string, separator: string = ' '
): string => `${count}`.replace(/(\B(?=(\d{3})+(?!\d)))/g, separator);
