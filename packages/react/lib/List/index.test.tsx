import { useState } from 'react';
import { fireEvent, render } from '@testing-library/react';

import List from '.';
import ListItem from '../ListItem';
import ListColumn from '../ListColumn';
import ListCell from '../ListCell';

describe('<List />', () => {
  it('should render using props', () => {
    const { container, unmount } = render(
      <List columns={['name', 'age']}>
        <ListItem item={['John', 25]} />
        <ListItem item={['Jane', 30]} />
      </List>
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should render using children', () => {
    const { container, unmount } = render(
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
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to reorder content', () => {
    const Comp = () => {
      const [items, setItems] = useState([
        { name: 'John', age: 25 },
        { name: 'Jane', age: 30 },
        { name: 'Jack', age: 20 },
      ]);

      const onOrder = (
        { column, asc }: { asc?: boolean, column: string | number}
      ) => {
        setItems(it => [...it.sort((a, b) => {
          const aVal = a[column as 'name' | 'age'];
          const bVal = b[column as 'name' | 'age'];
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

    const { container, getByText, unmount } = render(<Comp />);
    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('Name'));
    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('Name'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to handle order state from outside', () => {
    const Comp = () => {
      const [order, setOrder] = useState<{
        column: string | number;
        asc: boolean;
      }>({ column: 'name', asc: false });

      const [items, setItems] = useState([
        { name: 'John', age: 25 },
        { name: 'Jane', age: 30 },
        { name: 'Jack', age: 20 },
      ]);

      const onOrder = (
        { column, asc }: { asc?: boolean, column: string | number}
      ) => {
        setOrder({ column, asc });
        setItems(it => [...it.sort((a, b) => {
          const aVal = a[column as 'name' | 'age'];
          const bVal = b[column as 'name' | 'age'];
          const result = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;

          return asc ? result : -result;
        })]);
      };

      return (
        <List onOrder={onOrder} order={order}>
          <ListColumn id="name">Name</ListColumn>
          <ListColumn id="age">Age</ListColumn>

          { items.map(item => (
            <ListItem key={item.name} item={[item.name, item.age]} />
          )) }
        </List>
      );
    };

    const { container, getByText, unmount } = render(<Comp />);

    fireEvent.click(getByText('Name'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to disable order on column', () => {
    const Comp = () => {
      const [items] = useState([
        { name: 'John', age: 25 },
        { name: 'Jane', age: 30 },
        { name: 'Jack', age: 20 },
      ]);

      return (
        <List onOrder={() => {}}>
          <ListColumn id="name" orderable={false}>Name</ListColumn>
          <ListColumn id="age">Age</ListColumn>

          { items.map(item => (
            <ListItem key={item.name} item={[item.name, item.age]} />
          )) }
        </List>
      );
    };

    const { container, getByText, unmount } = render(<Comp />);

    fireEvent.click(getByText('Name'));
    expect(container).toMatchSnapshot();

    unmount();
  });
});
