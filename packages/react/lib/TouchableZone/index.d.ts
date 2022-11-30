import React, { ElementType } from 'react';

declare interface TouchableZoneProps extends React.ComponentPropsWithRef<any> {
  tag?: String | ElementType;
  children?: React.ReactNode
  className?: String
}

declare function TouchableZone(props: TouchableZoneProps): JSX.Element;

export default TouchableZone;
