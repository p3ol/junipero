import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import Tooltip from '../src/Tooltip';

describe('<Tooltip />', () => {

  it('should render', () => {
    const wrapper = mount(
      <div>
        <Tooltip>
          <span className="inner" />
        </Tooltip>
      </div>
    );
    wrapper.find('.inner').simulate('mouseenter');
    expect(wrapper.find('.junipero-tooltip').length).toBe(1);
    wrapper.find('.inner').simulate('mouseleave');
    expect(wrapper.find('.junipero-tooltip').length).toBe(0);
  });

  it('should also render tooltip when using click as trigger', () => {
    const map = {};
    document.addEventListener = (name, cb) => { map[name] = sinon.spy(cb); };

    const wrapper = mount(
      <div>
        <Tooltip trigger="click">
          <span className="inner" />
        </Tooltip>
      </div>
    );

    wrapper.find('.inner').simulate('click');
    expect(wrapper.find('.junipero-tooltip').length).toBe(1);
    map.click({ target: document.body });
    wrapper.update();
    expect(wrapper.find('.junipero-tooltip').length).toBe(0);
  });

  it('should render even with no children', () => {
    const wrapper = mount(
      <div>
        <Tooltip />
      </div>
    );
    wrapper.find('.tooltip-toggle').simulate('mouseenter');
    expect(wrapper.find('.junipero-tooltip').length).toBe(1);
  });

  it('should automatically close tooltip when disabled prop changes', () => {
    const wrapper = mount(
      <div>
        <Tooltip>
          <span className="inner" />
        </Tooltip>
      </div>
    );
    wrapper.find('.inner').simulate('mouseenter');
    expect(wrapper.find('.junipero-tooltip').length).toBe(1);

    // Simulate componentDidUpdate on child Tooltip component
    wrapper.setProps({ children: (
      <Tooltip disabled={true}>
        <span className="inner" />
      </Tooltip>
    ) });

    wrapper.update();
    expect(wrapper.find('.junipero-tooltip').length).toBe(0);
  });

  it('shouldn\'t open tooltip if disabled', () => {
    const wrapper = mount(
      <div>
        <Tooltip disabled={true}>
          <span className="inner" />
        </Tooltip>
      </div>
    );
    wrapper.find('.inner').simulate('mouseenter');
    expect(wrapper.find('.junipero-tooltip').length).toBe(0);
  });

  it('should provide a way to tell Popper.js to update itself', () => {
    const wrapper = mount(
      <div>
        <Tooltip>
          <span className="inner" />
        </Tooltip>
      </div>
    );
    wrapper.find('.inner').simulate('mouseenter');

    expect(wrapper.find(Tooltip).instance().scheduleUpdate).toBeDefined();
    expect(wrapper.find(Tooltip).instance().updatePopper()).not.toBeDefined();
  });

  it('should clean document listeners on unmount', () => {
    const map = {};
    document.addEventListener = (name, cb) => { map[name] = sinon.spy(cb); };
    document.removeEventListener = name => delete map[name];

    const wrapper = mount(
      <div>
        <Tooltip trigger="click">
          <span className="inner" />
        </Tooltip>
      </div>
    );

    wrapper.unmount();
    expect(map.click).not.toBeDefined();
  });

  it('should be able render inside another container using portals', () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.body.appendChild(container);

    const wrapper = mount(
      <div>
        <Tooltip container=".test-container" />
      </div>
    );
    wrapper.find('.tooltip-toggle').simulate('mouseenter');

    expect(document.querySelector('.test-container .junipero-tooltip'))
      .not.toBeFalsy();
  });

  it('should animate tooltip if prop is provided', () => {
    const animate = sinon.spy(tooltip => tooltip);

    const wrapper = mount(
      <div>
        <Tooltip animate={animate} />
      </div>
    );
    wrapper.find('.tooltip-toggle').simulate('mouseenter');
    expect(animate.called).toBe(true);
  });

  it('should animate tooltip in custom container if prop is provided', () => {
    const animate = sinon.spy(tooltip => tooltip);
    const container = document.createElement('div');
    container.className = 'test-container';
    document.body.appendChild(container);

    const wrapper = mount(
      <div>
        <Tooltip container=".test-container" animate={animate} />
      </div>
    );
    wrapper.find('.tooltip-toggle').simulate('mouseenter');
    expect(animate.called).toBe(true);
  });

});
