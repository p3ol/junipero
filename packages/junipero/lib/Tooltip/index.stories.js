import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { CSSTransition } from 'react-transition-group';

import Tooltip from './index';
import Button from '../Button';
import TextField from '../TextField';

export default { title: 'junipero/Tooltip' };

export const basic = () => (
  <Tooltip
    style={{ left: 100, top: 100, position: 'relative' }}
    text="Text"
    onToggle={action('toggle')}
  >
    <Button>Hover me</Button>
  </Tooltip>
);

export const withChangingContent = () => {
  const [enabled, setEnabled] = useState(false);

  const onClick = () => {
    setEnabled(old => !old);
  };

  return (
    <Tooltip
      style={{ left: 100, top: 100, position: 'relative' }}
      text={enabled ? 'This is a long text for a tooltip' : 'Text'}
      onToggle={action('toggle')}
    >
      <Button onClick={onClick}>Hover me</Button>
    </Tooltip>
  );
};

export const withTextField = () => (
  <div style={{ left: 100, top: 100, position: 'relative' }}>
    <Tooltip
      text="Text"
      onToggle={action('toggle')}
    >
      <TextField placeholder="Write something" />
    </Tooltip>
  </div>
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
