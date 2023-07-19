import * as d3 from 'd3';

export const getAxisType = type => {
  switch (type) {
    case d3.axisLeft: return 'left';
    case d3.axisRight: return 'right';
    case d3.axisTop: return 'top';
    default: return 'bottom';
  }
};
