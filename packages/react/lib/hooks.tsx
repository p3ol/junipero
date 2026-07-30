import { use } from 'react';

import {
  AlertsContext,
  DropdownContext,
  FieldControlContext,
  ListContext,
  ToastsContext,
  ModalContext,
  InfiniteCanvasContext,
} from './contexts';

export const useFieldControl = () => use(FieldControlContext);
export const useDropdown = () => use(DropdownContext);
export const useAlerts = () => use(AlertsContext);
export const useList = () => use(ListContext);
export const useToasts = () => use(ToastsContext);
export const useModal = () => use(ModalContext);
export const useInfiniteCanvas = () => use(InfiniteCanvasContext);
