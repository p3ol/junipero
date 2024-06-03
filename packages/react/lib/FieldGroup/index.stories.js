import TextField from '../TextField';
import SelectField from '../SelectField';
import FieldAddon from '../FieldAddon';
import FieldControl from '../FieldControl';
import Button from '../Button';
import DateField from '../DateField';
import ColorField from '../ColorField';
import Label from '../Label';
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
    <FieldAddon>seconds</FieldAddon>
    <DateField />
    <ColorField />
    <Button className="primary last">Update</Button>
  </FieldGroup>
);

export const withMultipleElementsAndLabels = () => (
  <FieldGroup className="mt-8">
    <FieldAddon>€</FieldAddon>
    <TextField className="relative">
      <Label className="absolute bottom-full left-0">Amount</Label>
    </TextField>
    <FieldAddon>@</FieldAddon>
    <TextField className="relative">
      <Label className="absolute bottom-full left-0">Username</Label>
    </TextField>
    <FieldAddon>seconds</FieldAddon>
    <DateField className="relative">
      <Label className="absolute bottom-full left-0">Created at</Label>
    </DateField>
    <ColorField className="relative">
      <Label className="absolute bottom-full left-0">Color</Label>
    </ColorField>
    <Button className="primary last">Update</Button>
  </FieldGroup>
);
