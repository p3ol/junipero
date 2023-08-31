import { ComponentPropsWithRef, MutableRefObject, forwardRef, useImperativeHandle, useRef } from 'react';

import { ForwardedProps } from '../utils';

export declare type ListCellRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface ListCellProps extends ComponentPropsWithRef<any> {
  ref?: MutableRefObject<ListCellRef | undefined>;
}

const ListCell = forwardRef(({
  ...rest
}: ListCellProps, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <td { ...rest } ref={innerRef} />
  );
}) as ForwardedProps<ListCellProps, ListCellRef>;

ListCell.displayName = 'ListCell';

export default ListCell;
