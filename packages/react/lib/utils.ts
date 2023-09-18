import { ForwardRefExoticComponent } from 'react';

type Grow<T, A extends Array<T>> = ((x: T, ...xs: A) => void) extends (
  ...a: infer X
) => void
  ? X
  : never;
type GrowToSize<T, A extends Array<T>, N extends number> = {
  0: A;
  1: GrowToSize<T, Grow<T, A>, N>;
}[A['length'] extends N ? 0 : 1];

export type FixedArray<T, N extends number> = GrowToSize<T, [], N>;

// TODO move this to core project
export declare interface ForwardedProps<T, P>
  extends ForwardRefExoticComponent<T & React.RefAttributes<P>> {}

// TODO move this to core project
export declare type MockState<T> = (state: T, action: any) => T;
