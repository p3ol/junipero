import { MutableRefObject } from 'react';
import { UseFloatingReturn } from '@floating-ui/react';

import { AlertObject } from './Alert';
import { ToastObject } from './Toast';
import { ListColumnObject } from './ListColumn';

export declare interface AlertsContext {
  alerts: Array<AlertObject>;
  add(alert: AlertObject): void;
  dismiss(index: number): void;
}

export declare interface ToastContext {
  toasts: Array<ToastObject>;
  add(toast: ToastObject): void;
  dismiss(toast: ToastObject, index: string | number): void;
}

declare interface ModalContext {
  ref: MutableRefObject<any>;
  open(): void;
  close(): void;
}

export declare interface ListContext {
  active: string | number,
  asc: boolean | null,
  orderable: boolean,
  registerColumn(column: string | ListColumnObject): void;
}

export declare type DropdownContext = Pick<
  UseFloatingReturn,
  'x'|
  'y'|
  'refs'|
  'strategy'
> & {
  opened: boolean;
  container?: string | Element | DocumentFragment;
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

export declare interface FieldControlContext {
  dirty: boolean;
  focused: boolean;
  valid: boolean;
  update(props: {
    valid?: boolean;
    dirty?: boolean;
    focused?: boolean;
  }): void;
}

export declare function useList(): ListContext;

export declare function useAlerts(): AlertsContext;

export declare function useToasts(): ToastContext;

export declare function useDropdown(): DropdownContext;

export declare function useFieldControl(): FieldControlContext;

export declare function useModal(): ModalContext;
