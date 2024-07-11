export declare type GenericObject = { [_: string]: any; };

export type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends (
  ...a: infer X
) => void
  ? X
  : never;
export type GrowToSize<T, A extends Array<T>, N extends number> = {
  0: A;
  1: GrowToSize<T, Grow<T, A>, N>;
}[A['length'] extends N ? 0 : 1];

export type FixedArray<T, N extends number> = GrowToSize<T, [], N>;

/**
* Represents a state comming from useReducer.
* Volontarily abstracted to allow any kind of state.
*/
export declare interface StateContent {
  [key: string]: any;
}

/**
* Represents a state comming from useReducer.
*
* When using a callback (e.g `dispatch(s => ({ ... }))`) the state should
* not be a partial and is fully passed as the first argument, and expected
* to return fully too.
*/
export declare type StateReducer<T extends StateContent> =
  (state: T, updates: Partial<T> | ((t: T) => T)) => T;
