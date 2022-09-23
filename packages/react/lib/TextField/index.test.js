import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { blur } from '~test-utils';
import Label from '../Label';
import Abstract from '../Abstract';
import FieldControl from '../FieldControl';
import TextField from './';

describe('<TextField />', () => {
  it('should render', () => {
    const { unmount, container } = render(<TextField placeholder="Name" />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should be invalid if validation fails', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <TextField
        placeholder="Name"
        onValidate={() => false}
      />
    );

    const input = container.querySelector('input');
    await user.type(input, 'John');
    await blur(input);
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to be used with a FieldControl', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <FieldControl>
        <Label htmlFor="name">Name</Label>
        <TextField id="name" placeholder="Name" onValidate={() => false} />
        <Abstract>Enter your name</Abstract>
      </FieldControl>
    );

    const input = container.querySelector('input');
    await user.type(input, 'John');
    await blur(input);

    expect(container).toMatchSnapshot();
    unmount();
  });
});
