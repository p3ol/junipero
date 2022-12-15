import { Transition } from '@junipero/react';

export const animateMenu = (
  name,
  { time = 100, ...opts } = {}
) =>
  (menu, { opened } = {}) => (
    <Transition
      in={opened}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={time}
      name={name}
      children={menu}
      { ...opts }
    />
  );

export const slideInUpMenu = animateMenu('jp-slide-in-up-menu');
export const slideInDownMenu = animateMenu('jp-slide-in-down-menu');

export const animateModal = (
  name,
  { time = 300, ...opts } = {}
) =>
  (modal, { opened } = {}) => (
    <Transition
      in={opened}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={time}
      name={name}
      children={modal}
      { ...opts }
    />
  );

export const slideInUpModal = animateModal('jp-slide-in-up-modal');
export const slideInLeftModal = animateModal('jp-slide-in-left-modal');
export const appearBounceModal = animateModal('jp-appear-bounce-modal',
  { time: 200 });
