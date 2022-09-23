import { act } from '@testing-library/react';

export const blur = async elmt => await act(async () => elmt.blur());
