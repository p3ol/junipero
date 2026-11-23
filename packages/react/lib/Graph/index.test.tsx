import { createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';

import GraphNode from '../GraphNode';
import GraphHandle from '../GraphHandle';
import GraphEdge from '../GraphEdge';
import { getBezierPath, getStepPath, getStraightPath } from '../GraphEdge/paths';
import Graph, { type GraphRef } from '.';

const pointer = { pointerId: 1, button: 0 };

describe('<Graph />', () => {
  it('should render a graph with nodes, handles & edges', () => {
    const { container, unmount } = render(
      <Graph>
        <GraphNode id="a" x={0} y={0}>
          A
          <GraphHandle type="source" />
        </GraphNode>
        <GraphNode id="b" x={200} y={100}>
          B
          <GraphHandle type="target" />
        </GraphNode>
        <GraphEdge source="a" target="b" label="a to b" arrow />
      </Graph>
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelectorAll('.graph-node').length).toBe(2);
    expect(container.querySelectorAll('.graph-handle').length).toBe(2);
    expect(container.querySelector('.graph-edge-path')).toBeTruthy();
    expect(container.querySelector('.graph-edge-label').textContent)
      .toBe('a to b');
    unmount();
  });

  it('should allow to customize the arrow size', () => {
    const { container, unmount } = render(
      <Graph>
        <GraphNode id="a" />
        <GraphNode id="b" />
        <GraphEdge source="a" target="b" arrow arrowSize={20} />
      </Graph>
    );

    const marker = container.querySelector('.graph-edge-arrow');
    expect(marker.getAttribute('markerWidth')).toBe('20');
    expect(marker.getAttribute('markerHeight')).toBe('20');
    expect(marker.getAttribute('viewBox')).toBe('0 0 10 10');
    unmount();
  });

  it('should apply line styles to edges', () => {
    const { container, unmount } = render(
      <Graph>
        <GraphNode id="a" />
        <GraphNode id="b" />
        <GraphEdge source="a" target="b" />
        <GraphEdge source="a" target="b" lineStyle="dashed" />
        <GraphEdge source="a" target="b" lineStyle="dotted" />
      </Graph>
    );

    const edges = container.querySelectorAll('.graph-edge');
    expect(edges[0].classList.contains('solid')).toBe(true);
    expect(edges[1].classList.contains('dashed')).toBe(true);
    expect(edges[2].classList.contains('dotted')).toBe(true);
    unmount();
  });

  it('should not render an edge if one of its nodes is missing', () => {
    const { container, unmount } = render(
      <Graph>
        <GraphNode id="a" />
        <GraphEdge source="a" target="missing" />
      </Graph>
    );

    expect(container.querySelector('.graph-edge')).toBeFalsy();
    unmount();
  });

  it('should register nodes into the graph store and compute bounds', () => {
    const ref = createRef<GraphRef>();
    const { unmount } = render(
      <Graph ref={ref}>
        <GraphNode id="a" x={-50} y={20} />
        <GraphNode id="b" x={300} y={150} />
      </Graph>
    );

    expect(ref.current.store.nodes.get('a')).toMatchObject({ x: -50, y: 20 });
    expect(ref.current.getBounds()).toMatchObject({
      minX: -50,
      minY: 20,
      maxX: 300,
      maxY: 150,
    });
    // Container wraps the nodes, content is offset to keep node coordinates
    expect(ref.current.innerRef.current.style.left).toBe('-50px');
    expect(
      (ref.current.innerRef.current.firstChild as HTMLElement).style.left
    ).toBe('50px');
    unmount();
  });

  it('should move a node and snap it to the given step', () => {
    const onMoveStart = vi.fn();
    const onMove = vi.fn();
    const onMoveEnd = vi.fn();
    const { container, unmount } = render(
      <Graph>
        <GraphNode
          id="a"
          x={10}
          y={10}
          step={10}
          onMoveStart={onMoveStart}
          onMove={onMove}
          onMoveEnd={onMoveEnd}
        >
          A
        </GraphNode>
      </Graph>
    );

    const node = container.querySelector<HTMLElement>('.graph-node');
    fireEvent.pointerDown(node, { ...pointer, clientX: 15, clientY: 15 });
    expect(onMoveStart).toHaveBeenCalledWith({ x: 10, y: 10 }, expect.anything());
    expect(node.className).toContain('moving');

    fireEvent.pointerMove(window, { ...pointer, clientX: 57, clientY: 92 });
    expect(onMove).toHaveBeenLastCalledWith({ x: 50, y: 90 }, expect.anything());
    expect(node.style.left).toBe('50px');
    expect(node.style.top).toBe('90px');

    fireEvent.pointerUp(window, { ...pointer, clientX: 57, clientY: 92 });
    expect(onMoveEnd).toHaveBeenCalledWith({ x: 50, y: 90 }, expect.anything());
    expect(node.className).not.toContain('moving');
    unmount();
  });

  it('should not move a node when draggable is false or when dragging ' +
    'from a nodrag element', () => {
    const onMoveStart = vi.fn();
    const { container, unmount } = render(
      <Graph>
        <GraphNode id="a" draggable={false} onMoveStart={onMoveStart}>
          A
        </GraphNode>
        <GraphNode id="b" onMoveStart={onMoveStart}>
          <span className="nodrag">B</span>
        </GraphNode>
      </Graph>
    );

    fireEvent.pointerDown(container.querySelector('[data-node-id="a"]'), pointer);
    fireEvent.pointerDown(container.querySelector('.nodrag'), pointer);
    expect(onMoveStart).not.toHaveBeenCalled();
    unmount();
  });

  it('should not trigger a click on a node after it has been moved', () => {
    const onClick = vi.fn();
    const { container, unmount } = render(
      <Graph>
        <GraphNode id="a" onClick={onClick}>A</GraphNode>
      </Graph>
    );

    const node = container.querySelector<HTMLElement>('.graph-node');
    fireEvent.pointerDown(node, { ...pointer, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(window, { ...pointer, clientX: 20, clientY: 20 });
    fireEvent.pointerUp(window, pointer);
    fireEvent.click(node);
    expect(onClick).not.toHaveBeenCalled();

    fireEvent.pointerDown(node, pointer);
    fireEvent.pointerUp(window, pointer);
    fireEvent.click(node);
    expect(onClick).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('should connect two handles, whichever side the connection was ' +
    'started from', () => {
    const onConnect = vi.fn();
    const onConnectEnd = vi.fn();
    const { container, unmount } = render(
      <Graph onConnect={onConnect} onConnectEnd={onConnectEnd}>
        <GraphNode id="a">
          <GraphHandle id="out" type="source" />
        </GraphNode>
        <GraphNode id="b">
          <GraphHandle id="in" type="target" />
        </GraphNode>
      </Graph>
    );

    const source = container.querySelector('[data-handle-id="out"]');
    const target = container.querySelector('[data-handle-id="in"]');

    // source -> target
    fireEvent.pointerDown(source, pointer);
    expect(source.className).toContain('connecting');
    expect(container.querySelector('.graph-connection-line')).toBeTruthy();
    fireEvent.pointerMove(window, { ...pointer, clientX: 50, clientY: 50 });
    fireEvent.pointerEnter(target, pointer);
    expect(target.className).toContain('valid');
    fireEvent.pointerUp(window, { ...pointer, clientX: 60, clientY: 60 });

    const connection = {
      source: 'a',
      sourceHandle: 'out',
      target: 'b',
      targetHandle: 'in',
    };
    expect(onConnect).toHaveBeenCalledWith(connection);
    expect(onConnectEnd).toHaveBeenCalledWith(expect.objectContaining({
      connection,
      position: { x: 60, y: 60 },
    }));
    expect(container.querySelector('.graph-connection-line')).toBeFalsy();

    // target -> source
    fireEvent.pointerDown(target, pointer);
    fireEvent.pointerEnter(source, pointer);
    fireEvent.pointerUp(window, pointer);
    expect(onConnect).toHaveBeenCalledTimes(2);
    expect(onConnect).toHaveBeenLastCalledWith(connection);
    unmount();
  });

  it('should not connect two handles of the same type, or if the ' +
    'connection is refused by isValidConnection', () => {
    const onConnect = vi.fn();
    const onConnectEnd = vi.fn();
    const { container, unmount } = render(
      <Graph
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        isValidConnection={c => c.target !== 'c'}
      >
        <GraphNode id="a"><GraphHandle type="source" /></GraphNode>
        <GraphNode id="b"><GraphHandle type="source" /></GraphNode>
        <GraphNode id="c"><GraphHandle type="target" /></GraphNode>
      </Graph>
    );

    const [a, b, c] = Array.from(container.querySelectorAll('.graph-handle'));

    fireEvent.pointerDown(a, pointer);
    fireEvent.pointerEnter(b, pointer);
    expect(b.className).toContain('invalid');
    fireEvent.pointerUp(window, pointer);

    fireEvent.pointerDown(a, pointer);
    fireEvent.pointerEnter(c, pointer);
    expect(c.className).toContain('invalid');
    fireEvent.pointerUp(window, pointer);

    expect(onConnect).not.toHaveBeenCalled();
    expect(onConnectEnd).toHaveBeenCalledTimes(2);
    expect(onConnectEnd).toHaveBeenLastCalledWith(expect.objectContaining({
      connection: null,
      to: { nodeId: 'c', handleId: 'target', type: 'target' },
    }));
    unmount();
  });

  it('should fall back to node sides when nodes have no handles', () => {
    const ref = createRef<GraphRef>();
    const { unmount } = render(
      <Graph ref={ref}>
        <GraphNode id="a" x={10} y={20} />
      </Graph>
    );

    ref.current.store.setNode('a', { width: 100, height: 40 });
    expect(ref.current.store.getAnchor('a', undefined, 'source'))
      .toEqual({ x: 110, y: 40, position: 'right' });
    expect(ref.current.store.getAnchor('a', undefined, 'target'))
      .toEqual({ x: 10, y: 40, position: 'left' });
    unmount();
  });
});

describe('Graph edge paths', () => {
  const source = { x: 0, y: 0, position: 'right' as const };
  const target = { x: 100, y: 50, position: 'left' as const };

  it('should compute a bezier path', () => {
    const edge = getBezierPath(source, target);
    expect(edge.path).toBe('M0,0 C50,0 50,50 100,50');
    expect(edge.labelX).toBe(50);
    expect(edge.labelY).toBe(25);
    expect(edge.bounds).toEqual({ minX: 0, minY: 0, maxX: 100, maxY: 50 });
  });

  it('should compute a straight path', () => {
    expect(getStraightPath(source, target).path).toBe('M0,0 L100,50');
  });

  it('should compute a step path', () => {
    expect(getStepPath(source, target, { borderRadius: 0 }).path)
      .toBe('M0,0 L50,0 L50,50 L100,50');
    expect(getStepPath(source, target).path)
      .toBe('M0,0 L45,0 Q50,0 50,5 L50,45 Q50,50 55,50 L100,50');
  });
});
