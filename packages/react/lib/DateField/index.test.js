import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DateField from './';

describe('<DateField />', () => {
  it('should render', () => {
    const onToggle = jest.fn();
    const { container, unmount } = render(
      <DateField
        value={new Date(2019, 1, 1)}
        placeholder="Date of birth"
        onToggle={onToggle}
      />
    );
    expect(container).toMatchSnapshot('default');
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

  it('should switch to next month when right arrow is clicked', async () => {
    const user = userEvent.setup();
    const currentDay = new Date(2019, 0, 15);
    const { container, getByText, unmount } = render(
      <DateField autoFocus={true} value={currentDay} />
    );
    getByText('January');
    const nextMonthButton = container.querySelector('.arrow-right');
    user.click(nextMonthButton);
    await waitFor(() => expect(getByText('February')));

    unmount();
  });

  it('should switch to previous month when left arrow is clicked', async () => {
    const user = userEvent.setup();
    const currentDay = new Date(2019, 11, 15);
    const { container, getByText, unmount } = render(
      <DateField autoFocus={true} value={currentDay} />
    );
    getByText('December');
    const nextMonthButton = container.querySelector('.arrow-left');
    user.click(nextMonthButton);
    await waitFor(() => expect(getByText('November')));

    unmount();
  });

  it('should switch to next month when right arrow is clicked ' +
  'even if the 31th day is selected', async () => {
    const user = userEvent.setup();
    const currentDay = new Date(2019, 0, 31);
    const { container, getByText, unmount } = render(
      <DateField autoFocus={true} value={currentDay} />
    );
    getByText('January');
    const nextMonthButton = container.querySelector('.arrow-right');
    user.click(nextMonthButton);
    await waitFor(() => expect(getByText('February')));

    unmount();
  });

  it('should switch to previous month when left arrow is clicked ' +
  'even if the 31th day is selected', async () => {
    const user = userEvent.setup();
    const currentDay = new Date(2019, 11, 31);
    const { container, getByText, unmount } = render(
      <DateField autoFocus={true} value={currentDay} />
    );
    getByText('December');
    const nextMonthButton = container.querySelector('.arrow-left');
    user.click(nextMonthButton);
    await waitFor(() => expect(getByText('November')));

    unmount();
  });

  it('should correctly display current month dates', async () => {
    const currentDay = new Date(2019, 0, 15);
    const { getAllByText, unmount } = render(
      <DateField autoFocus={true} value={currentDay} />
    );
    await waitFor(() => expect(getAllByText('31').length).toEqual(2));
    unmount();
  });

  it('should correctly display current month dates', async () => {
    const currentDay = new Date(2019, 0, 15);
    const { unmount, container } = render(
      <DateField autoFocus={true} value={currentDay} />
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
      <DateField autoFocus={true} value={currentDay} />
    );
    expect(
      container.querySelectorAll('.day:not(.inactive)').length
    ).toEqual(31);
    unmount();
  });
});
