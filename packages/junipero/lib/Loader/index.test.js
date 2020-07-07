import React from 'react';
import { mount } from 'enzyme';

import Loader from './';

describe('<Loader />', () => {

  it('should render dots', () => {
    const component = mount(<Loader />);
    expect(component.find('.junipero.loader.dots').length).toBe(1);
    expect(component.find('.dot').length).toBe(3);
    expect(component.find('.inner').length).toBe(0);
  });

  it('should render bars', () => {
    const component = mount(<Loader type="bar" />);
    expect(component.find('.junipero.loader.bar').length).toBe(1);
    expect(component.find('.dot').length).toBe(0);
    expect(component.find('.inner').length).toBe(1);
  });

  it('should render spinner', () => {
    const component = mount(<Loader type="spinner" />);
    expect(component.find('.junipero.loader.spinner').length).toBe(1);
    expect(component.find('.dot').length).toBe(0);
    expect(component.find('.inner').length).toBe(0);
  });

});
