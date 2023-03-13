import { ReactNode, ComponentPropsWithRef, MutableRefObject } from 'react';

export declare type ToggleRef = {
  checked: boolean,
  isJunipero: boolean,
  innerRef: MutableRefObject<any>,
  inputRef: MutableRefObject<any>,
};

declare interface ToggleProps extends ComponentPropsWithRef<any> {
  checked?: boolean,
  children?: ReactNode | JSX.Element,
  className?: string,
  disabled?: boolean,
  tabIndex?: number,
  value?: any,
  onChange?(field: { value: any, checked: boolean }): void,
  ref?: MutableRefObject<ToggleRef | undefined>
}

declare function Toggle(props: ToggleProps): ReactNode | JSX.Element;

export default Toggle;
