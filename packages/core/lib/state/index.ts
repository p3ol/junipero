import type { StateContent } from '../types';

/**
 * mockState should be inside react package, but some external packages
 * (like @poool/react-access) only depend on @junipero/core, so it will be
 * here forever).
 */
export const mockState = <T extends StateContent>(
  state: T,
  action : ((prev: T) => T) | Partial<T>
) => typeof action === 'function'
  ? action(state)
  : ({ ...state, ...action as T });
