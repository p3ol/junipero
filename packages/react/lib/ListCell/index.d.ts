import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type ListCellRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

export declare interface ListCellProps extends ComponentPropsWithRef<any> {
  ref?: MutableRefObject<ListCellRef | undefined>;
}

declare function ListCell(props: ListCellProps): ReactNode | JSX.Element;

export default ListCell;
