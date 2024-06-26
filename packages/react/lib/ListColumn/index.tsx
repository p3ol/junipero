import {
  type ReactNode,
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';

import type {
  ForwardedProps,
  JuniperoRef,
  SpecialComponentPropsWithoutRef,
} from '../types';
import { useList } from '../hooks';

export declare interface ListColumnObject {
  id?: string | number;
  title?: ReactNode | JSX.Element;
  orderable?: boolean;
}

export declare interface ListColumnRef extends JuniperoRef {
  id: string | number;
}

export declare interface ListColumnProps
  extends SpecialComponentPropsWithoutRef {
  id: string | number;
}

const ListColumn = forwardRef<ListColumnRef, ListColumnProps>(({
  id,
  children,
  orderable = true,
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

    registerColumn({ id, title: children, orderable, ...rest });
  }, []);

  return null;
}) as ForwardedProps<ListColumnRef, ListColumnProps>;

ListColumn.displayName = 'ListColumn';

export default ListColumn;
