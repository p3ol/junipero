import { createRef, useState } from 'react';
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

  it('should not loop infinitely when onZoom/onPan are not memoized ' +
    'by the consumer', () => {
    const Wrapper = () => {
      const [, setZoom] = useState(1);
      const [, setOffset] = useState({ x: 0, y: 0 });

      return (
        <InfiniteCanvas
          onZoom={zoom => setZoom(zoom)}
          onPan={(offsetX, offsetY) => setOffset({ x: offsetX, y: offsetY })}
        >
          <div style={{ width: '100px', height: '100px' }}>Content</div>
        </InfiniteCanvas>
      );
    };

    expect(() => render(<Wrapper />)).not.toThrow();
  });

  it('should honor initial zoom/offset instead of auto-fitting into ' +
    'view', () => {
    const ref = createRef<InfiniteCanvasRef>();
    const { unmount } = render(
      <InfiniteCanvas
        ref={ref}
        initialZoom={2}
        initialOffsetX={50}
        initialOffsetY={30}
      >
        <div style={{ width: '100px', height: '100px' }}>Content</div>
      </InfiniteCanvas>
    );

    expect(ref.current?.zoom).toBe(2);
    expect(ref.current?.offsetX).toBe(50);
    expect(ref.current?.offsetY).toBe(30);
    unmount();
  });

  it('should still auto-fit into view when center is explicitly ' +
    'enabled, even with initial zoom/offset provided', () => {
    const ref = createRef<InfiniteCanvasRef>();
    const { unmount } = render(
      <InfiniteCanvas
        ref={ref}
        center
        initialZoom={2}
        initialOffsetX={50}
        initialOffsetY={30}
      >
        <div style={{ width: '100px', height: '100px' }}>Content</div>
      </InfiniteCanvas>
    );

    expect(ref.current?.offsetX).not.toBe(50);
    expect(ref.current?.offsetY).not.toBe(30);
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

  it('should take absolutely positioned children into account when ' +
    'fitting into view', async () => {
    const ref = createRef<InfiniteCanvasRef>();
    const normalRef = createRef<HTMLDivElement>();
    const absoluteRef = createRef<HTMLDivElement>();
    const { unmount } = render(
      <InfiniteCanvas ref={ref} center={false}>
        <div ref={normalRef}>Normal</div>
        <div ref={absoluteRef} style={{ position: 'absolute' }}>
          Absolute
        </div>
      </InfiniteCanvas>
    );

    Object
      .defineProperty(ref.current.innerRef.current, 'getBoundingClientRect', {
        value: () => ({ width: 1000, height: 800 }),
      });
    Object.defineProperty(normalRef.current, 'offsetLeft', { value: 0 });
    Object.defineProperty(normalRef.current, 'offsetTop', { value: 0 });
    Object.defineProperty(normalRef.current, 'offsetWidth', { value: 100 });
    Object.defineProperty(normalRef.current, 'offsetHeight', { value: 50 });
    Object.defineProperty(absoluteRef.current, 'offsetLeft', { value: 2000 });
    Object.defineProperty(absoluteRef.current, 'offsetTop', { value: 1000 });
    Object
      .defineProperty(absoluteRef.current, 'offsetWidth', { value: 100 });
    Object
      .defineProperty(absoluteRef.current, 'offsetHeight', { value: 50 });

    await act(async () => ref.current?.fitIntoView(0));

    // Bounds span from (0, 0) to (2100, 1050) so the canvas zooms out far
    // more than it would if only the normal-flow child was considered
    expect(ref.current?.zoom).toBeCloseTo(0.37, 2);
    unmount();
  });

  it('should account for padding (e.g. reserved sidebar space) when ' +
    'fitting into view', async () => {
    const ref = createRef<InfiniteCanvasRef>();
    const childRef = createRef<HTMLDivElement>();
    const { unmount } = render(
      <InfiniteCanvas
        ref={ref}
        center={false}
        centerMargin={0}
        padding={{ left: 200, right: 100, bottom: 200 }}
      >
        <div ref={childRef}>Content</div>
      </InfiniteCanvas>
    );

    Object
      .defineProperty(ref.current.innerRef.current, 'getBoundingClientRect', {
        value: () => ({ width: 1000, height: 800 }),
      });
    Object.defineProperty(childRef.current, 'offsetLeft', { value: 0 });
    Object.defineProperty(childRef.current, 'offsetTop', { value: 0 });
    Object.defineProperty(childRef.current, 'offsetWidth', { value: 100 });
    Object.defineProperty(childRef.current, 'offsetHeight', { value: 50 });

    await act(async () => ref.current?.fitIntoView(0));

    // Visible area is 700x600 (canvas minus padding), centered at (550, 300)
    // instead of the full canvas center (500, 400)
    expect(ref.current?.zoom).toBe(7);
    expect(ref.current?.offsetX).toBe(200);
    expect(ref.current?.offsetY).toBe(125);
    unmount();
  });

  it('should account for padding when centering on an element', async () => {
    const ref = createRef<InfiniteCanvasRef>();
    const targetRef = createRef<HTMLDivElement>();
    const { unmount } = render(
      <InfiniteCanvas
        ref={ref}
        center={false}
        centerMargin={0}
        padding={{ left: 200, right: 100, bottom: 200 }}
      >
        <div ref={targetRef}>Target</div>
      </InfiniteCanvas>
    );

    Object
      .defineProperty(ref.current.innerRef.current, 'getBoundingClientRect', {
        value: () => ({ width: 1000, height: 800 }),
      });
    Object.defineProperty(targetRef.current, 'offsetLeft', { value: 0 });
    Object.defineProperty(targetRef.current, 'offsetTop', { value: 0 });
    Object.defineProperty(targetRef.current, 'offsetWidth', { value: 100 });
    Object.defineProperty(targetRef.current, 'offsetHeight', { value: 50 });

    await act(async () => ref.current?.centerOn(targetRef.current, 0));

    expect(ref.current?.zoom).toBe(7);
    expect(ref.current?.offsetX).toBe(200);
    expect(ref.current?.offsetY).toBe(125);
    unmount();
  });

  it('should ignore children bounds when fitAbsolute is disabled', async () => {
    const ref = createRef<InfiniteCanvasRef>();
    const absoluteRef = createRef<HTMLDivElement>();
    const { unmount } = render(
      <InfiniteCanvas ref={ref} center={false} fitAbsolute={false}>
        <div ref={absoluteRef} style={{ position: 'absolute' }}>
          Absolute
        </div>
      </InfiniteCanvas>
    );

    Object
      .defineProperty(ref.current.innerRef.current, 'getBoundingClientRect', {
        value: () => ({ width: 1000, height: 800 }),
      });
    Object.defineProperty(absoluteRef.current, 'offsetLeft', { value: 2000 });
    Object.defineProperty(absoluteRef.current, 'offsetTop', { value: 1000 });
    Object
      .defineProperty(ref.current.contentRef.current, 'scrollWidth', {
        value: 100,
      });
    Object
      .defineProperty(ref.current.contentRef.current, 'scrollHeight', {
        value: 50,
      });

    await act(async () => ref.current?.fitIntoView(0));

    // Falls back to the content container's own scrollWidth/scrollHeight,
    // so the far away absolute child is not taken into account
    expect(ref.current?.zoom).toBeCloseTo(1.23, 2);
    unmount();
  });

  it('should not account for absolutely positioned grandchildren nested ' +
    'inside a non-absolute wrapper', async () => {
    const ref = createRef<InfiniteCanvasRef>();
    const wrapperRef = createRef<HTMLDivElement>();
    const nestedRef = createRef<HTMLDivElement>();
    const { unmount } = render(
      <InfiniteCanvas ref={ref} center={false}>
        <div ref={wrapperRef}>
          <div ref={nestedRef} style={{ position: 'absolute' }}>
            Nested
          </div>
        </div>
      </InfiniteCanvas>
    );

    Object
      .defineProperty(ref.current.innerRef.current, 'getBoundingClientRect', {
        value: () => ({ width: 1000, height: 800 }),
      });
    Object.defineProperty(wrapperRef.current, 'offsetLeft', { value: 0 });
    Object.defineProperty(wrapperRef.current, 'offsetTop', { value: 0 });
    Object.defineProperty(wrapperRef.current, 'offsetWidth', { value: 100 });
    Object.defineProperty(wrapperRef.current, 'offsetHeight', { value: 50 });
    Object.defineProperty(nestedRef.current, 'offsetLeft', { value: 2000 });
    Object.defineProperty(nestedRef.current, 'offsetTop', { value: 1000 });

    await act(async () => ref.current?.fitIntoView(0));

    // Only the wrapper's own bounds are measured, the nested absolute
    // element's far away position is not reflected
    expect(ref.current?.zoom).toBeCloseTo(1.23, 2);
    unmount();
  });
});
