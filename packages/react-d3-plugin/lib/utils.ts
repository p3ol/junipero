import * as d3 from 'd3';

export const getAxisType = type => {
  switch (type) {
    case d3.axisLeft: return 'left';
    case d3.axisRight: return 'right';
    case d3.axisTop: return 'top';
    default: return 'bottom';
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
