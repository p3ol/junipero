import React, { createRef } from 'react';
import { render } from '@testing-library/react';

import BaseField from './';

describe('<BaseField />', () => {

  it('should render', () => {
    const { container, unmount } = render(<BaseField />);
    expect(container.querySelectorAll('.junipero.base').length).toBe(1);
    unmount();
  });

  it('should provide access to inner ref', () => {
    const ref = createRef();
    const { container, unmount } = render(<BaseField ref={ref} />);
    expect(container.querySelector('.junipero.base'))
      .toBe(ref.current.innerRef.current);
    unmount();
  });

  it('should render with a placeholder or a label', () => {
    const { container, rerender, unmount } = render(
      <BaseField placeholder="Placeholder" label="Label" />
    );

    expect(container.querySelectorAll('.placeholder').length).toBe(1);
    expect(container.querySelectorAll('.label').length).toBe(1);

    rerender(
      <BaseField
        placeholder="Placeholder"
        label="Label"
        value="a"
        empty={false}
      />
    );

    expect(container.querySelectorAll('.placeholder').length).toBe(0);
    unmount();
  });

  it('should fire focus and blur handlers', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { container, unmount } = render(
      <BaseField onFocus={onFocus} onBlur={onBlur} />
    );
    container.querySelector('.base').focus();
    expect(onFocus).toHaveBeenCalled();
    container.querySelector('.base').blur();
    expect(onBlur).toHaveBeenCalled();
    unmount();
  });

});
