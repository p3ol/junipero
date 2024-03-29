import { ReactNode, MutableRefObject, ComponentPropsWithRef } from 'react';
import { UseDismissProps } from '@floating-ui/react';

export declare type ColorFieldRef = {
  dirty: boolean;
  isJunipero: boolean;
  valid: boolean;
  value: string;
  blur(): void;
  close(): void;
  focus(): void;
  open(): void;
  reset(): void;
  toggle(): void;
  colorAlphaRef: MutableRefObject<any>;
  colorHueRef: MutableRefObject<any>;
  colorLightnessRef: MutableRefObject<any>;
  innerRef: MutableRefObject<any>;
  textFieldRef: MutableRefObject<any>;
};

export declare interface ColorFieldProps extends ComponentPropsWithRef<any> {
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  format?: 'auto' | 'hex' | 'rgb' | 'rgba' | 'hsla';
  globalEventsTarget?: EventTarget;
  id?: string;
  name?: string;
  opened?: boolean;
  placeholder?: string;
  required?: boolean;
  tabIndex?: number;
  trigger?: 'click' | 'hover' | 'manual' | 'focus';
  valid?: boolean;
  value?: string;
  animateMenu?(
    menu: ReactNode | JSX.Element,
    opts: { opened: boolean }
  ): ReactNode | JSX.Element;
  onBlur?(e: Event): void;
  onChange?(props: { value: string; valid: boolean }): void;
  onFocus?(e: Event): void;
  onToggle?({ opened }: { opened: boolean }): void;
  onValidate?(
    value: string,
    { dirty, required }: { dirty?: boolean; required?: boolean }
  ): boolean;
  ref?: MutableRefObject<ColorFieldRef | undefined>;
}

declare function ColorField(props: ColorFieldProps): ReactNode | JSX.Element;

export default ColorField;
