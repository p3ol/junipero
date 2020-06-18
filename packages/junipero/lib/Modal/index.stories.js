import React, { useRef } from 'react';
import { action } from '@storybook/addon-actions';
import { CSSTransition } from 'react-transition-group';

import Button from '../Button';
import Modal from './index';

export default { title: 'junipero/Modal' };

export const basic = () => {
  const modalRef = useRef();

  return (
    <>
      <Button onClick={() => modalRef.current?.open()}>Open me</Button>
      <Modal ref={modalRef} onToggle={action('toggle')}>Test</Modal>
    </>
  );
};

export const animated = () => {
  const modalRef = useRef();

  return (
    <>
      <Button onClick={() => modalRef.current?.open()}>Open me</Button>
      <Modal
        ref={modalRef}
        animate={(modal, { opened }) => (
          <CSSTransition
            in={opened}
            mountOnEnter={true}
            unmountOnExit={true}
            timeout={600}
            classNames="fade-in-modal"
            children={modal}
          />
        )}
      >
        Test
      </Modal>
    </>
  );
};

export const panel = () => {
  const modalRef = useRef();

  return (
    <>
      <Button onClick={() => modalRef.current?.open()}>Open me</Button>
      <Modal
        className="panel"
        ref={modalRef}
        onToggle={action('toggle')}
      >
        Test
      </Modal>
    </>
  );
};
