import { useContext } from 'react';

import { type ChartContextType, ChartContext } from './contexts';

export const useChart = () => useContext<ChartContextType>(ChartContext);
