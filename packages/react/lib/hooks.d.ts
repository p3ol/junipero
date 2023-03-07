import { UseFloatingReturn } from '@floating-ui/react';

import { AlertObject } from './Alert';
import { ToastObject } from './Toast';

declare interface AlertsContext {
  alerts: Array<AlertObject>;
  add: (alert: AlertObject) => void;
  dismiss: (index: number) => void;
}

declare interface ToastContext {
  toasts: Array<ToastObject>;
  add: (toast: ToastObject) => void;
  dismiss: (toast: ToastObject, index: string|number) => void;
}

declare type DropdownContext = Pick<
  UseFloatingReturn,
  'x'|
  'y'|
  'reference'|
  'strategy'
> & {
  opened: boolean;
  container?: String | React.ReactNode;
  toggle: () => void;
  open: () => void;
  close: () => void;
  getReferenceProps: (
    userProps?: React.HTMLProps<Element> | undefined
  ) => Record<string, unknown>;
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>;
};

declare interface FieldControlContext {
  valid: Boolean;
  dirty: Boolean;
  focused: Boolean;
  update: (props: {
    valid?: Boolean;
    dirty?: Boolean;
    focused?: Boolean;
  }) => void;
}

declare function useAlerts(): AlertsContext;

declare function useToasts(): ToastContext;

declare function useDropdown(): DropdownContext;

declare function useFieldControl(): FieldControlContext;

export { useAlerts, useToasts, useDropdown, useFieldControl };
