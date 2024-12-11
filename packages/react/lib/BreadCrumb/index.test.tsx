import { fireEvent, render } from '@testing-library/react';

import BreadCrumbItem from '../BreadCrumbItem';
import BreadCrumb from '.';

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

  it('should allow to conditionnaly add items inside fragments', () => {
    const { container, getByText, unmount } = render(
      <BreadCrumb maxItems={3}>
        <BreadCrumbItem>One</BreadCrumbItem>
        <BreadCrumbItem>Two</BreadCrumbItem>
        <>
          <BreadCrumbItem>Three</BreadCrumbItem>
          <BreadCrumbItem>Four</BreadCrumbItem>
        </>
      </BreadCrumb>
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('...'));

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to render from items prop', () => {
    const { container, unmount } = render(
      <BreadCrumb items={['One', 'Two', 'Three']} />
    );

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to render from items prop with maxItems', () => {
    const { container, getByText, unmount } = render(
      <BreadCrumb items={['One', 'Two', 'Three', 'Four']} maxItems={3} />
    );

    expect(container).toMatchSnapshot('Collapsed');

    fireEvent.click(getByText('...'));

    expect(container).toMatchSnapshot('Opened');

    unmount();
  });
});
