import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RadioField from '.';

describe('<RadioField />', () => {
  it('should render', () => {
    const { unmount, container } = render(<RadioField />);
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should render as many options as provided', () => {
    const { unmount, container } = render(
      <RadioField
        options={[1, 2, 3, 5]}
      />
    );
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should check if provided value is in options', () => {
    const { unmount, container } = render(
      <RadioField
        options={[1, 2]}
        value={1}
      />
    );
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should toggle check if a radio is clicked', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <RadioField
        options={[1, 2]}
        value={1}
        onChange={onChangeMock}
      />
    );
    expect(container).toMatchSnapshot('option 1 checked');
    const input = container.querySelectorAll('input')[1];

    user.click(input);

    await waitFor(() =>
      expect(onChangeMock).toHaveBeenCalledWith({ valid: true, value: 2 })
    );

    expect(container).toMatchSnapshot('option 2 checked');
    unmount();
  });

  it('should trigger onChange when user hit enter ' +
  'and radio is focused', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <RadioField
        options={[1, 2]}
        value={1}
        onChange={onChangeMock}
      />
    );
    expect(container).toMatchSnapshot('option 1 checked');

    await act(async () => {
      container.querySelectorAll('label')[1].focus();
    });
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(onChangeMock).toHaveBeenCalledWith({ valid: true, value: 2 })
    );

    expect(container).toMatchSnapshot('option 2 checked');
    unmount();
  });

  it('should trigger onChange when user hit space ' +
  'and radio is focused', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <RadioField
        options={[1, 2]}
        value={1}
        onChange={onChangeMock}
      />
    );
    expect(container).toMatchSnapshot('option 1 checked');

    await act(async () => {
      container.querySelectorAll('label')[1].focus();
    });
    await user.keyboard('{ }');

    await waitFor(() =>
      expect(onChangeMock).toHaveBeenCalledWith({ valid: true, value: 2 })
    );

    expect(container).toMatchSnapshot('option 2 checked');
    unmount();
  });

  it('should not trigger onChange if ' +
  'a radio is clicked but its disabled', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <RadioField
        options={[1, 2]}
        value={1}
        disabled={true}
        onChange={onChangeMock}
      />
    );
    expect(container).toMatchSnapshot('option 1 checked');
    const input = container.querySelectorAll('input')[1];

    user.click(input);

    await waitFor(() =>
      expect(onChangeMock).not.toHaveBeenCalled()
    );

    expect(container).toMatchSnapshot('option 1 checked again');
    unmount();
  });

  it('should not trigger onChange if ' +
  'a radio if just this option is disabled', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const { unmount, container } = render(
      <RadioField
        options={[{ value: 'peach' }, { value: 'Orange', disabled: true }]}
        value="peach"
        onChange={onChangeMock}
      />
    );
    expect(container).toMatchSnapshot('option 1 checked');
    const input = container.querySelectorAll('input')[1];

    user.click(input);

    expect(onChangeMock).not.toHaveBeenCalled();

    expect(container).toMatchSnapshot('option 1 checked again');
    unmount();
  });

  it('should add box if boxed class has been passed to Radio', () => {
    const { unmount, container } = render(
      <RadioField
        className="boxed"
        options={[1, 2]}
        value={1}
      />
    );
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should set error state if onValidate function fails', async () => {
    const onChangeMock = jest.fn();
    const user = userEvent.setup();
    const onValidateMock = jest.fn().mockImplementation(
      (val, { dirty }) => val !== 'orange' || !dirty
    );
    const { unmount, container } = render(
      <RadioField
        options={[{ value: 'peach' }, { value: 'orange' }]}
        value="peach"
        onChange={onChangeMock}
        onValidate={onValidateMock}
      />
    );
    expect(container).toMatchSnapshot('option 1 checked');
    const orangeInput = container.querySelectorAll('input')[1];
    user.click(orangeInput);
    await waitFor(() => expect(onValidateMock).toHaveBeenCalledWith(
      'orange', { dirty: true, required: false }
    ));
    expect(container).toMatchSnapshot('invalid');
    const peachInput = container.querySelectorAll('input')[0];
    user.click(peachInput);
    await waitFor(() => expect(onValidateMock).toHaveBeenCalledTimes(2));

    expect(container).toMatchSnapshot('valid');
    unmount();
  });

  it('should use custom onValidate function if provided', async () => {
    const mockOnValidate = jest.fn().mockImplementation(() => true);
    const user = userEvent.setup();

    const options = [{
      value: 'peach',
      title: 'Delicious peach',
      description: 'this is a delicious peach',
    }];

    const { unmount, container } = render(
      <RadioField
        onValidate={mockOnValidate}
        options={options}
      />
    );

    const peachInput = container.querySelectorAll('input')[0];
    user.click(peachInput);
    await waitFor(() =>
      expect(mockOnValidate).toHaveBeenCalledWith(
        'peach', { dirty: true, required: false }
      )
    );
    unmount();
  });

  it('should use given parse title, description and value if ' +
  'function are provided', async () => {
    const options = [{
      cutomValue: 'peach',
      customTitle: 'Delicious peach',
      customDescription: 'this is a delicious peach',
    }];
    const mockParseTitle = jest.fn().mockImplementation(
      option => option.customTitle
    );
    const mockParseValue = jest.fn().mockImplementation(
      option => option.cutomValue ?? option
    );
    const mockParseDescription = jest.fn().mockImplementation(
      option => option.customDescription
    );
    const { unmount, container } = render(
      <RadioField
        parseTitle={mockParseTitle}
        parseValue={mockParseValue}
        parseDescription={mockParseDescription}
        options={options}
        value="peach"
      />
    );

    expect(mockParseTitle).toHaveBeenCalledWith(options[0]);
    expect(mockParseValue).toHaveBeenCalledWith(options[0]);
    expect(mockParseDescription).toHaveBeenCalledWith(options[0]);

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should not display description if ' +
  'parseDescription return empty string', () => {
    const options = [{
      cutomValue: 'peach',
      customTitle: 'Delicious peach',
      customDescription: 'this is a delicious peach',
    }];
    const mockParseDescription = jest.fn().mockImplementation(
      () => ''
    );

    const { unmount, container } = render(
      <RadioField
        parseDescription={mockParseDescription}
        options={options}
        value="peach"
      />
    );
    expect(mockParseDescription).toHaveBeenCalledWith(options[0]);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should change value if value prop change accross the time', async () => {
    let value = 'peach';
    const options = [{
      title: 'Peach',
      value: 'peach',
    }, {
      title: 'Orange',
      value: 'orange',
    }, {
      title: 'Banana',
      value: 'banana',
    }];
    const { container, unmount, rerender } = render(
      <RadioField
        value={value}
        options={options}
      />
    );

    expect(container).toMatchSnapshot('peach checked');
    value = 'orange';
    rerender(
      <RadioField
        value={value}
        options={options}
      />
    );

    await waitFor(() => expect(container).toMatchSnapshot('orange checked'));

    unmount();
  });

  it('should change options if ' +
  'options props change accross the time', async () => {
    let options = [{
      title: 'Peach',
      value: 'peach',
    }, {
      title: 'Orange',
      value: 'orange',
    }, {
      title: 'Banana',
      value: 'banana',
    }];
    const { container, unmount, rerender } = render(
      <RadioField
        options={options}
      />
    );

    expect(container).toMatchSnapshot('fruits options');
    options = [{
      title: 'Facebook',
      value: 'facebook',
    }, {
      title: 'Microsoft',
      value: 'microsoft',
    }, {
      title: 'Apple',
      value: 'apple',
    }, {
      title: 'Google',
      value: 'google',
    }];
    rerender(
      <RadioField
        options={options}
      />
    );

    await waitFor(() => expect(container).toMatchSnapshot('firm options'));

    unmount();
  });
});
