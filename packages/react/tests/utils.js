import { act } from '@testing-library/react';

export const focus = async elmt => await act(async () => elmt.focus());

export const blur = async elmt => await act(async () => elmt.blur());

export const reset = async elmt => await act(async () => elmt.reset());

export const sleep = async ms => await act(async () =>
  new Promise(resolve => setTimeout(resolve, ms))
);
