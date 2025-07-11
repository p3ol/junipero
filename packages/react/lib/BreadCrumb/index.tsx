import {
  type RefObject,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type ReactElement,
  type MouseEvent,
  Children,
  Fragment,
  useImperativeHandle,
  useRef,
  useMemo,
  useState,
} from 'react';
import { exists, classNames } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import BreadCrumbItem from '../BreadCrumbItem';

export declare interface BreadCrumbRef extends JuniperoRef {
  items: ReactNode[];
  innerRef: RefObject<HTMLDivElement>;
}

export declare interface BreadCrumbProps
  extends SpecialComponentPropsWithRef<'div', BreadCrumbRef> {
  items?: ReactNode[];
  maxItems?: number;
  filterItem?(children: ReactNode): boolean;
}

const BreadCrumb = ({
  ref,
  className,
  children,
  items,
  maxItems,
  filterItem = child => (child as ReactElement).type === BreadCrumbItem,
  ...rest
}: BreadCrumbProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    items,
    innerRef,
    isJunipero: true,
  }));

  const open = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setOpened(true);
  };

  const availableItems = useMemo<ReactNode[]>(() => (
    items
      ? items.map((item, i) => (
        <BreadCrumbItem key={i}>{ item }</BreadCrumbItem>
      ))
      : Children
        .toArray(children)
        .map((
          child: ReactElement<ComponentPropsWithoutRef<any>>
        ) => child.type === Fragment ? child.props.children : child)
        .flat()
        .filter(filterItem)
  ), [children, items, filterItem]);

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
        'junipero breadcrumb',
        opened ? 'opened' : exists(maxItems) ? 'collapsed' : '',
        className,
      )}
    >
      { !exists(maxItems) || maxItems > availableItems.length || opened
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
};

BreadCrumb.displayName = 'BreadCrumb';

export default BreadCrumb;
