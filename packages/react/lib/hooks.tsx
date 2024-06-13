import { useContext } from 'react';

import {
  type AlertsContextType,
  type DropdownContextType,
  type FieldContextType,
  type ListContextType,
  type ToastsContextType,
  type ModalContextType,
  AlertsContext,
  DropdownContext,
  FieldControlContext,
  ListContext,
  ToastsContext,
  ModalContext,
} from './contexts';

export const useFieldControl = () =>
  useContext<FieldContextType>(FieldControlContext);
export const useDropdown = () =>
  useContext<DropdownContextType>(DropdownContext);
export const useAlerts = () => useContext<AlertsContextType>(AlertsContext);
export const useList = () => useContext<ListContextType>(ListContext);
export const useToasts = () => useContext<ToastsContextType>(ToastsContext);
export const useModal = () => useContext<ModalContextType>(ModalContext);
