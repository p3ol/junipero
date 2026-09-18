import { type DragEvent, useCallback, useState } from 'react';

import Card from '../Card';
import Droppable, { type DraggingPositionType } from '../Droppable';
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

type Item = { name: string; items: Item[] };

interface DroppableItemProps {
  item: Item;
  onDrop: (
    target: Item,
    containerPath: string | undefined,
    data: Item,
    position: DraggingPositionType,
    e: DragEvent<HTMLDivElement>
  ) => void;
}

const DroppableItem = ({ item, onDrop }: DroppableItemProps) => (
  <Droppable onDrop={onDrop.bind(null, item, undefined)}>
    <Draggable
      data={item}
      onDrag={e => e.stopPropagation()}
      onDragStart={e => e.stopPropagation()}
      onDragEnd={e => e.stopPropagation()}
    >
      <Card>
        <div>{ item.name }</div>
        <Droppable onDrop={onDrop.bind(null, item, 'items')}>
          <div className="p-4 rounded-xl bg-velvet-background">
            { item.items.map((childItem, i) => (
              <DroppableItem key={i} item={childItem} onDrop={onDrop} />
            )) }
          </div>
        </Droppable>
      </Card>
    </Draggable>
  </Droppable>
);

export const Nested = () => {
  const [items, setItems] = useState<Item[]>([
    { name: 'Item 1', items: [] },
    { name: 'Item 3', items: [
      { name: 'Item 2', items: [] },
    ] },
  ]);

  const removeItemByName = useCallback((name: string, parent?: Item[]): Item | undefined => {
    const container = parent ?? items;

    for (let i = 0; i < container.length; i++) {
      if (container[i].name === name) {
        return container.splice(i, 1)[0];
      }

      const found = removeItemByName(name, container[i].items);

      if (found) {
        return found;
      }
    }
  }, [items]);

  const onDrop = useCallback((
    target: Item,
    containerPath: string | undefined,
    data: Item,
    position: DraggingPositionType,
    e: DragEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();

    if (target.name === data.name) {
      return;
    }

    removeItemByName(data.name, items);

    const container = containerPath ? target[containerPath as keyof Item] as Item[] : items;
    const targetIndex = container.findIndex(item => item.name === target.name);

    if (typeof targetIndex === 'undefined' || targetIndex === -1) {
      container.push(data);
    } else {
      container.splice(position === 'before' ? targetIndex : targetIndex + 1, 0, data);
    }

    setItems([...items]);
  }, [removeItemByName, items]);

  return (
    <div className="flex flex-col gap-2">
      { items.map((item, i) => (
        <div key={i}>
          <DroppableItem item={item} onDrop={onDrop} />
        </div>
      )) }
    </div>
  );
};
