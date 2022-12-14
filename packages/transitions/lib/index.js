import { CSSTransition } from 'react-transition-group';

export const animateMenu = (
  name,
  { time = 100, ...opts } = {}
) =>
  (menu, { opened } = {}) => (
    <CSSTransition
      in={opened}
      appear={true}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={time}
      classNames={name}
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
  (Modal, { opened } = {}) => (
    <CSSTransition
      in={opened}
      mountOnEnter={true}
      unmountOnExit={true}
      timeout={time}
      classNames={name}
      { ...opts }
    >
      {state => (<Modal transitionState={state} />)}
    </CSSTransition>
  );

export const slideInUpModal = animateModal('jp-slide-in-up-modal');
export const slideInLeftModal = animateModal('jp-slide-in-left-modal');
export const appearBounceModal = animateModal('jp-appear-bounce-modal',
  { time: 200, appear: true });
