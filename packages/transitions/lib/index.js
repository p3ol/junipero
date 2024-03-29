import { Transition } from '@junipero/react';

export const animate = (
  name,
  { time = 100, key, ...opts } = {}
) => (menu, { opened, key: k, ...props } = {}) => (
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

export const animateModal = (
  name,
  { time = 300, ...opts } = {}
) => animate(name, { time, ...opts });

export const slideInUpModal = animateModal('jp-slide-in-up-modal');
export const slideInLeftModal = animateModal('jp-slide-in-left-modal');
export const appearBounceModal = animateModal('jp-appear-bounce-modal',
  { time: 200 });

export const slideInUp = animate('jp-slide-in-up', { time: 200 });
export const slideInDown = animate('jp-slide-in-down', { time: 200 });
