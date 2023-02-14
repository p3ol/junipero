import {
  Fragment,
  Children,
  forwardRef,
  useImperativeHandle,
  useRef,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import { mockState, classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { ListContext } from '../contexts';
import { ArrowDown, ArrowUp } from '../icons';
import ListColumn from '../ListColumn';

const List = forwardRef(({
  className,
  children,
  columns,
  onOrder,
  filterColumn = child => child.type === ListColumn,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const orderable = useMemo(() => !!onOrder, [onOrder]);
  const [state, dispatch] = useReducer(mockState, {
    active: null,
    asc: null,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    orderable,
    active: state.active,
    asc: state.asc,
    isJunipero: true,
  }));

  const onOrder_ = (column, e) => {
    e?.preventDefault();

    const asc = state.asc === true ? null : state.asc === false;

    dispatch({ active: column, asc });
    onOrder?.({ column, asc });
  };

  const getContext = useCallback(() => ({
    active: state.active,
    asc: state.asc,
    orderable,
  }), [
    state.active,
    state.asc,
    orderable,
  ]);

  const renderColumn = (column, index) => {
    const { id, title, ...props } = typeof column === 'string'
      ? { id: column, title: column } : column;

    return (
      <th {...props} key={id ?? index}>
        { orderable ? (
          <a href="#" onClick={onOrder_.bind(null, id)}>
            <span className="junipero secondary">{ title }</span>
            { state.active === id && state.asc === true ? (
              <ArrowUp />
            ) : state.active === id && state.asc === false ? (
              <ArrowDown />
            ) : null }
          </a>
        ) : title }
      </th>
    );
  };

  const columnsToRender = columns
    ? columns
    : Children
      .toArray(children)
      .map(child => child.type === Fragment ? child.props.children : child)
      .flat()
      .filter(filterColumn)
      .map(c => ({ id: c.props.id, title: c.props.children }));

  return (
    <ListContext.Provider value={getContext()}>
      <table
        {...rest}
        className={classNames('junipero', 'list', className)}
        ref={innerRef}
      >
        <thead>
          <tr>{ columnsToRender.map(renderColumn) }</tr>
        </thead>
        <tbody>
          { children }
        </tbody>
      </table>
    </ListContext.Provider>
  );
});

List.displayName = 'List';
List.propTypes = {
  orderable: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.func,
      ]),
    }),
  ])),
  filterColumn: PropTypes.func,
  onOrder: PropTypes.func,
};

export default List;
