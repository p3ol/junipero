import React, { useState } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import { classNames } from '@poool/junipero-utils';

import { useEventListener, useTimeout } from './';

/* eslint-disable react/prop-types */
const TestComponent = ({ target, onTimeout }) => {
  const [clicked, setClicked] = useState(false);

  useEventListener('click', () => {
    setClicked(true);
  }, target);

  useTimeout(() => {
    onTimeout();
  }, 500);

  return <div className={classNames({ clicked })} />;
};
/* eslint-enable react/prop-types */

describe('useEventListener(name, listener, target)', () => {

  it('should allow to use global event listeners', () => {
    const map = {};
    global.addEventListener = (event, cb) => { map[event] = cb; };

    const component = mount(<TestComponent />);
    expect(component.find('.clicked').length).toBe(0);
    expect(map.click).toBeDefined();
    act(() => map.click());
    component.update();
    expect(component.find('.clicked').length).toBe(1);
    component.unmount();
  });

  it('should allow to use any event target', () => {
    const target = {};
    const component = mount(<TestComponent target={target} />);
    expect(component.find('.clicked').length).toBe(0);
    component.unmount();
  });

});

describe('useTimeout(listener, time, changes)', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it('should allow to execute a task after a given amount of ms', () => {
    const onTimeout = sinon.spy();
    mount(<TestComponent onTimeout={onTimeout} />);
    jest.runAllTimers();
    expect(onTimeout.called).toBe(true);
  });

  afterAll(() => {
    jest.clearAllTimers();
  });
});
