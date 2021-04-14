import React, { createRef } from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import Tooltip from './';

describe('<Tooltip />', () => {

  it('should render', () => {
    const ref = createRef();
    const wrapper = mount(
      <Tooltip ref={ref}>
        <span>Text</span>
      </Tooltip>
    );
    wrapper.find('span').simulate('mouseenter');
    expect(wrapper.find('.junipero.tooltip').length).toBe(1);
    expect(ref.current.opened).toBe(true);
    wrapper.find('span').simulate('mouseleave');
    expect(wrapper.find('.junipero.tooltip').length).toBe(0);
  });

  it('should also render tooltip when using click as trigger', () => {
    const map = {};

    document.addEventListener = (name, cb) => { map[name] = sinon.spy(cb); };

    const wrapper = mount(
      <Tooltip globalEventsTarget={document} trigger="click">
        Text
      </Tooltip>
    );

    wrapper.find('span').simulate('click');
    expect(wrapper.find('.junipero.tooltip').length).toBe(1);
    act(() => { map.click({ target: document.body }); });
    wrapper.update();
    expect(wrapper.find('.junipero.tooltip').length).toBe(0);
  });

  it('should render even with no children', () => {
    const wrapper = mount(
      <Tooltip />
    );
    wrapper.find('span').simulate('mouseenter');
    expect(wrapper.find('.junipero.tooltip').length).toBe(1);
  });

  it('should render with a custom placement', () => {
    const wrapper = mount(
      <Tooltip placement="bottom-end" />
    );
    wrapper.find('span').simulate('mouseenter');
    expect(wrapper.find('.junipero.tooltip').length).toBe(1);
  });

  it('should automatically close tooltip when disabled prop changes', () => {
    const wrapper = mount(
      <Tooltip>
        Text
      </Tooltip>
    );
    wrapper.find('span').simulate('mouseenter');
    expect(wrapper.find('.junipero.tooltip').length).toBe(1);
    wrapper.setProps({ disabled: true });
    wrapper.update();
    expect(wrapper.find('.junipero.tooltip').length).toBe(0);
  });

  it('should allow to click outside without trying to close tooltip', () => {
    const map = {};

    document.addEventListener = (name, cb) => { map[name] = sinon.spy(cb); };

    const wrapper = mount(
      <Tooltip globalEventsTarget={document} trigger="click">
        Text
      </Tooltip>
    );
    act(() => { map.click({ target: document.body }); });
    expect(wrapper.find('.junipero.tooltip').length).toBe(0);
  });

  it('shouldn\'t open tooltip if disabled', () => {
    const wrapper = mount(
      <Tooltip disabled={true}>
        Text
      </Tooltip>
    );
    wrapper.find('span').simulate('mouseenter');
    expect(wrapper.find('.junipero.tooltip').length).toBe(0);
  });

  it('should clean document listeners on unmount', () => {
    const map = {};

    document.addEventListener = (name, cb) => { map[name] = sinon.spy(cb); };

    document.removeEventListener = name => delete map[name];

    const wrapper = mount(
      <Tooltip globalEventsTarget={document} trigger="click">
        Text
      </Tooltip>
    );

    wrapper.unmount();
    expect(map.click).not.toBeDefined();
  });

  it('should be able render inside another container using portals', () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.body.appendChild(container);

    const wrapper = mount(
      <Tooltip container=".test-container" />
    );
    wrapper.find('span').simulate('mouseenter');

    expect(document.querySelector('.test-container .junipero.tooltip'))
      .not.toBeFalsy();
  });

  it('should animate tooltip if prop is provided', () => {
    const animate = sinon.spy(tooltip => tooltip);

    const wrapper = mount(
      <Tooltip animate={animate} />
    );
    wrapper.find('span').simulate('mouseenter');
    expect(animate.called).toBe(true);
  });

  it('should animate tooltip in custom container if prop is provided', () => {
    const animate = sinon.spy(tooltip => tooltip);
    const container = document.createElement('div');
    container.className = 'test-container';
    document.body.appendChild(container);

    const wrapper = mount(
      <Tooltip container=".test-container" animate={animate} />
    );
    wrapper.find('span').simulate('mouseenter');
    expect(animate.called).toBe(true);
  });

  it('should allow to define a custom target to check for a click outside ' +
    'event', async () => {
    const ref = createRef();
    const buttonRef = createRef();
    const linkRef = createRef();

    const map = {};

    document.addEventListener = (event, cb) => { map[event] = sinon.spy(cb); };

    mount(<a ref={linkRef} className="link" />);

    const component = mount(
      <div>
        <button className="button" ref={buttonRef} />
        <Tooltip
          trigger="click"
          globalEventsTarget={document}
          ref={ref}
          clickOutsideTarget={linkRef.current}
        >
          Text
        </Tooltip>
      </div>
    );

    component.find('span').simulate('click');
    expect(ref.current.opened).toBe(true);
    expect(component.find('.junipero.tooltip').length).toBe(1);
    expect(linkRef.current).toBeDefined();
    act(() => { map.click({ target: linkRef.current }); });
    expect(ref.current.opened).toBe(true);
    expect(component.find('.junipero.tooltip').length).toBe(1);
    act(() => { map.click({ target: buttonRef.current }); });
    expect(ref.current.opened).toBe(false);
  });

});
