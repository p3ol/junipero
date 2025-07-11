import { useState } from 'react';
import { action } from 'storybook/actions';

import Tag from './index';

export default { title: 'react/Tag' };

export const Basic = () => (
  <>
    <Tag>Default</Tag>
    <Tag className="primary">Primary</Tag>
    <Tag className="danger">Danger</Tag>
    <Tag className="warning">Warning</Tag>
    <Tag className="success">Success</Tag>
  </>
);

export const Smaller = () => (
  <>
    <Tag className="info">Default</Tag>
    <Tag className="info primary">Primary</Tag>
    <Tag className="info danger">Danger</Tag>
    <Tag className="info warning">Warning</Tag>
    <Tag className="info success">Success</Tag>
  </>
);

export const Deletable = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  const onDelete = (item: string) => {
    action('onDelete')(item);
    setItems(items.filter(i => i !== item));
  };

  return items.map(item => (
    <Tag key={item} onDelete={onDelete.bind(null, item)}>
      { item }
    </Tag>
  ));
};
