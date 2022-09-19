import { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import ToggleField from './';

describe('<ToggleField />', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <ToggleField checkedLabel="Check this" />
    );
    expect(container.querySelectorAll('.junipero.toggle').length).toBe(1);
    unmount();
  });

  it('should be disabled', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <ToggleField checkedLabel="Check this" disabled={true} />
    );
    expect(container.querySelector('.junipero.toggle.disabled')).toBeTruthy();
    fireEvent.click(container.querySelector('input'));
    expect(onChange).toHaveBeenCalledTimes(0);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <ToggleField ref={ref} uncheckedLabel="Check this" />
    );
    expect(ref.current.innerRef).toBeDefined();
    expect(container.querySelector('.junipero.toggle'))
      .toBe(ref.current.innerRef.current);
    unmount();
  });

  it('should correctly fire onChange event', () => {
    const onChange = jest.fn();
    const { container, unmount } = render(
      <ToggleField checked={true} onChange={onChange} />
    );
    fireEvent.click(container.querySelector('input'));
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ checked: false }));
    unmount();
  });

  it('should toggle focused state on focus', async () => {
    const { container, unmount } = render(<ToggleField />);
    await act(async () => { container.querySelector('label').focus(); });
    expect(container.querySelectorAll('.junipero.toggle.focused').length)
      .toBe(1);
    await act(async () => { container.querySelector('label').blur(); });
    expect(container.querySelectorAll('.junipero.toggle.focused').length)
      .toBe(0);
    unmount();
  });

  it('should toggle checked state on enter or space hit when ' +
    'focused', async () => {
    const { container, unmount } = render(<ToggleField />);
    await act(async () => { container.querySelector('label').focus(); });
    expect(container.querySelectorAll('.junipero.toggle.focused').length)
      .toBe(1);
    fireEvent.keyPress(document.body, { key: 'Enter', charCode: 13 });
    expect(container.querySelectorAll('.junipero.toggle.checked').length)
      .toBe(1);
    fireEvent.keyPress(document.body, { key: ' ', charCode: 32 });
    expect(container.querySelectorAll('.junipero.toggle.checked').length)
      .toBe(0);
    unmount();
  });

  it('should not toggle toggle checked state on enter or space hit ' +
    'and toggle is not focused', () => {
    const { container, unmount } = render(<ToggleField />);
    expect(container.querySelectorAll('.junipero.toggle.focused').length)
      .toBe(0);
    fireEvent.keyPress(document.body, { key: 'Enter', charCode: 13 });
    expect(container.querySelectorAll('.junipero.toggle.checked').length)
      .toBe(0);
    fireEvent.keyPress(document.body, { key: ' ', charCode: 32 });
    expect(container.querySelectorAll('.junipero.toggle.checked').length)
      .toBe(0);
    unmount();
  });
});
