import { createRef, useState } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Tag from './index';

describe('<Tag />', () => {
  it('should render', () => {
    const ref = createRef();
    const { unmount, container } = render(<Tag ref={ref}>New</Tag>);
    expect(container).toMatchSnapshot();
    expect(ref.current.isJunipero).toBe(true);
    expect(ref.current.innerRef.current).toBe(container.firstChild);
    unmount();
  });

  it('should be deletable', async () => {
    const Comp = () => {
      const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

      const onDelete = item => {
        setItems(items.filter(i => i !== item));
      };

      return items.map(item => (
        <Tag key={item} onDelete={onDelete.bind(null, item)}>{ item }</Tag>
      ));
    };

    const user = userEvent.setup();
    const { unmount, container } = render(<Comp />);
    expect(container).toMatchSnapshot();

    await user.click(container.querySelector('.tag:first-child .delete'));
    expect(container).toMatchSnapshot();

    unmount();
  });
});
