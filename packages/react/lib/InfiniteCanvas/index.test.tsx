import { createRef } from 'react';
import { act, render } from '@testing-library/react';

import InfiniteCanvas, { type InfiniteCanvasRef } from '.';

describe('<InfiniteCanvas />', () => {
  it('should render an infinite canvas', () => {
    const { container, unmount } = render(
      <InfiniteCanvas background={{ patternId: 'dots' }}>
        <div style={{ width: '1000px', height: '1000px' }}>Content</div>
      </InfiniteCanvas>
    );

    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should center on a given element', async () => {
    const ref = createRef<InfiniteCanvasRef>();
    const targetRef = createRef<HTMLDivElement>();
    const { container, unmount } = render(
      <InfiniteCanvas ref={ref} center={false}>
        <div style={{ width: '2000px', height: '2000px' }}>Content</div>
        <div ref={targetRef}>Target</div>
      </InfiniteCanvas>
    );

    Object
      .defineProperty(ref.current.innerRef.current, 'getBoundingClientRect', {
        value: () => ({ width: 1000, height: 800 }),
      });
    Object.defineProperty(targetRef.current, 'offsetLeft', { value: 1000 });
    Object.defineProperty(targetRef.current, 'offsetTop', { value: 500 });
    Object.defineProperty(targetRef.current, 'offsetWidth', { value: 100 });
    Object.defineProperty(targetRef.current, 'offsetHeight', { value: 50 });

    await act(async () => ref.current?.centerOn(targetRef.current, 0));

    expect(ref.current?.zoom).not.toBe(1);
    expect(container).toMatchSnapshot();
    unmount();
  });

  it('should not crash when centering on a null element', async () => {
    const ref = createRef<InfiniteCanvasRef>();
    const { unmount } = render(
      <InfiniteCanvas ref={ref}>
        <div style={{ width: '1000px', height: '1000px' }}>Content</div>
      </InfiniteCanvas>
    );

    await act(async () => ref.current?.centerOn(null, 0));

    expect(ref.current?.zoom).toBe(1);
    unmount();
  });

  it('should not crash when content width/height is zero', async () => {
    const ref = createRef<InfiniteCanvasRef>();
    const { unmount } = render(
      <InfiniteCanvas ref={ref}>
        <div style={{ width: '0px', height: '0px' }}>Content</div>
      </InfiniteCanvas>
    );

    await act(async () => ref.current?.fitIntoView(0));

    expect(ref.current?.zoom).toBe(1);
    unmount();
  });
});
