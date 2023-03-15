import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

import { ListColumnObject } from '../ListColumn';

export declare type ListRef = {
  orderable: boolean;
  columns: Array<string | ListColumnObject>;
  active: string | number;
  asc: boolean | null;
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface ListProps extends ComponentPropsWithRef<any> {
  columns?: Array<string | ListColumnObject>;
  onOrder?(order: { column: string | number; asc: boolean | null }): void;
  ref?: MutableRefObject<ListRef | undefined>;
}

declare function List(props: ListProps): ReactNode | JSX.Element;

export default List;
