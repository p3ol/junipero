import { render, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import Tabs from '.';
import Tab from '../Tab';

describe('<Tabs />', () => {
  it('should render', () => {
    const { container, unmount } = render(
      <Tabs><Tab title="Tab 1">Content</Tab></Tabs>
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should fire onToggle event when changing tab', () => {
    const onToggle = vi.fn();
    const { container, getByText, unmount } = render(
      <Tabs onToggle={onToggle}>
        <Tab title="Tab 1">One</Tab>
        <Tab title="Tab 2">Two</Tab>
      </Tabs>
    );
    fireEvent.click(getByText('Tab 2'));
    expect(onToggle).toHaveBeenCalledWith(1);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('shouldn\'t change active tab if tab is disabled', () => {
    const onToggle = vi.fn();
    const { container, getByText, unmount } = render(
      <Tabs onToggle={onToggle}>
        <Tab title="Tab 1">One</Tab>
        <Tab title="Tab 2" disabled={true}>Two</Tab>
      </Tabs>
    );
    fireEvent.click(getByText('Tab 2'));
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to render tabs from prop', () => {
    const onToggle = vi.fn();
    const { container, getByText, unmount } = render(
      <Tabs
        tabs={[
          { title: 'Tab 1', content: 'One' },
          { title: 'Tab 2', content: 'Two' },
        ]}
        onToggle={onToggle}
      />
    );
    expect(container).toMatchSnapshot('First tab');
    fireEvent.click(getByText('Tab 2'));
    expect(onToggle).toHaveBeenCalledWith(1);
    expect(container).toMatchSnapshot('Second tab');
    unmount();
  });
});
