import React from 'react';
import { action } from '@storybook/addon-actions';
import { CSSTransition } from 'react-transition-group';

import DateField from './index';

export default { title: 'junipero/DateField' };

export const basic = () => (
  <DateField placeholder="Date of birth" onChange={action('change')} />
);

export const withPlaceholder = () => (
  <DateField
    placeholder="Select a date"
    label="Chosen date"
    onChange={action('change')}
  />
);

export const autoFocused = () => (
  <DateField autoFocus onChange={action('change')} />
);

export const withValue = () => (
  <DateField value={new Date(2019, 0, 1)} onChange={action('change')} />
);

export const disabled = () => (
  <DateField disabled value={new Date()} />
);

export const withValidation = () => (
  <DateField
    validate={val => val?.getFullYear() === 2020}
    onChange={action('change')}
  />
);

export const withMinAndMax = () => (
  <DateField
    min={new Date(2020, 0, 1)}
    max={new Date(2020, 11, 31)}
    onChange={action('change')}
  />
);

export const animated = () => (
  <DateField
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
  <DateField
    opened={true}
    trigger="manual"
    placeholder="Date of birth"
    onChange={action('change')}
  />
);
