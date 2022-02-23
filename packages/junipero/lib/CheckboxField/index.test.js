import { createRef } from 'react';
import { render, fireEvent } from '@testing-library/react';

import CheckboxField from './';

describe('<CheckboxField />', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <CheckboxField>Check this</CheckboxField>
    );
    expect(container.querySelectorAll('.junipero.checkbox').length).toBe(1);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <CheckboxField ref={ref}>Check this</CheckboxField>
    );
    expect(ref.current.innerRef).toBeDefined();
    expect(container.querySelector('.junipero.checkbox'))
      .toBe(ref.current.innerRef.current);
    unmount();
  });

  it('should correctly fire onChange event', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <CheckboxField onChange={onChange} />
    );
    fireEvent.click(container.querySelector('input'));
    expect(onChange)
      .toHaveBeenCalledWith(expect.objectContaining({ checked: true }));
    unmount();
  });

  it('should toggle checkbox active state on click', () => {
    const { container, unmount } = render(<CheckboxField />);

    fireEvent.mouseDown(container.querySelector('label'));
    expect(container.querySelectorAll('.junipero.checkbox.active').length)
      .toBe(1);

    fireEvent.mouseUp(container.querySelector('label'));
    expect(container.querySelectorAll('.junipero.checkbox.active').length)
      .toBe(0);

    unmount();
  });

  it('should toggle checkbox focused state on focus', () => {
    const { container, unmount } = render(<CheckboxField />);

    container.querySelector('label').focus();
    expect(container.querySelectorAll('.junipero.checkbox.focused').length)
      .toBe(1);

    container.querySelector('label').blur();
    expect(container.querySelectorAll('.junipero.checkbox.focused').length)
      .toBe(0);

    unmount();
  });

  it('should toggle checkbox checked state on enter or space hit ' +
    'when focused', () => {
    const { container, unmount } = render(<CheckboxField />);

    container.querySelector('label').focus();
    expect(container.querySelectorAll('.junipero.checkbox.focused').length)
      .toBe(1);

    fireEvent.keyPress(globalThis, { key: 'Enter' });
    expect(container.querySelectorAll('.junipero.checkbox.checked').length)
      .toBe(1);

    fireEvent.keyPress(globalThis, { key: ' ' });
    expect(container.querySelectorAll('.junipero.checkbox.checked').length)
      .toBe(0);

    unmount();
  });

  it('should not toggle checkbox checked state on enter or space hit ' +
    'and checkbox is not focused', () => {
    const { container, unmount } = render(<CheckboxField />);

    expect(container.querySelectorAll('.junipero.checkbox.focused').length)
      .toBe(0);

    fireEvent.keyPress(globalThis, { key: 'Enter' });
    expect(container.querySelectorAll('.junipero.checkbox.checked').length)
      .toBe(0);

    fireEvent.keyPress(globalThis, { key: ' ' });
    expect(container.querySelectorAll('.junipero.checkbox.checked').length)
      .toBe(0);

    unmount();
  });
});
