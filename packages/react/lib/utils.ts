import type { StateContent } from './types';

export const mockState = <T extends StateContent>(
  state: T,
  action : ((prev: T) => T) | Partial<T>
) => typeof action === 'function'
    ? action(state) : ({ ...state, ...action as T });
