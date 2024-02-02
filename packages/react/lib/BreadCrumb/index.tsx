import {
  Children,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useReducer,
  useRef,
  useMemo,
  ReactNode,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';
import { exists, classNames, mockState } from '@junipero/core';
import PropTypes from 'prop-types';

import BreadCrumbItem from '../BreadCrumbItem';
import { ForwardedProps, MockState } from '../utils';

export declare type BreadCrumbRef = {
  items: Array<JSX.Element> | Array<string>;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface BreadCrumbProps extends ComponentPropsWithRef<any> {
  children?: JSX.Element | Array<JSX.Element>;
  className?: string;
  items?: Array<JSX.Element> | Array<string>;
  maxItems?: number;
  filterItem?(children: JSX.Element): boolean;
  ref?: MutableRefObject<BreadCrumbRef | undefined>;
}
const BreadCrumb = forwardRef(({
  className,
  children,
  items,
  maxItems,
  filterItem = child => child.type === BreadCrumbItem,
  ...rest
}: BreadCrumbProps, ref) => {
  const innerRef = useRef();
  const [state, dispatch] = useReducer<MockState<{opened: boolean}>>(
    mockState, {
      opened: false,
    }
  );

  useImperativeHandle(ref, () => ({
    items,
    innerRef,
    isJunipero: true,
  }));

  const open = e => {
    e.preventDefault();

    dispatch({ opened: true });
  };

  const availableItems = useMemo<Array<JSX.Element | string>>(() => (
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

  const before = useMemo(() => (
    availableItems.slice(0, Math.ceil(maxItems / 2))
  ), [availableItems, maxItems]);

  const after = useMemo<Array<JSX.Element | string>>(() => (
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
}) as ForwardedProps<BreadCrumbProps, BreadCrumbRef>;

BreadCrumb.displayName = 'BreadCrumb';
BreadCrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  maxItems: PropTypes.number,
  filterItem: PropTypes.func,
};
export default BreadCrumb;
