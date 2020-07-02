import React from 'react';
import { action } from '@storybook/addon-actions';
import { CSSTransition } from 'react-transition-group';

import Tooltip from './index';

export default { title: 'junipero/Tooltip' };

export const basic = () => (
  <Tooltip
    style={{ left: 100, top: 100, position: 'relative' }}
    text="Text"
    onToggle={action('toggle')}
  >
    Hover me
  </Tooltip>
);

export const withCustomPlacement = () => (
  <Tooltip
    style={{ left: 100, top: 100, position: 'relative' }}
    text="Text"
    placement="right-start"
    onToggle={action('toggle')}
  >
    Hover me
  </Tooltip>
);

export const withClickTrigger = () => (
  <Tooltip
    style={{ left: 100, top: 100, position: 'relative' }}
    text="Text"
    trigger="click"
    onToggle={action('toggle')}
  >
    Click me
  </Tooltip>
);

export const withAnimation = () => (
  <Tooltip
    style={{ left: 100, top: 100, position: 'relative' }}
    text="Text"
    onToggle={action('toggle')}
    animate={(tooltip, { opened }) => (
      <CSSTransition
        in={opened}
        mountOnEnter={true}
        unmountOnExit={true}
        timeout={300}
        classNames="fade-in"
        children={tooltip}
      />
    )}
  >
    Hover me
  </Tooltip>
);
