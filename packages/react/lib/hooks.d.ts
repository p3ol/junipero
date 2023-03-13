import { UseFloatingReturn } from '@floating-ui/react';

import { AlertObject } from './Alert';
import { ToastObject } from './Toast';

declare interface AlertsContext {
  alerts: Array<AlertObject>;
  add(alert: AlertObject): void;
  dismiss(index: number): void;
}

declare interface ToastContext {
  toasts: Array<ToastObject>;
  add(toast: ToastObject): void;
  dismiss(toast: ToastObject, index: string | number): void;
}

declare type DropdownContext = Pick<
  UseFloatingReturn,
  'x'|
  'y'|
  'reference'|
  'strategy'
> & {
  opened: boolean;
  container?: Element | DocumentFragment;
  close(): void;
  getReferenceProps: (
    userProps?: React.HTMLProps<Element> | undefined
  ) => Record<string, unknown>;
  getFloatingProps: (
    userProps?: React.HTMLProps<HTMLElement> | undefined
  ) => Record<string, unknown>;
  open(): void;
  toggle(): void;
};

declare interface FieldControlContext {
  dirty: boolean;
  focused: boolean;
  valid: boolean;
  update(props: {
    valid?: boolean;
    dirty?: boolean;
    focused?: boolean;
  }): void;
}

declare function useAlerts(): AlertsContext;

declare function useToasts(): ToastContext;

declare function useDropdown(): DropdownContext;

declare function useFieldControl(): FieldControlContext;

export { useAlerts, useToasts, useDropdown, useFieldControl };
