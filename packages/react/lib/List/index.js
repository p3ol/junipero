import {
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

const List = forwardRef(({
  className,
  children,
  columns = [],
  onOrder,
  ...rest
}, ref) => {
  const listRef = useRef([]);
  const innerRef = useRef();
  const orderable = useMemo(() => !!onOrder, [onOrder]);
  const [state, dispatch] = useReducer(mockState, {
    columns,
    active: null,
    asc: null,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    orderable,
    columns: state.columns,
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

  const registerColumn = column => {
    if (listRef.current.find(it => it.id === column.id)) {
      return;
    }

    listRef.current.push(column);
    dispatch({ columns: listRef.current });
  };

  const getContext = useCallback(() => ({
    active: state.active,
    asc: state.asc,
    orderable,
    registerColumn,
  }), [
    state.columns,
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
            <span>{ title }</span>
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

  return (
    <ListContext.Provider value={getContext()}>
      <table
        {...rest}
        className={classNames('junipero', 'list', className)}
        ref={innerRef}
      >
        <thead>
          <tr>{ state.columns.map(renderColumn) }</tr>
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
  onOrder: PropTypes.func,
};

export default List;
