import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type ListItemRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface ListItemProps extends ComponentPropsWithRef<any> {
  item?: Array<any>;
  children?: ReactNode | JSX.Element;
  ref?: MutableRefObject<ListItemRef | undefined>;
}

declare function ListItem(props: ListItemProps): ReactNode | JSX.Element;

export default ListItem;
