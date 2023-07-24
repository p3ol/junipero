import { useContext } from 'react';

import { ChartContext } from './contexts';

export const useChart = () => useContext(ChartContext);
