import { use } from 'react';

import { type ChartContextType, ChartContext } from './contexts';

export const useChart = () => use<ChartContextType>(ChartContext);
