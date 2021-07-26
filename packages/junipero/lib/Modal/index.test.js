import React, { createRef } from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';

import Modal from './';

describe('<Modal />', () => {

  it('should render', () => {
    const ref = createRef();
    const component = mount(<Modal opened={true} ref={ref} />);
    expect(component.find('.junipero.modal').length).toBe(1);
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const component = mount(<Modal opened={true} ref={ref} />);
    expect(ref.current.innerRef).toBeDefined();
    expect(component.getDOMNode()).toBe(ref.current.innerRef.current);
  });

  it('should remove modal from DOM when using close method', () => {
    const ref = createRef();
    mount(<Modal ref={ref} />);
    act(() => { ref.current.open(); });
    expect(ref.current.innerRef.current).toBeTruthy();
    act(() => { ref.current.close(); });
    expect(ref.current.innerRef.current).toBeFalsy();
    act(() => { ref.current.toggle(); });
    expect(ref.current.innerRef.current).toBeTruthy();
  });

  it('should not toggle modal if it is disabled', () => {
    const ref = createRef();
    const component = mount(<Modal ref={ref} disabled={true} />);
    act(() => { ref.current.open(); });
    expect(ref.current.innerRef.current).toBeFalsy();
    component.setProps({ opened: true });
    expect(ref.current.innerRef.current).toBeTruthy();
    act(() => { ref.current.close(); });
    expect(ref.current.innerRef.current).toBeTruthy();
    act(() => { ref.current.toggle(); });
    expect(ref.current.innerRef.current).toBeTruthy();
  });

  it('should close modal when clicking on backdrop', () => {
    const ref = createRef();
    const component = mount(<Modal ref={ref} />);
    act(() => { ref.current.open(); });
    component.update();
    expect(ref.current.innerRef.current).toBeTruthy();
    component.find('.wrapper')
      .simulate('click', { target: ref.current.wrapperRef.current });
    expect(ref.current.innerRef.current).toBeFalsy();
  });

  it('should not close modal if clicked inside', () => {
    const ref = createRef();
    const component = mount(<Modal ref={ref} />);
    act(() => { ref.current.open(); });
    component.update();
    expect(ref.current.innerRef.current).toBeTruthy();
    component.find('.content')
      .simulate('click', { target: ref.current.contentRef.current });
    expect(ref.current.innerRef.current).toBeTruthy();
  });

  it('should not close modal closable = false', () => {
    const ref = createRef();
    const component = mount(<Modal closable={false} ref={ref} />);
    act(() => { ref.current.open(); });
    component.update();
    expect(ref.current.innerRef.current).toBeTruthy();
    component.find('.wrapper')
      .simulate('click', { target: ref.current.wrapperRef.current });
    expect(ref.current.innerRef.current).toBeTruthy();
  });

  it('should animate modal if animate prop is provided', () => {
    const ref = createRef();
    const animate = sinon.spy(modal => modal);
    mount(<Modal ref={ref} animate={animate} />);
    act(() => { ref.current.open(); });
    expect(animate.called).toBe(true);
  });
});
