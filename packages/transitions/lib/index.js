import { CSSTransition } from 'react-transition-group';

export const animateMenu = (
  name,
  { time = 100, ...opts } = {}
) =>
  (menu, { opened }) => (
    <CSSTransition
      in={opened}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={time}
      classNames={name}
      children={menu}
      { ...opts }
    />
  );

export const slideInUpMenu = animateMenu('slide-in-up-menu');
export const slideInDownMenu = animateMenu('slide-in-down-menu');

export const animateModal = (
  name,
  { time = 300, ...opts } = {}
) =>
  (modal, { opened }) => (
    <CSSTransition
      in={opened}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={time}
      classNames={name}
      children={modal}
      { ...opts }
    />
  );

export const slideInUpModal = animateModal('slide-in-up-modal', { time: 300 });
export const slideInLeftModal = animateModal('slide-in-left-modal');
export const appearBounceModal = animateModal('appear-bounce-modal',
  { time: 200, appear: true });
