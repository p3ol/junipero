import React from 'react';
import { action } from '@storybook/addon-actions';
import { CSSTransition } from 'react-transition-group';

import ColorField from './index';

export default { title: 'ColorField' };

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
