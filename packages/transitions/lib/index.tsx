import type { Key, ReactNode } from 'react';
import { type TransitionProps, Transition } from '@junipero/react';

export declare interface AnimateMenuOptions extends Partial<TransitionProps> {
  time?: number;
  key?: Key;
}

export const animateMenu = (
  name: string,
  { time = 100, key, ...opts }: AnimateMenuOptions = {}
) => (
  menu: ReactNode,
  { opened, key: k, ...props }: {
    opened?: boolean;
    key?: Key;
  } & Partial<TransitionProps> = {}
) => (
  <Transition
    in={opened}
    mountOnEnter={true}
    unmountOnExit={true}
    timeout={time}
    name={name}
    { ...opts }
    { ...props }
    key={k ?? key}
  >
    { menu }
  </Transition>
);

export declare interface AnimateOptions extends Partial<TransitionProps> {
  time?: number;
  key?: Key;
}

export const animate = (
  name: string,
  { time = 100, key, ...opts }: AnimateOptions = {}
) => (
  menu: ReactNode,
  { opened, key: k, ...props }: {
    opened?: boolean;
    key?: Key;
  } & Partial<TransitionProps> = {}
) => (
  <Transition
    in={opened}
    mountOnEnter={true}
    unmountOnExit={true}
    timeout={time}
    name={name}
    { ...opts }
    { ...props }
    key={k ?? key}
  >
    { menu }
  </Transition>
);

export const slideInUpMenu = animate('jp-slide-in-up-menu');
export const slideInDownMenu = animate('jp-slide-in-down-menu');

export interface AnimateModalOptions {
  time?: number;
  key?: Key;
  opts?: Partial<TransitionProps>;
}

export const animateModal = (
  name: string,
  { time = 300, ...opts } = {}
) => animate(name, { time, ...opts });

export const slideInUpModal = animateModal('jp-slide-in-up-modal');
export const slideInLeftModal = animateModal('jp-slide-in-left-modal');
export const appearBounceModal = animateModal('jp-appear-bounce-modal',
  { time: 200 });

export const slideInUp = animate('jp-slide-in-up', { time: 200 });
export const slideInDown = animate('jp-slide-in-down', { time: 200 });
