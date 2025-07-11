import {
  type ReactNode,
  useLayoutEffect,
  useImperativeHandle,
} from 'react';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import { useList } from '../hooks';

export declare interface ListColumnObject {
  id?: string | number;
  title?: ReactNode;
  orderable?: boolean;
}

export declare interface ListColumnRef extends JuniperoRef {
  id: string | number;
}

export declare interface ListColumnProps
  extends SpecialComponentPropsWithRef<any, ListColumnRef> {
  id: string | number;
}

const ListColumn = ({
  ref,
  id,
  children,
  orderable = true,
  ...rest
}: ListColumnProps): ReactNode => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

ListColumn.displayName = 'ListColumn';

export default ListColumn;
