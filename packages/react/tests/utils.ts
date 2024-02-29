import { act } from '@testing-library/react';
import { ReactNode } from 'react';

import { SelectFieldRef, TextFieldRef } from '../lib';

export const focus = async (
  elmt: HTMLElement
) => await act(async () => elmt.focus());

export const blur = async (
  elmt: SelectFieldRef | HTMLInputElement
) => await act(async () => elmt.blur());

export const reset = async (
  elmt: HTMLFormElement | TextFieldRef | SelectFieldRef
) => await act(async () => elmt.reset());

export const sleep = async (ms: number): Promise<any> => await act(async () =>
  new Promise(resolve => setTimeout(resolve, ms))
);
