import {
  type ComponentPropsWithRef,
  type MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

import type { JuniperoRef } from '../types';

export declare interface ListCellRef extends JuniperoRef {
  innerRef: MutableRefObject<HTMLTableCellElement>;
}

export declare interface ListCellProps extends ComponentPropsWithRef<'td'> {}

const ListCell = forwardRef<ListCellRef, ListCellProps>((props, ref) => {
  const innerRef = useRef<HTMLTableCellElement>();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <td { ...props } ref={innerRef} />
  );
});

ListCell.displayName = 'ListCell';

export default ListCell;
