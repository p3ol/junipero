import { Key, ReactNode } from 'react';

declare function AnimationHandler(
  node: ReactNode | JSX.Element,
  opts?: {
    opened?: boolean;
    key?: Key;
    [props: string]: any;
  }
): ReactNode | JSX.Element;

export function animate(
  name: string,
  opts?: {
    time?: number;
    key?: Key;
    [props: string]: any;
  }
): typeof AnimationHandler;

export const slideInUpMenu: typeof AnimationHandler;
export const slideInDownMenu: typeof AnimationHandler;

export function animateModal(
  name: string,
  opts?: {
    time?: number;
    key?: Key;
    [props: string]: any;
  }
): typeof AnimationHandler;

export const slideInUpModal: typeof AnimationHandler;
export const slideInLeftModal: typeof AnimationHandler;
export const appearBounceModal: typeof AnimationHandler;

export const slideInUp: typeof AnimationHandler;
export const slideInDown: typeof AnimationHandler;
