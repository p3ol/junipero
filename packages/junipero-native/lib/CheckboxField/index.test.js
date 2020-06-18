import React from 'react';
import { mount } from 'enzyme';

import CheckboxField from './';

describe('test', () => {
  it('should render', () => {
    expect(mount(<CheckboxField />).html()).toBe('<div></div>');
  });
});
