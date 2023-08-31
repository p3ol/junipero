import { Dispatch, createContext } from 'react';
import { ExtendedRefs, Strategy } from '@floating-ui/react';

import { AlertObject } from './Alert';
import { ToastObject } from './Toast';
import { ListColumnObject } from './ListColumn';

export type AlertsContextType = {
  alerts?: Array<AlertObject>;
  add?: (alert: AlertObject) => void;
  dismiss?: (alert: AlertObject) => void;
}

export type DropdownContextType = {
  opened?: boolean,
  visible?: boolean,
  container?: string | Element | DocumentFragment,
  x?: number,
  y?: number,
  refs?: ExtendedRefs<any>,
  strategy?: Strategy,
  toggle?: () => void,
  open?: () => void,
  close?: () => void,
  getReferenceProps?: (
    userProps?: React.HTMLProps<Element>
  ) => Record<string, unknown>,
  getFloatingProps?: (
    userProps?: React.HTMLProps<HTMLElement>
  ) => Record<string, unknown>,
  onAnimationExit?: () => void,
}

export type ListContextType= {
  active?: boolean,
  asc?: boolean,
  orderable?: boolean,
  registerColumn?: (column: string | ListColumnObject) => void
}

export type FieldContextType = {
  valid?: boolean,
  dirty?: boolean,
  focused?: boolean,
  update?: Dispatch<any>,
}

export type ToastsContextType = {
  toasts?: Array<ToastObject>,
  add?: (toas: ToastObject) => void,
  dismiss?: (toast: ToastObject) => void,
}

export const AlertsContext = createContext<AlertsContextType>({});
export const DropdownContext = createContext<DropdownContextType>({});
export const FieldControlContext = createContext<FieldContextType>({});
export const ListContext = createContext<ListContextType>({});
export const ToastsContext = createContext<ToastsContextType>({});
