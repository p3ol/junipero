import { ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type ListItemRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: boolean;
};

declare interface ListItemProps extends ComponentPropsWithRef<any> {
  item?: Array<any>;
  ref?: MutableRefObject<ListItemRef | undefined>;
}

declare function ListItem(props: ListItemProps): JSX.Element;

export default ListItem;
