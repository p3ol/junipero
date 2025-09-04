import type { StateContent } from '@junipero/core';
import type {
  ComponentPropsWithoutRef,
  RefObject,
  ElementType,
  Ref,
  ReactElement,
  LazyExoticComponent,
  FunctionComponent,
  Usable,
} from 'react';

export declare type JuniperoInnerRef = HTMLElement | SVGElement;

export declare interface JuniperoRef {
  isJunipero: boolean;
  innerRef?: RefObject<JuniperoRef | JuniperoInnerRef>;
}

/**
 * Represents a field content
 */
export declare interface FieldContent<T = any> {
  valid?: boolean;
  checked?: boolean;
  value?: T;
  dirty?: boolean;
}

export declare type SpecialComponentPropsWithRef<
  T extends ElementType = any,
  R extends JuniperoRef = any,
> = ComponentPropsWithoutRef<T> & {
  ref?: Ref<R>;
};

/**
* Represents a state comming from useReducer.
*
* When using a callback (e.g `dispatch(s => ({ ... }))`) the state should
* not be a partial and is fully passed as the first argument, and expected
* to return fully too.
*/
export declare type StateReducer<T extends StateContent> =
  (state: T, updates: Partial<T> | ((t: T) => T)) => T;

export type ReactElt = ReactElement<
  ComponentPropsWithoutRef<any>
>;

export type ReactLazy = LazyExoticComponent<FunctionComponent> & {
  _payload: Usable<ReactElt>
};
