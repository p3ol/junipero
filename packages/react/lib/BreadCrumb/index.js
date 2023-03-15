import {
  Children,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useReducer,
  useRef,
  useMemo,
} from 'react';
import { exists, classNames, mockState } from '@junipero/core';
import PropTypes from 'prop-types';

import BreadCrumbItem from '../BreadCrumbItem';

const BreadCrumb = forwardRef(({
  className,
  children,
  items,
  maxItems,
  filterItem = child => child.type === BreadCrumbItem,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
  });

  useImperativeHandle(ref, () => ({
    items,
    innerRef,
    isJunipero: true,
  }));

  const open = e => {
    e.preventDefault();

    dispatch({ opened: true });
  };

  const availableItems = useMemo(() => (
    items
      ? items.map((item, i) => (
        <BreadCrumbItem key={i}>{ item }</BreadCrumbItem>
      ))
      : Children
        .toArray(children)
        .map(child => child.type === Fragment ? child.props.children : child)
        .flat()
        .filter(filterItem)
  ), [children, items]);

  const before = useMemo(() => (
    availableItems.slice(0, Math.ceil(maxItems / 2))
  ), [availableItems, maxItems]);

  const after = useMemo(() => (
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
BreadCrumb.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  maxItems: PropTypes.number,
  filterItem: PropTypes.func,
};

export default BreadCrumb;
