import { Transition } from '@junipero/react';

export const animateMenu = (
  name,
  { time = 100, key, ...opts } = {}
) =>
  (menu, { opened, key: k, ...props } = {}) => (
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

export const animateModal = (
  name,
  { time = 300, key, ...opts } = {}
) =>
  (modal, { opened, key: k, ...props } = {}) => (
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
