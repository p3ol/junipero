import { useState } from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CheckboxField from '.';

describe('<CheckboxField />', () => {
  it('should render', () => {
    const { unmount, container } = render(<CheckboxField />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should add value if provided', () => {
    const { unmount, container } = render(<CheckboxField value="value" />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should set checked if provided', () => {
    const { unmount, container } = render(<CheckboxField checked={true} />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should toggle check if checkbox is clicked', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(<CheckboxField />);
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
      <CheckboxField onChange={onChangeMock} />
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
      <CheckboxField onChange={onChangeMock} disabled={true} />
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
      <CheckboxField onChange={onChangeMock} />
    );

    await act(async () => {
      container.querySelector('label').focus();
    });

    await user.keyboard('{Enter}');
    await waitFor(() => expect(onChangeMock).toHaveBeenCalled());

    unmount();
  });

  it('should trigger onChange when user hit space ' +
  'and checkbox is focused', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <CheckboxField onChange={onChangeMock} />
    );

    await act(async () => {
      container.querySelector('label').focus();
    });

    await user.keyboard('{ }');
    await waitFor(() => expect(onChangeMock).toHaveBeenCalled());

    unmount();
  });

  it('should toggle active state on click', async () => {
    const { unmount, container } = render(<CheckboxField />);

    fireEvent.mouseDown(container.querySelector('label'));

    expect(container).toMatchSnapshot('active');
    fireEvent.mouseUp(container.querySelector('label'));

    expect(container).toMatchSnapshot('inactive');
    unmount();
  });

  it('should set focused state on focus', async () => {
    const { unmount, container } = render(<CheckboxField />);

    expect(container).toMatchSnapshot('not focused');

    await act(async () => {
      container.querySelector('label').focus();
    });
    expect(container).toMatchSnapshot('focused');
    unmount();
  });

  it('should set invalid state if ' +
  'checkbox is invalid and required', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(<CheckboxField required={true} />);
    const input = container.querySelector('input');

    await user.click(input);
    expect(container).toMatchSnapshot('valid');
    await user.click(input);

    expect(container).toMatchSnapshot('invalid');
    unmount();
  });

  it('should set invalid state following ' +
  'custom onValidate function if provided', async () => {
    const user = userEvent.setup();

    const customValidateMock = jest.fn().mockImplementation(
      (val, { dirty }) => !val && dirty
    );
    const { unmount, container } = render(
      <CheckboxField onValidate={customValidateMock} required={true} />
    );
    const input = container.querySelector('input');

    await user.click(input);
    expect(container).toMatchSnapshot('invalid');
    expect(customValidateMock).toHaveBeenCalledWith(
      true, { dirty: true, required: true }
    );

    await user.click(input);
    expect(container).toMatchSnapshot('valid');
    unmount();
  });

  it('should allow to render a controller checkbox', async () => {
    const user = userEvent.setup();
    const handler = jest.fn();

    const ControlledField = () => {
      const [checked, setChecked] = useState(false);

      return (
        <>
          <button onClick={() => setChecked(c => !c)}>Toggle</button>
          <CheckboxField
            checked={checked}
            value="test"
            onChange={field => {
              setChecked(field.checked);
              handler(field);
            }}
          >
            Check this
          </CheckboxField>
        </>
      );
    };

    const { unmount, container } = render(<ControlledField />);
    expect(container).toMatchSnapshot('unchecked');

    await user.click(container.querySelector('button'));
    expect(container).toMatchSnapshot('checked');
    expect(handler).not.toHaveBeenCalled();

    unmount();
  });
});
