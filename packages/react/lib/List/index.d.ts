import { ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type ListRef = {
  innerRef: MutableRefObject<any>;
  orderable: boolean;
  columns: Array<any>;
  active: string|number;
  act: boolean|null;
  isJunipero: boolean;
};

declare interface ListProps extends ComponentPropsWithRef<any> {
  columns?: Array<any>;
  onOrder?: (order: { column: string|number, asc: boolean|null }) => void;
  ref?: MutableRefObject<ListRef | undefined>;
}

declare function List(props: ListProps): JSX.Element;

export default List;
