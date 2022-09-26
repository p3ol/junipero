import { useContext } from 'react';

import { FieldControlContext, DropdownContext } from './contexts';

export const useFieldControl = () => useContext(FieldControlContext);
export const useDropdown = () => useContext(DropdownContext);
