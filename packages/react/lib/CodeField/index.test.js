import { createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';

import CodeField from './index';

describe('<CodeField />', () => {
  it('should render', () => {
    const { container, unmount } = render(<CodeField />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should correctly fire onChange event', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(<CodeField onChange={onChange} />);

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '1' } });
    expect(onChange)
      .toHaveBeenCalledWith(expect.objectContaining({ value: '1' }));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should not fire onChange event if field is disabled', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <CodeField disabled onChange={onChange} />
    );

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '1' } });
    expect(onChange).not.toHaveBeenCalled();
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should automatically focus field when autoFocus is enabled', () => {
    const { container, unmount } = render(<CodeField autoFocus={true} />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should automatically switch field focus when changing value', () => {
    const { container, unmount } = render(<CodeField autoFocus={true} />);
    expect(container).toMatchSnapshot();
    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '1' } });
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow navigating between inputs with arrow keys', () => {
    const { container, unmount } = render(<CodeField autoFocus={true} />);

    expect(container).toMatchSnapshot();
    fireEvent.keyDown(container.querySelectorAll('input')[0],
      { key: 'ArrowRight' });

    expect(container).toMatchSnapshot();
    fireEvent.keyDown(container.querySelectorAll('input')[1],
      { key: 'ArrowRight' });

    expect(container).toMatchSnapshot();
    fireEvent.keyDown(container.querySelectorAll('input')[2],
      { key: 'ArrowLeft' });

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should erase chars & move selection when hitting backspace', () => {
    const fieldRef = createRef();
    const { container, unmount } = render(
      <CodeField ref={fieldRef} value="224" />
    );
    expect(container).toMatchSnapshot();

    fireEvent.keyDown(container.querySelectorAll('input')[3],
      { key: 'Backspace' });

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should not allow to move selection if field is disabled', () => {
    document.activeElement?.blur();
    const { container, unmount } = render(<CodeField disabled />);

    fireEvent.keyDown(container.querySelectorAll('input')[0],
      { key: 'ArrowRight' });

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should set field as invalid if validation fails', () => {
    const { container, unmount } = render(
      <CodeField onValidate={val => /^[0-9]+$/g.test(val)} />
    );

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: '1' } });

    expect(container).toMatchSnapshot();

    fireEvent.change(container.querySelectorAll('input')[0],
      { target: { value: 'a' } });

    expect(container).toMatchSnapshot();

    unmount();
  });
});
