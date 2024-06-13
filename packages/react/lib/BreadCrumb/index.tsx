import {
  type MutableRefObject,
  type ComponentPropsWithoutRef,
  type ReactNode,
  Children,
  Fragment,
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
  useMemo,
} from 'react';
import { exists, classNames, mockState } from '@junipero/core';

import type { JuniperoRef, StateReducer } from '../types';
import BreadCrumbItem from '../BreadCrumbItem';

export declare interface BreadCrumbRef extends JuniperoRef {
  items: Array<JSX.Element | ReactNode>;
  innerRef: MutableRefObject<HTMLDivElement>;
}

export declare interface BreadCrumbProps
  extends ComponentPropsWithoutRef<'div'> {
  items?: Array<JSX.Element | ReactNode>;
  maxItems?: number;
  filterItem?(children: JSX.Element | ReactNode): boolean;
}

export declare interface BreadCrumbState {
  opened: boolean;
}

const BreadCrumb = forwardRef<BreadCrumbRef, BreadCrumbProps>(({
  className,
  children,
  items,
  maxItems,
  filterItem = child => (child as JSX.Element).type === BreadCrumbItem,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLDivElement>();
  const [state, dispatch] = useReducer<
    StateReducer<BreadCrumbState>
  >(mockState, {
    opened: false,
  });

  useImperativeHandle(ref, () => ({
    items,
    innerRef,
    isJunipero: true,
  }));

  const open = (e: React.MouseEvent) => {
    e.preventDefault();

    dispatch({ opened: true });
  };

  const availableItems = useMemo<ReactNode[]>(() => (
    items
      ? items.map((item, i) => (
        <BreadCrumbItem key={i}>{ item }</BreadCrumbItem>
      ))
      : Children
        .toArray(children)
        .map((child: JSX.Element) => child.type === Fragment
          ? child.props.children : child)
        .flat()
        .filter(filterItem)
  ), [children, items]);

  const before = useMemo<ReactNode[]>(() => (
    availableItems.slice(0, Math.ceil(maxItems / 2))
  ), [availableItems, maxItems]);

  const after = useMemo<ReactNode[]>(() => (
    availableItems.slice(-Math.floor(maxItems / 2))
  ), [availableItems, maxItems]);

  return (
    <div
      { ...rest }
      ref={innerRef}
      className={classNames(
        'junipero',
        'breadcrumb',
        state.opened ? 'opened' : exists(maxItems) ? 'collapsed' : '',
        className,
      )}
    >
      { !exists(maxItems) || maxItems > availableItems.length || state.opened
        ? availableItems
        : (
          <>
            { before }
            <BreadCrumbItem tag="a" onClick={open}>...</BreadCrumbItem>
            { after }
          </>
        ) }
    </div>
  );
});

BreadCrumb.displayName = 'BreadCrumb';

export default BreadCrumb;
