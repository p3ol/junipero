import { ComponentPropsWithRef, MutableRefObject, ReactNode } from 'react';

export declare type ListColumnRef = {
  id: string | number;
  isJunipero: boolean;
};

declare interface ListColumnProps extends ComponentPropsWithRef<any> {
  id: string | number;
  children?: ReactNode | JSX.Element;
  ref?: MutableRefObject<ListColumnRef | undefined>;
}

declare function ListColumn(props: ListColumnProps): ReactNode | JSX.Element;

export default ListColumn;
