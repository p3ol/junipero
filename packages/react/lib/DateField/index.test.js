import { fireEvent, render } from '@testing-library/react';

import DateField from './';

describe('<DateField />', () => {
  it('should render', () => {
    const onToggle = jest.fn();
    const { container, unmount, rerender } = render(
      <DateField placeholder="Date of birth" onToggle={onToggle} />
    );
    expect(container).toMatchSnapshot('default');
    rerender(<DateField value={new Date(2019, 0, 1)} onToggle={onToggle} />);
    expect(container).toMatchSnapshot('with value');
    fireEvent.click(container.querySelector('input'));
    expect(container).toMatchSnapshot('opened');
    expect(onToggle)
      .toHaveBeenCalledWith(expect.objectContaining({ opened: true }));
    unmount();
  });

  it('should not open calendar if disabled', () => {
    const { container, unmount } = render(
      <DateField disabled={true} value={new Date(2019, 0, 1)} />
    );
    fireEvent.click(container.querySelector('input'));
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to navigate between months', () => {
    const { container, unmount } = render(
      <DateField autoFocus={true} value={new Date(2019, 0, 1)} />
    );
    fireEvent.click(container.querySelector('.icon.arrow-left'));
    expect(container).toMatchSnapshot('previous month');
    fireEvent.click(container.querySelector('.icon.arrow-right'));
    expect(container).toMatchSnapshot('next month');
    unmount();
  });

  it('should have a 3 days limited datepicker when min/max is set', () => {
    const previousDay = new Date('December 15, 2019');
    const day = new Date('December 16, 2019');
    const nextDay = new Date('December 17, 2019');
    const { container, unmount } = render(
      <DateField autoFocus={true} min={previousDay} value={day} max={nextDay} />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should not let you pick a disabled date', () => {
    const day = new Date(2019, 11, 16);
    const nextDay = new Date(2019, 11, 17);
    const { container, getByText, unmount } = render(
      <DateField autoFocus={true} min={day} value={nextDay} />
    );

    fireEvent.click(getByText('15'));
    expect(container).toMatchSnapshot();

    unmount();
  });
});
