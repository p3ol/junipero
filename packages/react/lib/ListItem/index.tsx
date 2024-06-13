import {
  type ComponentPropsWithRef,
  type MutableRefObject,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

import type { JuniperoRef } from '../types';

export declare interface ListItemRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLTableRowElement>;
}

export declare interface ListItemProps extends ComponentPropsWithRef<'tr'> {
  item?: Array<ReactNode | JSX.Element>;
}

const ListItem = forwardRef<ListItemRef, ListItemProps>(({
  item,
  children,
  ...rest
}, ref) => {
  const innerRef = useRef<HTMLTableRowElement>();

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
});

ListItem.displayName = 'ListItem';

export default ListItem;
