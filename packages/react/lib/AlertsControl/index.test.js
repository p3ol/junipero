import { renderHook } from '@testing-library/react';

import { useAlerts } from '../hooks';
import AlertsControl from '.';

describe('useAlerts()', () => {
  it('should render hook', () => {
    const { result } = renderHook(
      () => useAlerts(), { wrapper: AlertsControl }
    );
    expect(
      Object.keys(result.current)
    ).toEqual(expect.arrayContaining(
      ['alerts', 'add', 'dismiss'])
    );
    expect(result.current.alerts).toHaveLength(0);
  });

  it('should be able to add alert', () => {
    const customAlert = {
      content: <div>coucou</div>,
      duration: 3000,
      index: 1,
    };
    const { result } = renderHook(
      () => useAlerts(), { wrapper: AlertsControl }
    );
    expect(result.current.alerts).toHaveLength(0);
    result.current.add(customAlert);
    expect(result.current.alerts).toHaveLength(1);
    expect(result.current.alerts[0]).toEqual(customAlert);
  });

  it('should be able to dismiss alert', () => {
    const customAlert = {
      content: <div>coucou</div>,
      duration: 3000,
      index: 1,
    };
    const { result } = renderHook(
      () => useAlerts(), { wrapper: AlertsControl }
    );
    expect(result.current.alerts).toHaveLength(0);
    result.current.add(customAlert);
    expect(result.current.alerts).toHaveLength(1);
    expect(result.current.alerts[0]).toEqual(customAlert);
    result.current.dismiss(0);
    expect(result.current.alerts).toHaveLength(0);
  });

  it('should set first state from props', () => {
    const wrapper = ({ children }) => (
      <AlertsControl
        alerts={[{ content: '1' }, { content: '2' }, { content: '3' }]}
      >
        {children}
      </AlertsControl>
    );
    const { result } = renderHook(() => useAlerts(), { wrapper });
    expect(result.current.alerts).toHaveLength(3);

    expect(result.current.alerts[0].content).toEqual('1');
    expect(result.current.alerts[1].content).toEqual('2');
    expect(result.current.alerts[2].content).toEqual('3');
  });
});
