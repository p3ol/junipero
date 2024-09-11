import * as d3 from 'd3';

export const getAxisType = (
  type: 'axisLeft' | 'axisRight' | 'axisTop' | 'axisBottom'
) => {
  switch (type) {
    case 'axisLeft': return 'left';
    case 'axisRight': return 'right';
    case 'axisTop': return 'top';
    default: return 'bottom';
  }
};

export const getAxisFunction = (
  type: 'axisLeft' | 'axisRight' | 'axisTop' | 'axisBottom'
) => {
  switch (type) {
    case 'axisLeft': return d3.axisLeft;
    case 'axisRight': return d3.axisRight;
    case 'axisTop': return d3.axisTop;
    default: return d3.axisBottom;
  }
};

export const scaleBandInvert = (scale: d3.ScaleBand<Date | number>) => {
  // Distance between the starts of adjacent bands
  const step = scale.step();
  // Space between two adjacent bands
  const paddingInner = step * scale.paddingInner();
  // Space before the first band
  const leftPad = step * scale.paddingOuter() * scale.align() * 2;
  const domain = scale.domain();

  return function (x: number): number {
    // Clamp index value between 0 and domain length
    const index = Math.min(Math.max(0, Math.floor(
      ((x - leftPad - step + paddingInner / 2) / step) + 1
    )), domain.length - 1);

    return index;
  };
};
