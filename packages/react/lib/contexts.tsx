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

export const AlertsContext = createContext<AlertsContextType>({});

export interface DropdownContextType {
  opened?: boolean;
  visible?: boolean;
  highlightedOptionId?: string | null;
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
  setHighlightedOptionId?: (id: string) => void;
}

export const DropdownContext = createContext<DropdownContextType>({});

export interface ListContextType {
  active?: string | number;
  asc?: boolean;
  orderable?: boolean;
  registerColumn?: (column: string | ListColumnObject) => void;
}

export const ListContext = createContext<ListContextType>({});

export interface FieldContextType {
  valid?: boolean;
  dirty?: boolean;
  focused?: boolean;
  update?: Dispatch<any>;
}

export const FieldControlContext = createContext<FieldContextType>({});

export interface ToastsContextType {
  toasts?: ToastObject[];
  add?: (toas: ToastObject) => void;
  dismiss?: (toast: ToastObject) => void;
}

export const ToastsContext = createContext<ToastsContextType>({});

export declare interface ModalContextType {
  open?(): void;
  close?(): void;
  toggle?(): void;
  setRef?: (ref: ModalRef) => void;
}

export const ModalContext = createContext<ModalContextType>({});

export declare interface AccessibilityContextType {
  currentlyFocusedElement?: string,
  elements?: string[];
  toggleId?: string;
  setCurrentlyFocusedElement?: (element: string | number) => void;
  registerElement?: (id: string | string[]) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

export const AccessibilityContext = createContext<AccessibilityContextType>({});

export declare interface InfiniteCanvasContext {
  zoom: number;
  offsetX: number;
  offsetY: number;
  fitIntoView: (transitionDuration?: number) => void;
  setZoom: (newZoom: number, transitionDuration?: number) => void;
  zoomIn: (transitionDuration?: number) => void;
  zoomOut: (transitionDuration?: number) => void;
}

export const InfiniteCanvasContext = createContext<InfiniteCanvasContext>({
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  fitIntoView: () => {},
  setZoom: () => {},
  zoomIn: () => {},
  zoomOut: () => {},
});

