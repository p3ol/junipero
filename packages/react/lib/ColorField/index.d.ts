import {
  Props as dismissProps,
} from '@floating-ui/react/src/hooks/useDismiss';
import React, { MutableRefObject } from 'react';

export declare type ColorFieldRef = {
  innerRef: MutableRefObject<any>;
  textFieldRef: MutableRefObject<any>;
  colorLightnessRef: MutableRefObject<any>;
  colorHueRef: MutableRefObject<any>;
  colorAlphaRef: MutableRefObject<any>;
  valid: Boolean;
  value: String;
  dirty: Boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  focus: () => void;
  blur: () => void;
  reset: () => void;
  isJunipero: Boolean;
};

declare interface ColorFieldProps extends React.ComponentPropsWithRef<any> {
  animateMenu: (menu: JSX.Element, opts: { opened: Boolean }) => JSX.Element;
  className?: String;
  dismissOptions?: dismissProps;
  globalEventsTarget: EventTarget;
  id?: String;
  name?: String;
  placeholder?: String;
  tabIndex?: number;
  trigger?: 'click' | 'hover' | 'manual' | 'focus';
  vamlid?: Boolean;
  value?: String;
  autoFocus?: Boolean;
  disabled?: Boolean;
  format: 'auto' | 'hex' | 'rgb' | 'rgba' | 'hsla';
  required: Boolean;
  onFocus?: (e: Event) => any;
  onBlur?: (e: Event) => any;
  onChange?: (props: { value: String; valid: Boolean }) => void;
  onToggle?: ({ opened }: { opened: Boolean }) => void;
  onValidate?: (
    value: String,
    { dirty, required }: { dirty?: Boolean; required?: Boolean }
  ) => Boolean;
  ref?: MutableRefObject<ColorFieldRef | undefined>;
}

declare function ColorField(props: ColorFieldProps): JSX.Element;

export default ColorField;
