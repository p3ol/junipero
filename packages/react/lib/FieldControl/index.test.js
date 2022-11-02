import { act, renderHook } from '@testing-library/react';

import { useFieldControl } from '../hooks';
import FieldControl from '.';

describe('useFieldControl()', () => {
  it('should render field control hook', () => {
    const { result } = renderHook(
      () => useFieldControl(), { wrapper: FieldControl }
    );
    expect(
      Object.keys(result.current)
    ).toEqual(
      expect.arrayContaining(['valid', 'dirty', 'focused', 'update'])
    );
  });

  it('should set basic properties', () => {
    const { result } = renderHook(
      () => useFieldControl(), { wrapper: FieldControl }
    );
    expect(result.current.dirty).toBeFalsy();
    expect(result.current.focused).toBeFalsy();
    expect(result.current.valid).toBeTruthy();
  });

  it('should be able to update field control properties ' +
  'from hook', async () => {
    const { result } = renderHook(
      () => useFieldControl(), { wrapper: FieldControl }
    );
    expect(result.current.dirty).toBeFalsy();
    act(() => result.current.update({ dirty: true }));
    expect(result.current.dirty).toBeTruthy();

    expect(result.current.focused).toBeFalsy();
    act(() => result.current.update({ focused: true }));
    expect(result.current.focused).toBeTruthy();

    expect(result.current.valid).toBeTruthy();
    act(() => result.current.update({ valid: false }));
    expect(result.current.valid).toBeFalsy();
  });
});
