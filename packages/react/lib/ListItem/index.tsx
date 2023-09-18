import {
  ComponentPropsWithRef,
  MutableRefObject,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import { ForwardedProps } from '../utils';

export declare type ListItemRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface ListItemProps extends ComponentPropsWithRef<any> {
  item?: Array<ReactNode | JSX.Element>;
  children?: ReactNode | JSX.Element;
  ref?: MutableRefObject<ListItemRef | undefined>;
}

const ListItem = forwardRef(({
  item,
  children,
  ...rest
}: ListItemProps, ref) => {
  const innerRef = useRef();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  return (
    <tr { ...rest } ref={innerRef}>
      { item ? item.map((it, i) => (
        <td key={i}>{ it }</td>
      )) : children }
    </tr>
  );
}) as ForwardedProps<ListItemProps, ListItemRef>;

ListItem.displayName = 'ListItem';
ListItem.propTypes = {
  item: PropTypes.array,
};

export default ListItem;
