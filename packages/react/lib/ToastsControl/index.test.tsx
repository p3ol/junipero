import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';

import { useToasts } from '../hooks';
import ToastsControl from '.';

describe('useToasts()', () => {
  it('should render hook', () => {
    const { result } = renderHook(
      () => useToasts(), { wrapper: ToastsControl }
    );
    expect(
      Object.keys(result.current)
    ).toEqual(expect.arrayContaining(
      ['toasts', 'add', 'dismiss'])
    );
    expect(result.current.toasts).toHaveLength(0);
  });

  it('should be able to add a toast', async () => {
    const customToast = {
      content: <div>coucou</div>,
      lifespan: 3000,
    };
    const { result } = renderHook(() =>
      useToasts(), { wrapper: ToastsControl });
    expect(result.current.toasts).toHaveLength(0);
    await act(async () => { result.current.add(customToast); });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toEqual(customToast);
  });

  it('should be able to dismiss a toast', async () => {
    const customToast = {
      content: <div>coucou</div>,
      lifespan: 3000,
    };
    const { result } = renderHook(() =>
      useToasts(), { wrapper: ToastsControl });
    expect(result.current.toasts).toHaveLength(0);
    await act(async () => { result.current.add(customToast); });
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toEqual(customToast);
    await act(async () => { result.current.dismiss(customToast); });
    expect(result.current.toasts).toHaveLength(0);
  });

  it('should set first state from props', () => {
    const wrapper = ({ children }: { children: ReactNode | JSX.Element }) => (
      <ToastsControl
        toasts={[{ content: '1' }, { content: '2' }, { content: '3' }]}
      >
        { children }
      </ToastsControl>
    );
    const { result } = renderHook(() => useToasts(), { wrapper });
    expect(result.current.toasts).toHaveLength(3);

    expect(result.current.toasts[0].content).toEqual('1');
    expect(result.current.toasts[1].content).toEqual('2');
    expect(result.current.toasts[2].content).toEqual('3');
  });
});
