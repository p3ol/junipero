import { fireEvent, render } from '@testing-library/react';

import BreadCrumb from '.';
import BreadCrumbItem from '../BreadCrumbItem';

describe('<BreadCrumb />', () => {
  it('should render', () => {
    const { container, unmount } = render(<BreadCrumb />);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render a list of BreadCrumb items', () => {
    const { container, unmount } = render(
      <BreadCrumb>
        <BreadCrumbItem>test</BreadCrumbItem>
        <BreadCrumbItem>secondTest</BreadCrumbItem>
      </BreadCrumb>
    );

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should render a collapsed BreadCrumb', () => {
    const { container, getByText, unmount } = render(
      <BreadCrumb maxItems={3}>
        <BreadCrumbItem>One</BreadCrumbItem>
        <BreadCrumbItem>Two</BreadCrumbItem>
        <BreadCrumbItem>Three</BreadCrumbItem>
        <BreadCrumbItem>Four</BreadCrumbItem>
      </BreadCrumb>
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('...'));

    expect(container).toMatchSnapshot();

    unmount();
  });
});
