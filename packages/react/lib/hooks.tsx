import { useContext } from 'react';

import {
  AlertsContext,
  DropdownContext,
  FieldControlContext,
  ListContext,
  ToastsContext,
  ModalContext,
  InfiniteCanvasContext,
} from './contexts';

export const useFieldControl = () => useContext(FieldControlContext);
export const useDropdown = () => useContext(DropdownContext);
export const useAlerts = () => useContext(AlertsContext);
export const useList = () => useContext(ListContext);
export const useToasts = () => useContext(ToastsContext);
export const useModal = () => useContext(ModalContext);
export const useInfiniteCanvas = () => useContext(InfiniteCanvasContext);
