import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ForwardRefExoticComponent,
  MutableRefObject,
  ReactNode,
} from 'react';

export declare interface JuniperoRef {
  isJunipero: boolean;
  innerRef?: MutableRefObject<HTMLElement | JuniperoRef | SVGElement>;
}

/**
 * Represents a field content
 */
export declare type FieldContent<T = any> = {
  valid?: boolean;
  checked?: boolean;
  value?: T;
  dirty?: boolean;
};

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

/**
 * As it is not currently possible to generically type a forwarded component,
 * we still have to use a custom forwardedprops type & special
 * interfaces in order to keep vscode completion for component & allow
 * any props for components with a `tag` prop, like <Badge tag="a" />.
 * Without these interfaces, it would be impossible to have a `href` prop
 * on a <Badge /> component even if the tag is an `a` element.
 */
export declare interface ForwardedProps<Ref, Props>
  extends ForwardRefExoticComponent<Props & React.RefAttributes<Ref>> {}

export declare interface SpecialComponentPropsWithoutRef
  extends ComponentPropsWithoutRef<any> {
  children?: ReactNode;
  className?: string;
}
