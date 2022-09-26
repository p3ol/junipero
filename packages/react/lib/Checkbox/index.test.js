import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Checkbox from '.';

describe('<Checkbox />', () => {
  it('should render', () => {
    const { unmount, container } = render(<Checkbox />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should add value if provided', () => {
    const { unmount, container } = render(<Checkbox value="value" />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should set checked if provided', () => {
    const { unmount, container } = render(<Checkbox checked={true} />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should toggle check if checkbox is clicked', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(<Checkbox />);
    const input = container.querySelector('input');

    await user.click(input);

    expect(container).toMatchSnapshot('checked');

    await user.click(input);

    expect(container).toMatchSnapshot('unchecked');
    unmount();
  });

  it('should trigger onChange event when user click on checkbox', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <Checkbox onChange={onChangeMock} />
    );
    const input = container.querySelector('input');
    await user.click(input);
    await waitFor(() => expect(onChangeMock).toHaveBeenCalled());

    unmount();
  });

  it('should not trigger event and change state if user click but ' +
  'checkbox is disabled', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <Checkbox onChange={onChangeMock} disabled={true} />
    );
    const input = container.querySelector('input');
    await user.click(input);
    await waitFor(() => expect(onChangeMock).not.toHaveBeenCalled());
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should trigger onChange when user hit enter ' +
  'and checkbox is focused', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <Checkbox onChange={onChangeMock} />
    );

    await act(async () => {
      container.querySelector('label').focus();
    });
    await waitFor(() =>
      expect(container.querySelector('label').className).toContain('focused')
    );
    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChangeMock).toHaveBeenCalled());

    unmount();
  });

  it('should trigger onChange when user hit space ' +
  'and checkbox is focused', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <Checkbox onChange={onChangeMock} />
    );

    await act(async () => {
      container.querySelector('label').focus();
    });
    await waitFor(() =>
      expect(container.querySelector('label').className).toContain('focused')
    );
    await user.keyboard('{ }');
    await waitFor(() => expect(onChangeMock).toHaveBeenCalled());

    unmount();
  });

  it('should toggle active state on click', async () => {
    const { unmount, container } = render(<Checkbox />);

    fireEvent.mouseDown(container.querySelector('label'));

    expect(container).toMatchSnapshot('active');
    fireEvent.mouseUp(container.querySelector('label'));

    expect(container).toMatchSnapshot('inactive');
    unmount();
  });

  it('should set focused state on focus', async () => {
    const { unmount, container } = render(<Checkbox />);

    expect(container).toMatchSnapshot('not focused');

    await act(async () => {
      container.querySelector('label').focus();
    });
    expect(container).toMatchSnapshot('focused');
    unmount();
  });
});
