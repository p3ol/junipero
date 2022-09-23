import { useContext } from 'react';

import { FieldControlContext } from './contexts';

export const useFieldControl = () => useContext(FieldControlContext);
