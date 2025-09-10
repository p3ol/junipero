import { useReducer } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { mockState } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import type { FieldContent } from './types';
import TextField from './TextField';

interface State {
  value: {
    text: string;
    content: string[];
  };
}

describe('mockState: inside react', () => {
  it('should correctly update the state and return the new ' +
    'state when using mockState with a callback', async () => {
    const Comp = () => {
      const [state, dispatch] = useReducer(mockState<State>, {
        value: {
          text: 'This is a test',
          content: [],
        },
      });

      useTimeout(() => {
        dispatch(s => ({ value: { ...s.value, content: ['foo'] } }));
      }, 1, []);

      const onTextChange = ({ value }: FieldContent) => {
        dispatch(s => ({ value: { ...s.value, text: value } }));
      };

      const onContentChange = () => {
        dispatch(s => ({
          value: { ...s.value, content: [...s.value.content, 'bar'] },
        }));
      };

      return (
        <div>
          <TextField
            data-testid="Field"
            value={state.value.text}
            onChange={onTextChange}
          />
          <button onClick={onContentChange}>Add content</button>
          <div>Text: { state.value.text }</div>
          <div>Content: { state.value.content.join(', ') }</div>
        </div>
      );
    };

    const { container, unmount } = render(<Comp />);

    fireEvent.change(screen.getByTestId('Field'),
      { target: { value: 'This is a test 2' } });

    await waitFor(() => screen.getByText('Content: foo'));
    expect(container).toMatchSnapshot('With updated text field value');

    fireEvent.click(screen.getByText('Add content'));

    expect(container)
      .toMatchSnapshot('With updated content AND updated text field valud');

    unmount();
  });
});
