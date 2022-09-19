import { action } from '@storybook/addon-actions';
import { CSSTransition } from 'react-transition-group';

import ColorField from './index';

export default { title: 'junipero/ColorField' };

export const basic = () => (
  <ColorField onChange={action('change')} />
);

export const withPlaceholder = () => (
  <ColorField
    placeholder="Select a color"
    label="Chosen color"
    onChange={action('change')}
  />
);

export const withoutPreview = () => (
  <ColorField
    placeholder="Select a color"
    label="Chosen color"
    previewEnabled={false}
    onChange={action('change')}
  />
);

export const autoFocused = () => (
  <ColorField
    autoFocus={true}
    onChange={action('change')}
  />
);

export const animated = () => (
  <ColorField
    animateMenu={(menu, { opened }) => (
      <CSSTransition
        in={opened}
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={300}
        classNames="slide-in-up-dropdown"
        children={menu}
      />
    )}
    onChange={action('change')}
  />
);

export const alwaysOpened = () => (
  <ColorField opened={true} trigger="manual" onChange={action('change')} />
);
