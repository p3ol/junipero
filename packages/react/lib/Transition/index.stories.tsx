import { useReducer } from 'react';
import { mockState } from '@junipero/core';

import Button from '../Button';
import Label from '../Label';
import TextField, { TextFieldChangeEvent } from '../TextField';
import Transition from '.';

export default { title: 'react/Transition' };

export const basic = () => {
  const [state, dispatch] = useReducer(mockState, {
    enabled: false,
    timeout: 100,
  });

  return (
    <>
      <div>
        <Label>Timeout (in ms)</Label>
        <TextField
          value={state.timeout}
          onChange={
            (e: TextFieldChangeEvent) => dispatch({ timeout: Number(e.value) })
          }
        />
      </div>
      <p>
        <Button
          onClick={() => dispatch({ enabled: !state.enabled })}
        >
          Toggle animation
        </Button>
      </p>
      <Transition
        in={state.enabled}
        timeout={state.timeout}
        name="jp-slide-in-down-menu"
      >
        <div>Text</div>
      </Transition>
    </>
  );
};
