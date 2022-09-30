import { useContext } from 'react';

import {
  AlertsContext,
  DropdownContext,
  FieldControlContext,
} from './contexts';

export const useFieldControl = () => useContext(FieldControlContext);
export const useDropdown = () => useContext(DropdownContext);
export const useAlerts = () => useContext(AlertsContext);
