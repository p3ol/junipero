import { render } from '@testing-library/react';

import BreadCrumb from './';
import BreadCrumbItem from '../BreadCrumbItem';

describe('<BreadCrumb />', () => {
  it('should render', () => {
    const { container, unmount } = render(<BreadCrumb />);
    expect(container.querySelectorAll('.junipero.breadcrumb').length).toBe(1);
    unmount();
  });

  it('should render a list of breadcrumb items', () => {
    const { getByText, unmount } = render(
      <BreadCrumb>
        <BreadCrumbItem>test</BreadCrumbItem>
        <BreadCrumbItem>secondTest</BreadCrumbItem>
      </BreadCrumb>
    );

    expect(getByText('test')).toBeTruthy();
    expect(getByText('secondTest')).toBeTruthy();

    unmount();
  });

  it('should render a list of breadcrumb items using items prop', () => {
    const { getByText, unmount } = render(
      <BreadCrumb items={['test', 'secondTest']} />
    );

    expect(getByText('test')).toBeTruthy();
    expect(getByText('secondTest')).toBeTruthy();

    unmount();
  });
});
