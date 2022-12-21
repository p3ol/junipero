import { ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type ListCellRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: boolean;
};

declare interface ListCellProps extends ComponentPropsWithRef<any> {
  ref?: MutableRefObject<ListCellRef | undefined>;
}

declare function ListCell(props: ListCellProps): JSX.Element;

export default ListCell;
