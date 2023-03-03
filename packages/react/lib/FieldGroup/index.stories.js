import TextField from '../TextField';
import SelectField from '../SelectField';
import FieldAddon from '../FieldAddon';
import FieldControl from '../FieldControl';
import Button from '../Button';
import FieldGroup from '.';

export default { title: 'react/FieldGroup' };

export const withTextFieldPrefix = () => (
  <FieldControl>
    <FieldGroup>
      <FieldAddon>€</FieldAddon>
      <TextField />
    </FieldGroup>
  </FieldControl>
);

export const withTextFieldSuffix = () => (
  <FieldControl>
    <FieldGroup>
      <TextField />
      <FieldAddon>€</FieldAddon>
    </FieldGroup>
  </FieldControl>
);

export const withTextFieldCenter = () => (
  <FieldGroup>
    <TextField />
    <FieldAddon>@</FieldAddon>
    <TextField />
  </FieldGroup>
);

export const withButton = () => (
  <FieldGroup>
    <FieldAddon>€</FieldAddon>
    <TextField />
    <Button>Update</Button>
  </FieldGroup>
);

export const withSelectFieldPrefix = () => (
  <FieldControl>
    <FieldGroup>
      <FieldAddon>€</FieldAddon>
      <SelectField />
    </FieldGroup>
  </FieldControl>
);

export const withSelectFieldSuffix = () => (
  <FieldControl>
    <FieldGroup>
      <SelectField />
      <FieldAddon>€</FieldAddon>
    </FieldGroup>
  </FieldControl>
);

export const withMultipleElements = () => (
  <FieldGroup>
    <FieldAddon>€</FieldAddon>
    <TextField />
    <FieldAddon>@</FieldAddon>
    <TextField />
    <FieldAddon className="last">seconds</FieldAddon>
    <Button className="primary submit">Update</Button>
  </FieldGroup>
);
