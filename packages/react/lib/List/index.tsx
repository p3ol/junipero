import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useReducer,
  useCallback,
  useMemo,
  MutableRefObject,
  ComponentPropsWithRef,
} from 'react';
import { mockState, classNames } from '@junipero/core';
import PropTypes from 'prop-types';

import { ListContext, ListContextType } from '../contexts';
import { ArrowDown, ArrowUp } from '../icons';
import { ListColumnObject } from '../ListColumn';
import { ForwardedProps } from '../utils';

export declare type ListRef = {
  orderable: boolean;
  columns: Array<string | ListColumnObject>;
  active: string | number;
  asc: boolean | null;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface ListProps extends ComponentPropsWithRef<any> {
  columns?: Array<string | ListColumnObject>;
  onOrder?(order: { column: string | number; asc: boolean | null }): void;
  ref?: MutableRefObject<ListRef | undefined>;
}

const List = forwardRef(({
  className,
  children,
  columns = [],
  onOrder,
  ...rest
}: ListProps, ref) => {
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

  const registerColumn = (column: string | ListColumnObject) => {
    if (listRef.current.find(it => it.id === (column as ListColumnObject).id)) {
      return;
    }

    listRef.current.push(column);
    dispatch({ columns: listRef.current });
  };

  const getContext = useCallback<() => ListContextType>(() => ({
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
            <span className="junipero secondary">{ title }</span>
            { state.active === id && state.asc === true ? (
              <ArrowUp />
            ) : state.active === id && state.asc === false ? (
              <ArrowDown />
            ) : null }
          </a>
        ) : (
          <span className="junipero secondary">{ title }</span>
        ) }
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
}) as ForwardedProps<ListProps, ListRef>;

List.displayName = 'List';
List.propTypes = {
  orderable: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
      ]),
    }),
  ])),
  onOrder: PropTypes.func,
};

export default List;
