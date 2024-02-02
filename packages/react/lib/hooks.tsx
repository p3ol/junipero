import { useContext } from 'react';

import {
  AlertsContextType,
  AlertsContext,
  DropdownContext,
  DropdownContextType,
  FieldContextType,
  FieldControlContext,
  ListContext,
  ListContextType,
  ToastsContext,
  ToastsContextType,
  ModalContext,
  ModalContextType,
} from './contexts';

export const useFieldControl =
  () => useContext<FieldContextType>(FieldControlContext);
export const useDropdown = () =>
  useContext<DropdownContextType>(DropdownContext);
export const useAlerts = () => useContext<AlertsContextType>(AlertsContext);
export const useList = () => useContext<ListContextType>(ListContext);
export const useToasts = () => useContext<ToastsContextType>(ToastsContext);
export const useModal = () => useContext<ModalContextType>(ModalContext);

export { AlertsContext, DropdownContext, FieldControlContext, ListContext, ToastsContext, ModalContext };
