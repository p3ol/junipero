import {
  type RefObject,
  type ReactNode,
  useImperativeHandle,
  useRef,
} from 'react';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';

export declare interface ListItemRef extends JuniperoRef {
  innerRef: RefObject<HTMLTableRowElement>;
}

export declare interface ListItemProps
  extends SpecialComponentPropsWithRef<'tr', ListItemRef> {
  item?: ReactNode[];
}

const ListItem = ({
  ref,
  item,
  children,
  ...rest
}: ListItemProps) => {
  const innerRef = useRef<HTMLTableRowElement>(null);

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <tr { ...rest } ref={innerRef}>
      { item ? item.map((it, i) => (
        <td key={i}>{ it }</td>
      )) : children }
    </tr>
  );
};

ListItem.displayName = 'ListItem';

export default ListItem;
