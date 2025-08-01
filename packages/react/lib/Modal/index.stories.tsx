import { useRef } from 'react';
import { action } from 'storybook/actions';
import { appearBounceModal, slideInLeftModal } from '@junipero/transitions';

import Button from '../Button';
import Modal, { ModalRef } from './index';

export default { title: 'react/Modal' };

export const Basic = () => {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <Button className="primary" onClick={() => modalRef.current?.open()}>
        Open me
      </Button>
      <Modal ref={modalRef} onToggle={action('toggle')}>Test</Modal>
    </>
  );
};

export const Animated = () => {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <Button className="primary" onClick={() => modalRef.current?.open()}>
        Open me
      </Button>
      <Modal ref={modalRef} animate={appearBounceModal}>
        Test
      </Modal>
    </>
  );
};

export const Panel = () => {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <Button className="primary" onClick={() => modalRef.current?.open()}>
        Open me
      </Button>
      <Modal
        className="panel"
        ref={modalRef}
        animate={slideInLeftModal}
        onToggle={action('toggle')}
      >
        Test
      </Modal>
    </>
  );
};

export const NonClosablePanel = () => {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <Button className="primary" onClick={() => modalRef.current?.open()}>
        Open me
      </Button>
      <Modal
        closable={false}
        className="panel"
        ref={modalRef}
        onToggle={action('toggle')}
      >
        <div>Test</div>
        <div>
          <Button onClick={() => modalRef.current?.close()}>Close me</Button>
        </div>
      </Modal>
    </>
  );
};
