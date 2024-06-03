import type { ForwardRefExoticComponent } from 'react';

export declare interface ForwardedProps<T, P>
  extends ForwardRefExoticComponent<T & React.RefAttributes<P>> {}

export declare type MockState<T> = (state: T, action: any) => T;
