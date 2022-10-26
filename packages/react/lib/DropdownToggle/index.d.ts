import React, { MutableRefObject } from 'react';

export declare type DropdownToggleRef = {
  innerRef: MutableRefObject<any>;
  isJunipero: Boolean;
};

declare interface DropdownToggleProps extends React.ComponentPropsWithRef<any> {
  children?: React.ReactNode;
  ref?: MutableRefObject<DropdownToggleRef | undefined>;
}

declare function DropdownToggle(props: DropdownToggleProps): JSX.Element;

export default DropdownToggle;
