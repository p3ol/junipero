import { createRef, useEffect, useReducer, useState } from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { configMocks, mockIntersectionObserver } from 'jsdom-testing-mocks';
import { mockState, cloneDeep, set } from '@junipero/core';
import userEvent from '@testing-library/user-event';

import type { FieldContent } from '../types';
import { blur, focus, reset, sleep } from '../../tests/utils';
import FieldControl from '../FieldControl';
import Label from '../Label';
import Abstract from '../Abstract';
import TextField from '../TextField';
import SelectField, {
  type SelectFieldOptionObject,
  type SelectFieldRef,
} from './index';

configMocks({ act });
const io = mockIntersectionObserver();

describe('<SelectField />', () => {
  it('should render', () => {
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        autoFocus
      />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to render without a placeholder', () => {
    // Render may fail as we use placeholder length to set size of input
    // which shouldn't be 0 (and can be if placeholder is not provided)
    const { unmount, container } = render(
      <SelectField options={['Item 1', 'Item 2', 'Item 3']} />
    );
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to clear a single value', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        value="Item 1"
        options={['Item 1', 'Item 2', 'Item 3']}
      />
    );
    expect(container).toMatchSnapshot();

    // Waiting for refocus timeout before generating snapshot
    await user.click(container.querySelector('.icons .remove'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should render multiple values', () => {
    const { unmount, container, getByText } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        value={['Item 1', 'Item 2']}
        multiple
        autoFocus
      />
    );
    expect(container).toMatchSnapshot();

    // Remove item 2
    fireEvent.click(getByText('Item 2').parentNode.querySelector('.remove'));
    expect(container).toMatchSnapshot();

    // Add item 3
    fireEvent.click(container.querySelector('input'));
    fireEvent.click(getByText('Item 3'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to clear multiple values at once', () => {
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        value={['Item 1', 'Item 2']}
        multiple
        autoFocus
      />
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(container.querySelector('.icons .remove'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should be invalid if validation fails', async () => {
    const ref = createRef<SelectFieldRef>();
    const { unmount, container, getByText } = render(
      <SelectField
        ref={ref}
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        onValidate={() => false}
        autoFocus
      />
    );

    fireEvent.click(getByText('Item 1'));
    await blur(ref.current);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to reset the field', async () => {
    const user = userEvent.setup();
    const ref = createRef<SelectFieldRef>();
    const onChange = vi.fn();
    const { unmount, container, getByText } = render(
      <SelectField
        ref={ref}
        value="John"
        options={['John', 'David']}
        onChange={onChange}
      />
    );

    const input = container.querySelector('input');
    await user.click(input);
    await user.click(getByText('David'));
    await blur(ref.current);

    expect(container).toMatchSnapshot();
    expect(onChange)
      .toHaveBeenLastCalledWith(expect.objectContaining({ value: 'David' }));

    await reset(ref.current);
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to be used with a FieldControl', async () => {
    const user = userEvent.setup();
    const { unmount, container, getByText } = render(
      <FieldControl>
        <Label htmlFor="name">Name</Label>
        <SelectField
          id="name"
          placeholder="Name"
          value="Marc"
          onValidate={() => false}
          options={['Marc', 'Linda']}
        />
        <Abstract>Enter your name</Abstract>
      </FieldControl>
    );

    const input = container.querySelector('input');
    await user.click(input);
    await user.click(getByText('Linda'));

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should not allow to change value when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { unmount, container, queryByText } = render(
      <SelectField
        value="Marc"
        options={['Marc', 'Linda']}
        onChange={onChange}
        disabled
      />
    );

    const input = container.querySelector('input');
    await user.click(input);

    expect(queryByText('Linda')).toBeFalsy();

    expect(onChange).not.toHaveBeenCalled();
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to search for an existing value', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        searchThreshold={0}
        autoFocus
      />
    );

    await user.type(container.querySelector('input'), 'Item 3');
    // Cannot use .useFakeTimers() as user.type uses timers :/
    await sleep(1);

    expect(container).toMatchSnapshot();

    await user.clear(container.querySelector('input'));
    await sleep(1);
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to search for an external value', async () => {
    const user = userEvent.setup();
    const { unmount, container, getByText } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        searchThreshold={0}
        onSearch={() => Promise.resolve(['Item 4'])}
        autoFocus
      />
    );

    await user.type(container.querySelector('input'), 'Item');
    // Cannot use .useFakeTimers() as user.type uses timers :/
    await sleep(1);
    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('Item 4'));
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow arbitrary values', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        allowArbitraryItems
        autoFocus
        multiple
      />
    );

    const input = container.querySelector('input');
    await user.type(input, 'Item 4{enter}');

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to delete items when hitting backspace', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2', 'Item 3']}
        value={['Item 1', 'Item 2', 'Item 4']}
        multiple
        autoFocus
      />
    );

    await user.click(container.querySelector('input'));

    // Select item 4
    await user.keyboard('{Backspace}');
    expect(container).toMatchSnapshot();

    // Remove item 4
    await user.keyboard('{Backspace}');
    expect(container).toMatchSnapshot();

    // Move to item 2
    await user.keyboard('{ArrowLeft}');
    expect(container).toMatchSnapshot();

    // Move to item 1
    await user.keyboard('{ArrowLeft}');
    expect(container).toMatchSnapshot();

    // Move back to item 2
    await user.keyboard('{ArrowRight}');
    expect(container).toMatchSnapshot();

    // Unselect any item
    await user.keyboard('{ArrowRight}');
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should not remove field previous values while hitting ' +
    'backspace, if search isnt empty', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        options={['Item 1', 'Item 2']}
        value={['Item 1']}
        multiple={true}
      />
    );

    await user.click(container.querySelector('input'));

    await user.type(container.querySelector('input'), 'Item');
    // Cannot use .useFakeTimers() as user.type uses timers :/
    await sleep(1);
    expect(container).toMatchSnapshot();

    // Remove 'Item' written text without removing previous values
    await Promise.all(
      Array.from({ length: 4 }).map(() => user.keyboard('{BackSpace}'))
    );
    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should allow to use object options and display custom titles on a ' +
    'controlled field', async () => {
    const user = userEvent.setup();

    const ControlledField = () => {
      const [value, setValue] = useState('Item 1');

      return (
        <>
          <p>Value: { value }</p>
          <SelectField
            value={value}
            placeholder="Type a name"
            options={[
              'Item 1',
              'Item 2',
              { title: 'Item 3', value: 'item-3' },
            ]}
            parseTitle={o => '' + ((o as SelectFieldOptionObject).title || o)}
            parseValue={o => (o as SelectFieldOptionObject).value || o}
            onChange={(field: FieldContent<string>) => setValue(field.value)}
          />
        </>
      );
    };

    const { unmount, container, getByText } = render(<ControlledField />);

    const input = container.querySelector('input');
    await user.click(input);
    await user.click(getByText('Item 3'));

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should correctly update state values', async () => {
    const user = userEvent.setup();
    const options = ['Item 1', 'Item 2', 'Item 3'];

    interface FormState {
      form: {
        name?: string;
        config?: {
          test?: number;
        };
      };
      dirty?: boolean;
    }

    const Form = () => {
      const [state, dispatch] = useReducer(mockState<FormState>, {
        form: {},
      });

      useEffect(() => {
        const newForm = cloneDeep({ name: 'Test' });
        dispatch({ form: newForm });
      }, []);

      const onChange = (name: string, field: FieldContent) => {
        set(state.form, name, field.value);
        dispatch({ form: state.form, dirty: true });
      };

      return (
        <>
          <FieldControl>
            <Label className="info">
              Test
            </Label>
            <TextField
              id="textfield"
              value={state.form.name || ''}
              onChange={onChange.bind(null, 'name')}
              placeholder="Test"
            />
          </FieldControl>
          <SelectField
            id="selectfield"
            value={state.form.config?.test || 1}
            options={options}
            onChange={onChange.bind(null, 'config.test')}
          />
        </>
      );
    };

    const { container, getByText, unmount } = render(<Form />);

    await user.type(container.querySelector('#textfield'), '123');
    await user.click(container.querySelector('#selectfield input'));
    await user.click(getByText('Item 3'));

    expect(container).toMatchSnapshot();

    unmount();
  });

  it('should toggle on click if enabled', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        toggleClick={true}
        options={['Item 1', 'Item 2', 'Item 3']}
      />
    );
    await user.click(container.querySelector('.dropdown-toggle'));
    expect(container).toMatchSnapshot('opened');
    await user.click(container.querySelector('.dropdown-toggle'));
    expect(container).toMatchSnapshot('closed');
    unmount();
  });

  it('should toggle on click if not searchable', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        searchable={false}
        options={['Item 1', 'Item 2', 'Item 3']}
      />
    );
    await user.click(container.querySelector('.dropdown-toggle'));
    expect(container).toMatchSnapshot('opened');
    await user.click(container.querySelector('.dropdown-toggle'));
    expect(container).toMatchSnapshot('closed');
    unmount();
  });

  it('should not toggle on click if disabled', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        toggleClick={false}
        options={['Item 1', 'Item 2', 'Item 3']}
      />
    );
    await user.click(container.querySelector('.dropdown-toggle'));
    expect(container).toMatchSnapshot('opened');
    await user.click(container.querySelector('.dropdown-toggle'));
    expect(container).toMatchSnapshot('still opened');
    unmount();
  });

  it('should not toggle on click if searchable', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        searchable={true}
        options={['Item 1', 'Item 2', 'Item 3']}
      />
    );
    await user.click(container.querySelector('.dropdown-toggle'));
    expect(container).toMatchSnapshot('opened');
    await user.click(container.querySelector('.dropdown-toggle'));
    expect(container).toMatchSnapshot('still opened');
    unmount();
  });

  it('should toggle on keyboard if enabled', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        toggleClick={true}
        keyboardHandler={true}
        options={['Item 1', 'Item 2', 'Item 3']}
      />
    );
    await user.click(container.querySelector('.dropdown-toggle'));
    container.querySelector<HTMLDivElement>('.dropdown-toggle').focus();
    expect(container).toMatchSnapshot('opened');
    await user.keyboard('{Enter}');
    expect(container).toMatchSnapshot('closed');
    await user.keyboard('{Enter}');
    expect(container).toMatchSnapshot('back opened');
    unmount();
  });

  // Node 20.19.x seems to have an issue with jsdom & blur
  it.skip('should add a value when focus out if' +
    ' allowArbitraryItems is true', async () => {
    const user = userEvent.setup();
    const { unmount, container } = render(
      <SelectField
        placeholder="Type a name"
        allowArbitraryItems={true}
        multiple={true}
      />
    );
    const input = container.querySelector('input');
    await focus(input);
    await user.type(input, 'Item 4');
    await blur(input);

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should allow to load more data on scroll', async () => {
    const Form = () => {
      const [options, setOptions] = useState<string[]>(
        Array.from({ length: 10 }).map((_, i) => `Item ${i + 1}`)
      );

      const onLoadMore = async (page: number) => {
        if (page <= 2) {
          await new Promise(resolve => setTimeout(resolve, 10));
          setOptions(o => o.concat(
            Array
              .from({ length: 10 })
              .map((_, i) => `Item ${i + o.length + 1}`)
          ));
        }
      };

      return (
        <SelectField
          placeholder="Type a name"
          options={options}
          onLoadMore={onLoadMore}
          hasMore={options.length < 20}
        />
      );
    };

    const { unmount, container } = render(<Form />);

    fireEvent.click(container.querySelector('input'));

    expect(container).toMatchSnapshot('Before scroll');

    fireEvent.scroll(container.querySelector('.menu-inner'), {
      target: { scrollTop: 10000 },
    });
    io.enterNode(container.querySelector('.load-more'));

    expect(container).toMatchSnapshot('During scroll');

    await sleep(20);

    expect(container).toMatchSnapshot('After scroll');

    unmount();
    io.cleanup();
  });

  it('should select value with keyboard', async () => {
    const user = userEvent.setup();
    const onChangeMock = vi.fn();
    const { unmount, container } = render(
      <SelectField
        placeholder="Name"
        onChange={onChangeMock}
        options={['Item 1', 'Item 2', 'Item 3']}
      />
    );
    await user.click(container.querySelector('.dropdown-toggle'));
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{ArrowDown}');
    expect(container).toMatchSnapshot('opened');
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(onChangeMock)
        .toHaveBeenCalledWith({ valid: true, value: 'Item 2' })
    );
    expect(container).toMatchSnapshot('closed');
    unmount();
  });
});
