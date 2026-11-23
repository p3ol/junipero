import { useState } from 'react';

import type { GraphConnection } from './store';
import type { GraphEdgeType } from '../GraphEdge/paths';
import type { GraphEdgeLineStyle } from '../GraphEdge';
import InfiniteCanvas from '../InfiniteCanvas';
import InfiniteCanvasZoom from '../InfiniteCanvasZoom';
import GraphNode from '../GraphNode';
import GraphHandle from '../GraphHandle';
import GraphEdge from '../GraphEdge';
import Button from '../Button';
import TextField from '../TextField';
import Graph from '.';

export default { title: 'react/Graph' };

interface NodeData {
  id: string;
  x: number;
  y: number;
  title: string;
  inputs?: string[];
  outputs?: string[];
}

interface EdgeData extends GraphConnection {
  id: string;
}

const getEdgeId = ({
  source, sourceHandle, target, targetHandle,
}: GraphConnection) => `${source}.${sourceHandle}->${target}.${targetHandle}`;

const INITIAL_NODES: NodeData[] = [
  { id: 'trigger', x: 0, y: 120, title: 'Page view', outputs: ['out'] },
  {
    id: 'condition',
    x: 300,
    y: 100,
    title: 'Is subscriber?',
    inputs: ['in'],
    outputs: ['yes', 'no'],
  },
  { id: 'content', x: 650, y: 0, title: 'Show content', inputs: ['in'] },
  { id: 'paywall', x: 650, y: 220, title: 'Show paywall', inputs: ['in'] },
];

const INITIAL_EDGES: EdgeData[] = [
  { source: 'trigger', sourceHandle: 'out', target: 'condition', targetHandle: 'in' },
  { source: 'condition', sourceHandle: 'yes', target: 'content', targetHandle: 'in' },
].map(e => ({ ...e, id: getEdgeId(e) }));

const handleStyle = (index: number, count: number) => ({
  top: `calc(${((index + 1) / (count + 1)) * 100}% - var(--size) / 2)`,
});

export const InsideInfiniteCanvas = () => {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [selected, setSelected] = useState<string | null>(null);

  const moveNode = (id: string, x: number, y: number) =>
    setNodes(n => n.map(node => node.id === id ? { ...node, x, y } : node));

  const onConnect = (connection: GraphConnection) => {
    const id = getEdgeId(connection);
    setEdges(e => e.some(edge => edge.id === id)
      ? e : [...e, { ...connection, id }]);
  };

  const removeSelected = () => {
    setEdges(e => e.filter(edge =>
      edge.id !== selected &&
      edge.source !== selected &&
      edge.target !== selected
    ));
    setNodes(n => n.filter(node => node.id !== selected));
    setSelected(null);
  };

  const addNode = () => {
    const id = `node-${Date.now()}`;
    setNodes(n => [
      ...n,
      { id, x: 300, y: 350, title: 'New step', inputs: ['in'], outputs: ['out'] },
    ]);
  };

  return (
    <InfiniteCanvas
      className="fixed top-0 left-0 w-screen h-screen"
      background={{ pattern: 'dot' }}
      onClick={() => setSelected(null)}
      overlay={(
        <>
          <div className="absolute top-2 left-4 z-50 flex items-center gap-2">
            <Button onClick={addNode}>Add node</Button>
            <Button disabled={!selected} onClick={removeSelected}>
              Remove selected
            </Button>
          </div>
          <div className="absolute bottom-8 right-8 z-50">
            <InfiniteCanvasZoom />
          </div>
        </>
      )}
    >
      <Graph
        onConnect={onConnect}
        // Prevent a node from being connected to itself
        isValidConnection={c => c.source !== c.target}
      >
        { nodes.map(node => (
          <GraphNode
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            step={10}
            selected={selected === node.id}
            onClick={e => {
              e.stopPropagation();
              setSelected(node.id);
            }}
            onMoveEnd={({ x, y }) => moveNode(node.id, x, y)}
          >
            <div className="font-bold">{ node.title }</div>
            <div className="text-xs opacity-60">{ node.id }</div>

            { node.inputs?.map((input, i) => (
              <GraphHandle
                key={input}
                id={input}
                type="target"
                style={handleStyle(i, node.inputs.length)}
              />
            )) }
            { node.outputs?.map((output, i) => (
              <GraphHandle
                key={output}
                id={output}
                type="source"
                style={handleStyle(i, node.outputs.length)}
                title={output}
              />
            )) }
          </GraphNode>
        )) }

        { edges.map(edge => (
          <GraphEdge
            key={edge.id}
            { ...edge }
            arrow
            selected={selected === edge.id}
            label={edge.sourceHandle === 'yes' || edge.sourceHandle === 'no'
              ? edge.sourceHandle : undefined}
            onClick={e => {
              e.stopPropagation();
              setSelected(edge.id);
            }}
          />
        )) }
      </Graph>
    </InfiniteCanvas>
  );
};

export const Standalone = () => {
  const [connections, setConnections] = useState<GraphConnection[]>([]);

  return (
    <div>
      <p className="mb-4">
        Graphs can be used without an InfiniteCanvas. Drag from a handle to
        another one to connect them.
      </p>
      <Graph
        autoSize={false}
        className="w-[600px] h-[300px] border border-dashed border-slate-400"
        onConnect={c => setConnections(cs => [...cs, c])}
      >
        <GraphNode id="a" x={40} y={40}>
          Node A
          <GraphHandle type="source" />
        </GraphNode>
        <GraphNode id="b" x={380} y={180} dragHandle=".drag-handle">
          <div className="drag-handle cursor-grab font-bold">
            Node B (drag me here)
          </div>
          <TextField className="nodrag mt-2" placeholder="Not draggable" />
          <GraphHandle type="target" />
        </GraphNode>
        <GraphNode id="c" x={380} y={20} draggable={false}>
          Node C (fixed)
          <GraphHandle type="target" position="top" />
        </GraphNode>

        { connections.map(c => (
          <GraphEdge key={getEdgeId(c)} { ...c } animated />
        )) }
      </Graph>
    </div>
  );
};

export const HandlesInsideContent = () => {
  const [options, setOptions] = useState([
    { id: 'first', label: 'First option' },
    { id: 'second', label: 'Second option' },
  ]);
  const [edges, setEdges] = useState<EdgeData[]>([
    { source: 'question', sourceHandle: 'first', target: 'yes' },
    { source: 'question', sourceHandle: 'second', target: 'no' },
  ].map(e => ({ ...e, id: getEdgeId(e) })));

  const onConnect = (connection: GraphConnection) => {
    const id = getEdgeId(connection);
    setEdges(e => e.some(edge => edge.id === id)
      ? e : [...e, { ...connection, id }]);
  };

  const addOption = () => {
    const id = `option-${options.length + 1}`;
    setOptions(o => [...o, { id, label: `Option ${o.length + 1}` }]);
  };

  return (
    <InfiniteCanvas
      className="fixed top-0 left-0 w-screen h-screen"
      overlay={(
        <div className="absolute top-2 left-4 z-50 flex items-center gap-2">
          <Button onClick={addOption}>Add option</Button>
        </div>
      )}
    >
      <Graph onConnect={onConnect}>
        <GraphNode id="question" x={0} y={0} className="w-[260px]">
          <div className="font-bold">Card title</div>
          <p className="text-sm opacity-70">
            Each option below has its own handle, placed at its own level.
          </p>

          { options.map(option => (
            <div key={option.id}>
              <hr className="my-2 -mx-[15px] opacity-20" />
              {/*
                * `relative` makes the handle center vertically on this row,
                * negative margins stretch the row to the card's edges so
                * the handle sits on the border instead of inside the
                * card's padding
                */}
              <div className="relative -mx-[15px] px-[15px] py-1">
                { option.label }
                <GraphHandle id={option.id} type="source" />
              </div>
            </div>
          )) }
        </GraphNode>

        <GraphNode id="yes" x={400} y={-40}>
          Yes path
          <GraphHandle type="target" />
        </GraphNode>
        <GraphNode id="no" x={400} y={120}>
          No path
          <GraphHandle type="target" />
        </GraphNode>

        { edges.map(edge => (
          <GraphEdge key={edge.id} { ...edge } arrow />
        )) }
      </Graph>
    </InfiniteCanvas>
  );
};

export const EdgeTypes = () => {
  const types: GraphEdgeType[] = ['bezier', 'step', 'straight'];

  return (
    <InfiniteCanvas className="fixed top-0 left-0 w-screen h-screen">
      <Graph>
        { types.map((type, i) => (
          <GraphNode key={`${type}-s`} id={`${type}-s`} x={0} y={i * 150}>
            { type }
            <GraphHandle type="source" />
          </GraphNode>
        )) }
        { types.map((type, i) => (
          <GraphNode
            key={`${type}-t`}
            id={`${type}-t`}
            x={350}
            y={i * 150 + 60}
          >
            target
            <GraphHandle type="target" position="top" />
          </GraphNode>
        )) }
        { types.map(type => (
          <GraphEdge
            key={type}
            type={type}
            source={`${type}-s`}
            target={`${type}-t`}
            label={type}
            arrow
          />
        )) }
      </Graph>
    </InfiniteCanvas>
  );
};

export const LineStyles = () => {
  const styles: GraphEdgeLineStyle[] = ['solid', 'dashed', 'dotted'];

  return (
    <InfiniteCanvas className="fixed top-0 left-0 w-screen h-screen">
      <Graph>
        { styles.map((lineStyle, i) => (
          <GraphNode key={`${lineStyle}-s`} id={`${lineStyle}-s`} x={0} y={i * 100}>
            { lineStyle }
            <GraphHandle type="source" />
          </GraphNode>
        )) }
        { styles.map((lineStyle, i) => (
          <GraphNode key={`${lineStyle}-t`} id={`${lineStyle}-t`} x={350} y={i * 100}>
            target
            <GraphHandle type="target" />
          </GraphNode>
        )) }
        { styles.map(lineStyle => (
          <GraphEdge
            key={lineStyle}
            source={`${lineStyle}-s`}
            target={`${lineStyle}-t`}
            lineStyle={lineStyle}
            arrow
          />
        )) }

        <GraphNode id="animated-s" x={0} y={300}>
          animated dotted
          <GraphHandle type="source" />
        </GraphNode>
        <GraphNode id="animated-t" x={350} y={300}>
          target
          <GraphHandle type="target" />
        </GraphNode>
        <GraphEdge
          source="animated-s"
          target="animated-t"
          lineStyle="dotted"
          animated
          arrow
        />

        <GraphNode id="custom-s" x={0} y={400}>
          custom pattern
          <GraphHandle type="source" />
        </GraphNode>
        <GraphNode id="custom-t" x={350} y={400}>
          target
          <GraphHandle type="target" />
        </GraphNode>
        <GraphEdge
          source="custom-s"
          target="custom-t"
          arrow
          arrowSize={16}
          style={{
            '--stroke-dasharray': '12 3 2 3',
            '--stroke-width': 2,
            '--stroke-color': 'var(--junipero-grapefruit)',
          } as React.CSSProperties}
        />
      </Graph>
    </InfiniteCanvas>
  );
};
