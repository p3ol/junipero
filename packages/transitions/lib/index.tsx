import type { ReactNode } from 'react';
import { Transition } from '@junipero/react';

export const animateMenu = (
  name: string,
  {
    time = 100, key, ...opts
  }: {
    time?: number, key?: any, opts?: Array<any>
  } = {}
) =>
  (menu: string, {
    opened, key: k, ...props
  }: {
    opened?: boolean, key?: any, opts?: Array<any>
  } = {}): JSX.Element => (
    <Transition
      in={opened}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={time}
      name={name}
      children={menu}
      { ...opts }
      { ...props }
      key={k ?? key}
    />
  );
export type SlideMenuType = (
  modal: any, props?: { opened?: boolean, key?: any, opts?: Array<any> }
  ) => JSX.Element;
export type AnimateModalType = (
  name: string, props?: { time?: number, key?: any, opts?: Array<any> }
  ) => SlideMenuType

export const animate = (
  name: string,
  { time = 100, key, ...opts }: {
    time?: number, opened?: boolean, key?: any, opts?: Array<any>
  } = {}
) => (
  menu: JSX.Element | ReactNode | string,
  {
    opened,
    key: k,
    ...props
  }: {
    opened?: boolean,
    key?: any,
    opts?: Array<any>
  } = {}
): JSX.Element => (
  <Transition
    in={opened}
    mountOnEnter={true}
    unmountOnExit={true}
    timeout={time}
    name={name}
    children={menu}
    { ...opts }
    { ...props }
    key={k ?? key}
  />
);

export const slideInUpMenu = animate('jp-slide-in-up-menu');
export const slideInDownMenu = animate('jp-slide-in-down-menu');

export const animateModal: AnimateModalType = (
  name,
  { time = 300, ...opts } = {}
) => animate(name, { time, ...opts });

export const slideInUpModal = animateModal('jp-slide-in-up-modal');
export const slideInLeftModal = animateModal('jp-slide-in-left-modal');
export const appearBounceModal = animateModal('jp-appear-bounce-modal',
  { time: 200 });

export const slideInUp = animate('jp-slide-in-up', { time: 200 });
export const slideInDown = animate('jp-slide-in-down', { time: 200 });
