import {
  type ReactNode,
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';

import type {
  ForwardedProps,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import { useList } from '../hooks';

export declare interface ListColumnObject {
  id?: string | number;
  title?: ReactNode | JSX.Element;
}

export declare interface ListColumnRef extends JuniperoRef {
  id: string | number;
}

export declare interface ListColumnProps extends SpecialComponentPropsWithRef {
  id: string | number;
}

const ListColumn = forwardRef<ListColumnRef, ListColumnProps>(({
  id,
  children,
  ...rest
}, ref) => {
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
}) as ForwardedProps<ListColumnRef, ListColumnProps>;

ListColumn.displayName = 'ListColumn';

export default ListColumn;
