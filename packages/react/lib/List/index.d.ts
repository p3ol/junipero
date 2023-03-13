import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type ListRef = {
  orderable: boolean;
  columns: Array<any>;
  active: string | number;
  asc: boolean | null;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface ListProps extends ComponentPropsWithRef<any> {
  columns?: Array<any>;
  onOrder?(order: { column: string | number, asc: boolean | null }): void;
  ref?: MutableRefObject<ListRef | undefined>;
}

declare function List(props: ListProps): ReactNode | JSX.Element;

export default List;
