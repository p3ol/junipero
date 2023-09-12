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
  } = {}) => (
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

export const slideInUpMenu = animateMenu('jp-slide-in-up-menu');
export const slideInDownMenu = animateMenu('jp-slide-in-down-menu');
export type SlideMenuType = (
  modal: any, props?: { opened?: boolean, key?: any, opts?: Array<any> }
  ) => JSX.Element;
export type AnimateModalType = (
  name: string, props?: { time?: number, key?: any, opts?: Array<any> }
  ) => SlideMenuType
export const animateModal: AnimateModalType = (
  name: string,
  { time = 300, key, ...opts }: {
    time?: number, key?: any, opts?: Array<any>
  } = {}
) =>
  (modal: any, {
    opened, key: k, ...props
  }: {
    opened?: boolean, key?: any, opts?: Array<any>
  } = {}) => (
    <Transition
      in={opened}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={time}
      name={name}
      children={modal}
      { ...opts }
      { ...props }
      key={k ?? key}
    />
  );

export const slideInUpModal = animateModal('jp-slide-in-up-modal');
export const slideInLeftModal = animateModal('jp-slide-in-left-modal');
export const appearBounceModal = animateModal('jp-appear-bounce-modal',
  { time: 200 });
