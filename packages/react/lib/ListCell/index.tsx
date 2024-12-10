import {
  type RefObject,
  useImperativeHandle,
  useRef,
} from 'react';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';

export declare interface ListCellRef extends JuniperoRef {
  innerRef: RefObject<HTMLTableCellElement>;
}

export declare interface ListCellProps
  extends SpecialComponentPropsWithRef<'td', ListCellRef> {}

const ListCell = ({
  ref,
  ...rest
}: ListCellProps) => {
  const innerRef = useRef<HTMLTableCellElement>(null);

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <td { ...rest } ref={innerRef} />
  );
};

ListCell.displayName = 'ListCell';

export default ListCell;
