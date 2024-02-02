import { render, fireEvent, screen } from '@testing-library/react';

import { useModal } from '../hooks';
import Modal from '../Modal';
import ModalControl from '.';

describe('<ModalControl />', () => {
  const Comp = () => {
    const { open } = useModal();

    return (
      <a onClick={open}>
        Open me
      </a>
    );
  };

  it('should should allow to control a modal from another component', () => {
    const { container, unmount } = render(
      <div className="container">
        <ModalControl>
          <Comp />
          <Modal container=".container" />
        </ModalControl>
      </div>
    );

    expect(container).toMatchSnapshot('Closed');

    fireEvent.click(screen.getByText('Open me'));

    expect(container).toMatchSnapshot('Opened');

    unmount();
  });
});
