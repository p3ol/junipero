import {
  type RefObject,
  useImperativeHandle,
  useRef,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { classNames, mockState } from '@junipero/core';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import type { ListColumnObject } from '../ListColumn';
import { ListContext, type ListContextType } from '../contexts';
import { ArrowDown, ArrowUp } from '../icons';

export declare interface ListRef extends JuniperoRef {
  orderable: boolean;
  columns: (string | ListColumnObject)[];
  active?: string | number;
  asc?: boolean | null;
  innerRef: RefObject<HTMLTableElement>;
}

export declare interface ListProps
  extends SpecialComponentPropsWithRef<'table', ListRef> {
  columns?: (string | ListColumnObject)[];
  order?: { column: string | number; asc: boolean | null };
  orderable?: boolean;
  onOrder?(order: { column: string | number; asc: boolean | null }): void;
}

export declare interface ListState {
  columns: (string | ListColumnObject)[];
  active?: string | number;
  asc?: boolean;
}

const List = ({
  ref,
  className,
  children,
  order,
  columns = [],
  onOrder,
  ...rest
}: ListProps) => {
  const listRef = useRef<(string | ListColumnObject)[]>([]);
  const innerRef = useRef<HTMLTableElement>(null);
  const orderable = useMemo(() => !!onOrder, [onOrder]);
  const [state, dispatch] = useReducer(mockState<ListState>, {
    columns,
    active: order?.column ?? null,
    asc: order?.asc ?? null,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    orderable,
    columns: state.columns,
    active: state.active,
    asc: state.asc,
    isJunipero: true,
  }));

  useEffect(() => {
    if (order) {
      dispatch({
        active: order.column,
        asc: order.asc,
      });
    }
  }, [order]);

  const onOrder_ = (column: number, e: MouseEvent) => {
    e?.preventDefault();

    const asc = state.asc === true ? null : state.asc === false;

    dispatch({ active: column, asc });
    onOrder?.({ column, asc });
  };

  const registerColumn = useCallback((column: string | ListColumnObject) => {
    const exists = listRef.current.find(it =>
      it === column ||
      (it as ListColumnObject)?.id === (column as ListColumnObject).id
    );

    if (exists) {
      return;
    }

    listRef.current.push(column);
    dispatch({ columns: listRef.current });
  }, []);

  const getContext = useCallback<() => ListContextType>(() => ({
    active: state.active,
    asc: state.asc,
    orderable,
    registerColumn,
  }), [
    state.active, state.asc,
    orderable,
    registerColumn,
  ]);

  const renderColumn = (column: ListColumnObject, index: number) => {
    const {
      id,
      title,
      orderable: columnOrderable,
      ...props
    } = typeof column === 'string'
      ? { id: column, title: column, orderable }
      : column;

    return (
      <th {...props} key={id ?? index}>
        { orderable && columnOrderable !== false ? (
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
};

List.displayName = 'List';

export default List;
