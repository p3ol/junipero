import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import DropdownMenu from '../src/DropdownMenu';

describe('<DropdownMenu />', () => {
  const options = {
    context: {
      isOpen: true,
      theme: 'default',
      placement: 'bottom',
    },
  };

  it('should render', () => {
    const component = mount(<DropdownMenu />, options);
    expect(component.find('.junipero-dropdown-menu').length).toBe(1);
  });

  it('should provide a way to tell Popper.js to update itself', () => {
    const component = mount(<DropdownMenu />, options);
    expect(component.instance().scheduleUpdate).toBeDefined();
    expect(component.instance().updatePopper()).not.toBeDefined();
  });

  it('should render component in custom container if provided', () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.body.appendChild(container);

    mount(<DropdownMenu container=".test-container" />, options);
    expect(document.querySelector('.test-container .junipero-dropdown-menu'))
      .not.toBeFalsy();
  });

  it('should animate menu if animate prop is provided', () => {
    const animate = sinon.spy(menu => menu);
    mount(<DropdownMenu animate={animate} />, options);
    expect(animate.called).toBe(true);
  });

  it('should animate menu in portal if animate prop is provided', () => {
    const animate = sinon.spy(menu => menu);
    const container = document.createElement('div');
    container.className = 'test-container';
    document.body.appendChild(container);

    mount((
      <DropdownMenu animate={animate} container=".test-container" />
    ), options);
    expect(animate.called).toBe(true);
  });

});
