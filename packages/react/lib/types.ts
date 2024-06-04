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

export const fixedArray = (size: number) => (
  props: Record<string, any>,
  propName: string
) => {
  if (props[propName] && props[propName]?.length !== size) {
    return new Error(`Invalid ${propName} length, expected ${size} items, ` +
      `got ${props[propName]?.length}`);
  }
};
