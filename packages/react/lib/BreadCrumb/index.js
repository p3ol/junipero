import {
  Children,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { exists, classNames, mockState } from '@junipero/core';
import PropTypes from 'prop-types';

import BreadCrumbItem from '../BreadCrumbItem';

const BreadCrumb = forwardRef(({
  className,
  children,
  maxItems,
  filterItem = child => child.type === BreadCrumbItem,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const open = e => {
    e.preventDefault();

    dispatch({ opened: true });
  };

  const items = Children
    .toArray(children)
    .map(child => child.type === Fragment ? child.props.children : child)
    .flat()
    .filter(filterItem);
  const before = items.slice(0, Math.ceil(maxItems / 2));
  const after = items.slice(-Math.floor(maxItems / 2));

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
      { !exists(maxItems) || maxItems > items.length || state.opened ? items : (
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
  maxItems: PropTypes.number,
  filterItem: PropTypes.func,
};

export default BreadCrumb;
