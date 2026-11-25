import { action } from 'storybook/actions';

import { slideInDownMenu } from '../../../transitions/lib';
import FieldControl from '../FieldControl';
import Label from '../Label';
import Abstract from '../Abstract';
import ColorField from '.';

export default { title: 'react/ColorField' };

export const Basic = () => (
  <ColorField placeholder="Pick a color" onChange={action('change')} />
);

export const WithLabelAndAbstract = () => (
  <FieldControl>
    <Label className="info" htmlFor="firstname">Eye color</Label>
    <ColorField
      id="firstname"
      placeholder="Pick a color"
      onChange={action('change')}
      onValidate={() => false}
    />
    <Abstract className="info">
      Take a closer look at your eyes in a mirror
    </Abstract>
  </FieldControl>
);

export const AutoFocused = () => (
  <ColorField
    autoFocus={true}
    onChange={action('change')}
  />
);

export const AlwaysOpened = () => (
  <ColorField opened={true} trigger="manual" onChange={action('change')} />
);

export const Animated = () => (
  <ColorField animateMenu={slideInDownMenu} />
);

export const Disabled = () => (
  <ColorField animateMenu={slideInDownMenu} disabled={true} />
);

const PRESETS = [
  { value: '#6C5CE7', title: 'Purple' },
  { value: '#00B894', title: 'Green' },
  { value: '#FDCB6E', title: 'Yellow' },
  { value: 'var(--brand-color)', color: '#E17055', title: 'Brand color' },
];

export const WithPresets = () => (
  <ColorField presets={PRESETS} onChange={action('change')} />
);

export const WithCustomPresetsLabel = () => (
  <ColorField
    presets={PRESETS}
    presetsLabel="Palette"
    onChange={action('change')}
  />
);

export const WithCustomMenuContent = () => (
  <ColorField
    onChange={action('change')}
    renderMenuContent={({ value, setValue, close }) => (
      <button
        type="button"
        disabled={!value}
        onClick={() => {
          setValue('');
          close();
        }}
      >
        Clear
      </button>
    )}
  />
);

const presetsGroups = [
  {
    label: 'Basic colors',
    presets: [
      { value: '#6C5CE7', title: 'Purple' },
      { value: '#00B894', title: 'Green' },
      { value: '#FDCB6E', title: 'Yellow' },
    ],
  },
  {
    label: 'Brand',
    presets: [
      { value: 'var(--brand-color)', color: '#E17055', title: 'Brand color' },
    ],
  },
];

export const withPresetsGroups = () => (
  <ColorField presets={presetsGroups} onChange={action('change')} />
);
