import { useState } from 'react';

import Card from '../Card';
import Droppable from '../Droppable';
import Draggable from '.';

export default { title: 'react/Draggable' };

const Item = ({ name }: { name: string}) => (
  <Draggable data={{ name }}>
    <Card>{ name }</Card>
  </Draggable>
);

export const Basic = () => {
  const [items, setItems] = useState([]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ marginRight: 20 }}>
        { ['Item 1', 'Item 2', 'Item 3'].map((name, i) => (
          <Item key={i} name={name} />
        )) }
      </div>
      <Droppable onDrop={(data: any) => setItems([...items, data])}>
        <div style={{ padding: 20, border: '1px solid #ccc' }}>
          { items.map((item, i) => <div key={i}>{ item.name }</div>) }
        </div>
      </Droppable>
    </div>
  );
};
