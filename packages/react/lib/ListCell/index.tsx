import {
  ComponentPropsWithRef,
  MutableRefObject,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { type ForwardedProps } from '@junipero/core';

export declare type ListCellRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface ListCellProps extends ComponentPropsWithRef<any> {
  ref?: MutableRefObject<ListCellRef | undefined>;
}

const ListCell = forwardRef((props: ListCellProps, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <td { ...props } ref={innerRef} />
  );
}) as ForwardedProps<ListCellProps, ListCellRef>;

ListCell.displayName = 'ListCell';

export default ListCell;
