import { useRef } from 'react';
import { action } from 'storybook/actions';

import { useModal } from '../hooks';
import Modal, { type ModalRef } from '../Modal';
import Button from '../Button';
import ModalControl from './index';

export default { title: 'react/ModalControl' };

const Comp = () => {
  const { open } = useModal();

  return (
    <Button className="primary" onClick={open}>
      Open me
    </Button>
  );
};

export const Basic = () => {
  const modalRef = useRef<ModalRef>(null);

  return (
    <ModalControl>
      <Comp />
      <Modal ref={modalRef} onToggle={action('toggle')}>Test</Modal>
    </ModalControl>
  );
};
