import { mount } from 'enzyme';

export const mountToBody = component => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const wrapper = mount(component, { attachTo: container });
  const detach = wrapper.detach;
  wrapper.detach = () => {
    detach.bind(wrapper)();
    document.body.removeChild(container);
  };

  return wrapper;
};
