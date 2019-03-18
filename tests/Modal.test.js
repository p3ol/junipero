import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import Modal from '../src/Modal';

describe('<Modal />', () => {

  it('should render', () => {
    const component = mount(<Modal />);
    component.instance().open();
    expect(component.instance().container).toBeTruthy();
  });

  it('should remove modal from DOM when using close method', () => {
    const component = mount(<Modal />);
    component.instance().open();
    expect(component.instance().container).toBeTruthy();
    component.instance().close();
    expect(component.instance().container).toBeFalsy();
  });

  it('should not open modal if it is disabled', () => {
    const component = mount(<Modal disabled={true} />);
    component.instance().open();
    expect(component.instance().container).toBeFalsy();
  });

  it('should close modal when clicking on backdrop', () => {
    const component = mount(<Modal />);
    component.instance().open();
    expect(component.instance().container).toBeTruthy();
    component.instance()
      .onBackdropClick({ target: component.instance().backdrop });
    expect(component.instance().container).toBeFalsy();
  });

  it('should not close modal if clicked inside', () => {
    const component = mount(<Modal />);
    component.instance().open();
    expect(component.instance().container).toBeTruthy();
    component.instance()
      .onBackdropClick({ target: component.instance().content });
    expect(component.instance().container).toBeTruthy();
  });

  it('should animate modal if animate prop is provided', () => {
    const animate = sinon.spy(modal => modal);
    const component = mount(<Modal animate={animate} />);
    component.instance().open();
    expect(animate.called).toBe(true);
  });

  it('should animate modal content if animateContent prop is provided', () => {
    const animateContent = sinon.spy(modal => modal);
    const component = mount(<Modal animateContent={animateContent} />);
    component.instance().open();
    expect(animateContent.called).toBe(true);
  });

});
