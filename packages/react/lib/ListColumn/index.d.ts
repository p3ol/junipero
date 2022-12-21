import { ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type ListColumnRef = {
  id: string|number;
  isJunipero: boolean;
};

declare interface ListColumnProps extends ComponentPropsWithRef<any> {
  id?: string|number;
  ref?: MutableRefObject<ListColumnRef | undefined>;
}

declare function ListColumn(props: ListColumnProps): JSX.Element;

export default ListColumn;
