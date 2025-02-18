import { render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Toggle from '.';

describe('<Toggle />', () => {
  it('should render', () => {
    const { container, unmount } = render(<Toggle />);

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should render with children', () => {
    const { container, unmount } = render(
      <Toggle>
        label
      </Toggle>
    );

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should set disabled class if toggle is disabled', () => {
    const { container, unmount } = render(
      <Toggle disabled={true}>
        label
      </Toggle>
    );

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should handle change event', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();
    const { container, unmount } = render(
      <Toggle
        onChange={onChangeMock}
        value="my_value"
      >
        label
      </Toggle>
    );
    expect(container).toMatchSnapshot('unChecked');
    const input = container.querySelector('input');
    user.click(input);
    await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(
      { value: 'my_value', checked: true }
    ));

    expect(container).toMatchSnapshot('checked');
    unmount();
  });

  it('should handle change event with space and enter ' +
  'when focused', async () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();
    const { container, unmount } = render(
      <Toggle
        onChange={onChangeMock}
        value="my_value"
      >
        label
      </Toggle>
    );
    expect(container).toMatchSnapshot('unChecked');
    await act(async () => {
      return Promise.resolve(container.querySelector('label').focus());
    });
    user.keyboard('{ }');
    await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(
      { value: 'my_value', checked: true }
    ));

    expect(container).toMatchSnapshot('checked');
    user.keyboard('{Enter}');
    await waitFor(() => expect(onChangeMock).toHaveBeenCalledWith(
      { value: 'my_value', checked: false }
    ));

    expect(container).toMatchSnapshot('unchecked');

    unmount();
  });

  it('should not handle change if toggle is disabled', () => {
    const user = userEvent.setup();
    const onChangeMock = jest.fn();
    const { container, unmount } = render(
      <Toggle
        onChange={onChangeMock}
        disabled={true}
        value="my_value"
      >
        label
      </Toggle>
    );
    expect(container).toMatchSnapshot('unChecked');
    const input = container.querySelector('input');
    user.click(input);
    expect(onChangeMock).not.toHaveBeenCalled();
    expect(container).toMatchSnapshot('unchecked');
    unmount();
  });
});
