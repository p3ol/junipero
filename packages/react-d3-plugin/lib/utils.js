import { startOfDay, endOfDay } from '@junipero/react';
import * as d3 from 'd3';

export const getAxisTimeRange = (serie, opts = {}) => {
  switch (opts.granularity) {
    case 'year':
    case 'month':
      return d3.extent(serie, m => m[opts.dataIndex]);
    default:
      return d3.extent(d3.timeDay
        .range(startOfDay(opts.from), endOfDay(opts.to), 1));
  }
};

export const getAxisType = type => {
  switch (type) {
    case d3.axisLeft: return 'left';
    case d3.axisRight: return 'right';
    case d3.axisTop: return 'top';
    default: return 'bottom';
  }
};
