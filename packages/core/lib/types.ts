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
