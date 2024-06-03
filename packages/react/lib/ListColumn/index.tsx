import {
  type ReactNode,
  type ComponentPropsWithRef,
  type MutableRefObject,
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';
import { type ForwardedProps } from '@junipero/core';
import PropTypes from 'prop-types';

import { useList } from '../hooks';

export declare interface ListColumnObject {
  id?: string | number;
  title?: ReactNode | JSX.Element;
}

export declare type ListColumnRef = {
  id: string | number;
  isJunipero: boolean;
};

export declare interface ListColumnProps extends ComponentPropsWithRef<any> {
  id: string | number;
  children?: ReactNode | JSX.Element;
  ref?: MutableRefObject<ListColumnRef | undefined>;
}

const ListColumn = forwardRef(({
  id,
  children,
  ...rest
}: ListColumnProps, ref) => {
  const { registerColumn } = useList();

  useImperativeHandle(ref, () => ({
    id,
    isJunipero: true,
  }));

  useLayoutEffect(() => {
    if (!registerColumn) {
      console?.warn?.('ListColumn must be used inside a List component');

      return;
    }

    registerColumn({ id, title: children, ...rest });
  }, []);

  return null;
}) as ForwardedProps<ListColumnProps, ListColumnRef>;

ListColumn.displayName = 'ListColumn';
ListColumn.propTypes = {
  id: PropTypes.string.isRequired,
};

export default ListColumn;
