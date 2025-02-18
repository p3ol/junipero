import type { ExtendedRefs, Strategy } from '@floating-ui/react';
import { type Dispatch, type ReactElement, createContext } from 'react';

import type { AlertObject } from './Alert';
import type { ToastObject } from './Toast';
import type { ListColumnObject } from './ListColumn';
import type { ModalRef } from './Modal';

export interface AlertsContextType {
  alerts?: AlertObject[];
  add?: (alert: AlertObject) => void;
  dismiss?: (alert: AlertObject) => void;
}

export interface DropdownContextType {
  opened?: boolean;
  visible?: boolean;
  container?: string | ReactElement | DocumentFragment | HTMLElement;
  x?: number;
  y?: number;
  refs?: ExtendedRefs<any>;
  strategy?: Strategy;
  toggle?: () => void;
  open?: () => void;
  close?: () => void;
  getReferenceProps?: (
    userProps?: React.HTMLProps<Element>
  ) => Record<string, unknown>;
  getFloatingProps?: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>;
  onAnimationExit?: () => void;
}

export interface ListContextType {
  active?: string | number;
  asc?: boolean;
  orderable?: boolean;
  registerColumn?: (column: string | ListColumnObject) => void;
}

export interface FieldContextType {
  valid?: boolean;
  dirty?: boolean;
  focused?: boolean;
  update?: Dispatch<any>;
}

export interface ToastsContextType {
  toasts?: ToastObject[];
  add?: (toas: ToastObject) => void;
  dismiss?: (toast: ToastObject) => void;
}
export declare interface ModalContextType {
  open?(): void;
  close?(): void;
  toggle?: any;
  setRef?: (ref: ModalRef) => void;
}

export const AlertsContext = createContext<AlertsContextType>({});
export const DropdownContext = createContext<DropdownContextType>({});
export const FieldControlContext = createContext<FieldContextType>({});
export const ListContext = createContext<ListContextType>({});
export const ToastsContext = createContext<ToastsContextType>({});
export const ModalContext = createContext<ModalContextType>({});
