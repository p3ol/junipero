import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Calendar from '.';

describe('<Calendar />', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <Calendar active={new Date(2019, 1, 1)} />
    );
    expect(container).toMatchSnapshot('default');
    unmount();
  });

  it('should allow to navigate between months', () => {
    const { container, unmount } = render(
      <Calendar active={new Date(2019, 0, 1)} />
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
      <Calendar min={previousDay} active={day} max={nextDay} />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should not let you pick a disabled date', () => {
    const day = new Date(2019, 11, 16);
    const nextDay = new Date(2019, 11, 17);
    const onSelect = jest.fn();
    const { container, getByText, unmount } = render(
      <Calendar min={day} active={nextDay} onSelect={onSelect} />
    );

    fireEvent.click(getByText('15'));
    expect(container).toMatchSnapshot();
    expect(onSelect).not.toHaveBeenCalled();

    unmount();
  });

  it('should switch to next month when right arrow is clicked ' +
    'even if the 31st day is selected', async () => {
    const user = userEvent.setup();
    const currentDay = new Date(2019, 0, 31);
    const { container, getByText, unmount } = render(
      <Calendar active={currentDay} />
    );
    getByText('January');
    const nextMonthButton = container.querySelector('.arrow-right');
    user.click(nextMonthButton);
    await waitFor(() => expect(getByText('February')));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should switch to previous month when left arrow is clicked ' +
    'even if the 31th day is selected', async () => {
    const user = userEvent.setup();
    const currentDay = new Date(2019, 11, 31);
    const { container, getByText, unmount } = render(
      <Calendar active={currentDay} />
    );
    getByText('December');
    const nextMonthButton = container.querySelector('.arrow-left');
    user.click(nextMonthButton);
    await waitFor(() => expect(getByText('November')));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should correctly display current month dates', async () => {
    const currentDay = new Date(2019, 0, 15);
    const { getAllByText, unmount } = render(
      <Calendar active={currentDay} />
    );
    await waitFor(() => expect(getAllByText('31').length).toEqual(2));
    unmount();
  });

  it('should correctly display current month dates', async () => {
    const currentDay = new Date(2019, 0, 15);
    const { unmount, container } = render(
      <Calendar active={currentDay} />
    );
    expect(
      container.querySelectorAll('.day:not(.inactive)').length
    ).toEqual(31);
    unmount();
  });

  it('should correctly display current month dates ' +
  'even if the 31th day is selected', async () => {
    const currentDay = new Date(2019, 0, 31);
    const { unmount, container } = render(
      <Calendar active={currentDay} />
    );
    expect(
      container.querySelectorAll('.day:not(.inactive)').length
    ).toEqual(31);
    unmount();
  });
});
