import { render } from '@testing-library/react';

import TextField from '../TextField';
import SelectField from '../SelectField';
import FieldAddon from '../FieldAddon';
import Button from '../Button';
import FieldGroup from '.';

describe('<FieldGroup />', () => {
  it('should render a textfield prefix', () => {
    const { container, unmount } = render(
      <FieldGroup>
        <FieldAddon>€</FieldAddon>
        <TextField />
      </FieldGroup>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render a textfield suffix', () => {
    const { container, unmount } = render(
      <FieldGroup>
        <TextField />
        <FieldAddon>€</FieldAddon>
      </FieldGroup>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render textfields with a center addon', () => {
    const { container, unmount } = render(
      <FieldGroup>
        <TextField />
        <FieldAddon>@</FieldAddon>
        <TextField />
      </FieldGroup>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render a textfield with a prefix & a button suffix', () => {
    const { container, unmount } = render(
      <FieldGroup>
        <FieldAddon>€</FieldAddon>
        <TextField />
        <Button>Update</Button>
      </FieldGroup>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render a select field prefix', () => {
    const { container, unmount } = render(
      <FieldGroup>
        <FieldAddon>€</FieldAddon>
        <SelectField />
      </FieldGroup>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render a select field suffix', () => {
    const { container, unmount } = render(
      <FieldGroup>
        <SelectField />
        <FieldAddon>€</FieldAddon>
      </FieldGroup>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });
});
