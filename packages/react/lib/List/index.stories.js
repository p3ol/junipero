import { useState } from 'react';

import List from './';
import ListColumn from '../ListColumn';
import ListItem from '../ListItem';
import ListCell from '../ListCell';

export default { title: 'react/List' };

export const basic = () => (
  <List columns={['name', 'age']}>
    <ListItem item={['John', 25]} />
    <ListItem item={['Jane', 30]} />
  </List>
);

export const verbose = () => (
  <List>
    <ListColumn id="name">Name</ListColumn>
    <ListColumn id="age">Age</ListColumn>

    <ListItem>
      <ListCell>John</ListCell>
      <ListCell>25</ListCell>
    </ListItem>

    <ListItem>
      <ListCell>Jane</ListCell>
      <ListCell>30</ListCell>
    </ListItem>
  </List>
);

export const orderable = () => {
  const [items, setItems] = useState([
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 },
    { name: 'Jack', age: 20 },
  ]);

  const onOrder = ({ column, asc }) => {
    setItems(it => [...it.sort((a, b) => {
      const aVal = a[column];
      const bVal = b[column];
      const result = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;

      return asc ? result : -result;
    })]);
  };

  return (
    <List onOrder={onOrder}>
      <ListColumn id="name">Name</ListColumn>
      <ListColumn id="age">Age</ListColumn>

      { items.map(item => (
        <ListItem key={item.name} item={[item.name, item.age]} />
      )) }
    </List>
  );
};
