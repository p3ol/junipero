import { createRef } from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import DateField from './';

describe('<DateField />', () => {
  it('should render', () => {
    const ref = createRef();
    const { container, unmount } = render(<DateField ref={ref} />);
    expect(container.querySelectorAll('.junipero.date-picker').length).toBe(1);
    unmount();
  });

  it('should provide some imperative handles', () => {
    const ref = createRef();
    const { container, unmount } = render(<DateField ref={ref} />);
    expect(ref.current.innerRef).toBeDefined();
    expect(container.querySelector('.junipero.date-picker'))
      .toBe(ref.current.innerRef.current);
    expect(ref.current.fieldRef).toBeDefined();
    expect(ref.current.dropdownRef).toBeDefined();
    expect(ref.current.opened).toBe(false);
    expect(ref.current.reset).toBeDefined();
    expect(ref.current.focus).toBeDefined();
    expect(ref.current.blur).toBeDefined();
    expect(ref.current.displayed).toBeDefined();
    expect(ref.current.selected).toBeDefined();
    expect(ref.current.valid).toBe(false);
    unmount();
  });

  it('should initialize if value prop is defined on mount', () => {
    const ref = createRef();
    const { unmount } = render(
      <DateField
        ref={ref}
        required
        value={new Date('December 17, 1995 03:24:00')}
      />
    );

    const value = ref.current.internalValue;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
    unmount();
  });

  it('should update internal value when value prop changes', () => {
    const ref = createRef();
    const { rerender, unmount } = render(<DateField ref={ref} />);
    expect(ref.current.internalValue).toBeFalsy();
    rerender(
      <DateField ref={ref} value={new Date('December 17, 1995 03:24:00')} />
    );
    const value = ref.current.internalValue;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
    unmount();
  });

  it('should open calendar when clicking field', async () => {
    const ref = createRef();
    const { container, unmount } = render(<DateField ref={ref} />);
    await act(async () => { container.querySelector('.base').focus(); });
    expect(ref.current.opened).toBe(true);
    unmount();
  });

  it('shouldn\'t open calendar if field is disabled', async () => {
    const ref = createRef();
    const { container, unmount } = render(
      <DateField ref={ref} disabled={true} />
    );
    await act(async () => { container.querySelector('.base').focus(); });
    expect(ref.current.opened).toBe(false);
    unmount();
  });

  it('should display previous month on previous arrow click', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <DateField
        autoFocus={true}
        ref={ref}
        value={new Date('December 17, 1995 03:24:00')}
      />
    );
    fireEvent
      .click(container.querySelector('a.arrow-wrapper.left'), { button: 0 });

    const value = ref.current.displayed;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(10);
    expect(value.getDate()).toBe(17);
    unmount();
  });

  it('should jump to previous year on previous arrow click if current ' +
    'month is 0 (january)', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <DateField
        autoFocus={true}
        ref={ref}
        value={new Date('January 17, 1995 03:24:00')}
      />
    );
    fireEvent
      .click(container.querySelector('a.arrow-wrapper.left'), { button: 0 });

    const value = ref.current.displayed;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1994);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
    unmount();
  });

  it('should display next month on next arrow click', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <DateField
        autoFocus={true}
        ref={ref}
        value={new Date('November 17, 1995 03:24:00')}
      />
    );
    fireEvent
      .click(container.querySelector('a.arrow-wrapper.right'), { button: 0 });

    const value = ref.current.displayed;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1995);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);
    unmount();
  });

  it('should jump to next year on next arrow click if current ' +
    'month is 11 (december)', () => {
    const ref = createRef();
    const { container, unmount } = render(
      <DateField
        autoFocus={true}
        ref={ref}
        value={new Date('December 17, 1995 03:24:00')}
      />
    );
    fireEvent
      .click(container.querySelector('a.arrow-wrapper.right'), { button: 0 });

    const value = ref.current.displayed;
    expect(value).toBeDefined();
    expect(value.getFullYear()).toBe(1996);
    expect(value.getMonth()).toBe(0);
    expect(value.getDate()).toBe(17);
    unmount();
  });

  it('should show a placeholder when provided', () => {
    const { container, unmount } = render(
      <DateField placeholder="placeholder" />
    );
    expect(container.querySelectorAll('.placeholder').length).toBe(1);
    expect(container.querySelector('.placeholder').outerHTML)
      .toBe('<span class="placeholder">placeholder</span>');
    unmount();
  });

  it('should show a label when provided and field is dirty', () => {
    const { container, unmount } = render(
      <DateField label="label" autoFocus={true} placeholder="placeholder" />
    );
    expect(container.querySelectorAll('.placeholder').length).toBe(1);
    expect(container.querySelector('.placeholder').outerHTML)
      .toBe('<span class="placeholder">placeholder</span>');

    fireEvent.click(container.querySelectorAll('.day')[0]);
    expect(container.querySelectorAll('.placeholder').length).toBe(0);
    expect(container.querySelectorAll('.label').length).toBe(1);
    expect(container.querySelector('.label').outerHTML)
      .toBe('<span class="label">label</span>');
    unmount();
  });

  it('should fire onToggle event when opened/closed', async () => {
    const ref = createRef();
    const onToggle = jest.fn();
    const { container, unmount } = render(
      <DateField ref={ref} onToggle={onToggle} />
    );

    await act(async () => { container.querySelector('.base').focus(); });
    expect(ref.current.opened).toBe(true);
    expect(onToggle)
      .toHaveBeenCalledWith(expect.objectContaining({ opened: true }));

    fireEvent.click(document.body);
    expect(ref.current.opened).toBe(false);
    expect(onToggle)
      .toHaveBeenCalledWith(expect.objectContaining({ opened: false }));
    unmount();
  });

  it('should have a 3 days limited datepicker when min/max is set', () => {
    const previousDay = new Date('December 15, 2019');
    const day = new Date('December 16, 2019');
    const nextDay = new Date('December 17, 2019');
    const { container, unmount } = render(
      <DateField autoFocus={true} min={previousDay} value={day} max={nextDay} />
    );
    expect(container.querySelectorAll('.day:not(.disabled)').length).toBe(3);
    unmount();
  });

  it('should not let you pick a disabled date', () => {
    const ref = createRef();
    const day = new Date(2019, 11, 16);
    const nextDay = new Date(2019, 11, 17);
    const { container, unmount } = render(
      <DateField autoFocus={true} ref={ref} min={day} value={nextDay} />
    );

    fireEvent.click(container.querySelectorAll('.day.disabled')[0]);

    const value = ref.current.displayed;
    expect(value.getFullYear()).toBe(2019);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(17);

    unmount();
  });

  it('should be able to reset date to original value', async () => {
    const ref = createRef();
    const day = new Date(2019, 11, 16);
    const { container, unmount } = render(
      <DateField autoFocus={true} ref={ref} value={day} />
    );

    fireEvent.click(container.querySelectorAll('.day')[0]);
    let value = new Date(ref.current.internalValue.toUTCString());
    expect(value.getFullYear()).toBe(2019);
    expect(value.getMonth()).toBe(10);
    expect(value.getDate()).toBe(25);

    await act(async () => { ref.current.reset(); });
    value = ref.current.internalValue;
    expect(value.getFullYear()).toBe(2019);
    expect(value.getMonth()).toBe(11);
    expect(value.getDate()).toBe(16);

    unmount();
  });
});
