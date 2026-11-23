import {
  type CSSProperties,
  type DragEvent,
  type SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  GraphConnection,
  GraphHandleInfo,
  GraphPoint,
} from './store';
import type { GraphEdgeType } from '../GraphEdge/paths';
import type { GraphEdgeLineStyle } from '../GraphEdge';
import type { InfiniteCanvasRef } from '../InfiniteCanvas';
import { useGraphNode } from '../hooks';
import InfiniteCanvas from '../InfiniteCanvas';
import InfiniteCanvasZoom from '../InfiniteCanvasZoom';
import GraphNode from '../GraphNode';
import GraphHandle from '../GraphHandle';
import GraphEdge from '../GraphEdge';
import Button from '../Button';
import Card from '../Card';
import TextField from '../TextField';
import SelectField from '../SelectField';
import Graph, { type GraphRef } from '.';

export default { title: 'react/Graph/Workflow Editor' };

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

type Kind = 'trigger' | 'condition' | 'action' | 'delay' | 'end';
type Status = 'running' | 'done';

interface Branch {
  id: string;
  label: string;
}

interface WorkflowNode {
  id: string;
  kind: Kind;
  x: number;
  y: number;
  title: string;
  description?: string;
  seconds?: number;
  branches?: Branch[];
}

interface WorkflowEdge extends GraphConnection {
  id: string;
  type: GraphEdgeType;
  lineStyle: GraphEdgeLineStyle;
}

type Selection = { type: 'node' | 'edge'; id: string } | null;

const KINDS: Record<Kind, {
  label: string;
  color: string;
  input: boolean;
  output: 'single' | 'branches' | 'none';
  defaults: Partial<WorkflowNode>;
}> = {
  trigger: {
    label: 'Trigger',
    color: 'var(--junipero-velvet)',
    input: false,
    output: 'single',
    defaults: { title: 'New trigger' },
  },
  condition: {
    label: 'Condition',
    color: 'var(--junipero-sunglow)',
    input: true,
    output: 'branches',
    defaults: {
      title: 'New condition',
      branches: [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }],
    },
  },
  action: {
    label: 'Action',
    color: 'var(--junipero-lime)',
    input: true,
    output: 'single',
    defaults: { title: 'New action', description: '' },
  },
  delay: {
    label: 'Delay',
    color: 'var(--junipero-slate)',
    input: true,
    output: 'single',
    defaults: { title: 'Wait', seconds: 5 },
  },
  end: {
    label: 'End',
    color: 'var(--junipero-grapefruit)',
    input: true,
    output: 'none',
    defaults: { title: 'End' },
  },
};

const uid = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 7)}`;

const createNode = (kind: Kind, { x, y }: GraphPoint): WorkflowNode => ({
  id: uid(kind),
  kind,
  x: Math.round(x / 10) * 10,
  y: Math.round(y / 10) * 10,
  ...structuredClone(KINDS[kind].defaults),
} as WorkflowNode);

const createEdge = (
  connection: GraphConnection,
  rest?: Partial<WorkflowEdge>,
): WorkflowEdge => ({
  id: `${connection.source}.${connection.sourceHandle}` +
    `->${connection.target}.${connection.targetHandle}`,
  type: 'bezier',
  lineStyle: 'solid',
  ...connection,
  ...rest,
});

/** Would adding source -> target make a loop? (i.e. is source reachable
 * from target) */
const createsCycle = (edges: WorkflowEdge[], { source, target }: GraphConnection) => {
  const stack = [target];
  const seen = new Set<string>();

  while (stack.length) {
    const id = stack.pop();

    if (id === source) {
      return true;
    }

    if (!seen.has(id)) {
      seen.add(id);
      edges.filter(e => e.source === id).forEach(e => stack.push(e.target));
    }
  }

  return false;
};

const isOutputUsed = (
  edges: WorkflowEdge[],
  nodeId: string,
  handleId: string,
) => edges.some(e => e.source === nodeId && e.sourceHandle === handleId);

// ---------------------------------------------------------------------------
// Auto layout: layered (longest path) + barycenter ordering
// ---------------------------------------------------------------------------

const COLUMN_WIDTH = 340;
const ROW_GAP = 40;

const estimateHeight = (node: WorkflowNode) =>
  80 +
  (node.kind === 'action' || node.kind === 'delay' ? 50 : 0) +
  (node.branches ? node.branches.length * 48 + 40 : 0);

const layout = (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
  const parents = new Map<string, WorkflowEdge[]>(
    nodes.map((n): [string, WorkflowEdge[]] => [n.id, []])
  );
  edges.forEach(e => parents.get(e.target)?.push(e));

  const depths = new Map<string, number>();

  const getDepth = (id: string, visiting = new Set<string>()): number => {
    if (depths.has(id)) {
      return depths.get(id);
    }

    if (visiting.has(id)) {
      return 0;
    }

    visiting.add(id);
    const incoming = parents.get(id) || [];
    const depth = incoming.length
      ? Math.max(...incoming.map(e => getDepth(e.source, visiting))) + 1
      : 0;
    depths.set(id, depth);

    return depth;
  };

  nodes.forEach(n => getDepth(n.id));

  const layers: WorkflowNode[][] = [];
  nodes.forEach(n => {
    const depth = depths.get(n.id);
    layers[depth] = [...layers[depth] || [], n];
  });

  const positions = new Map<string, GraphPoint>();
  const byId = new Map(nodes.map(n => [n.id, n]));

  // Order each layer by the average position of its parents' outputs
  const barycenter = (node: WorkflowNode) => {
    const incoming = parents.get(node.id) || [];

    if (!incoming.length) {
      return 0;
    }

    return incoming.reduce((sum, e) => {
      const parent = byId.get(e.source);
      const branchIndex = parent?.branches
        ?.findIndex(b => b.id === e.sourceHandle) ?? 0;

      return sum + (positions.get(e.source)?.y ?? 0) + branchIndex * 48;
    }, 0) / incoming.length;
  };

  layers.forEach((layer, depth) => {
    const sorted = [...layer || []].sort((a, b) => barycenter(a) - barycenter(b));
    const total = sorted.reduce((sum, n) => sum + estimateHeight(n), 0) +
      ROW_GAP * (sorted.length - 1);
    let y = -total / 2;

    sorted.forEach(n => {
      positions.set(n.id, {
        x: depth * COLUMN_WIDTH,
        y: Math.round(y / 10) * 10,
      });
      y += estimateHeight(n) + ROW_GAP;
    });
  });

  return nodes.map(n => ({ ...n, ...positions.get(n.id) }));
};

// ---------------------------------------------------------------------------
// Initial data: a (very) simplified paywall journey
// ---------------------------------------------------------------------------

const node = (
  id: string,
  kind: Kind,
  rest: Partial<WorkflowNode> = {},
): WorkflowNode => ({
  ...createNode(kind, { x: 0, y: 0 }),
  id,
  ...rest,
});

const INITIAL_NODES: WorkflowNode[] = [
  node('start', 'trigger', { title: 'Article viewed' }),
  node('status', 'condition', {
    title: 'Reader status',
    branches: [
      { id: 'subscriber', label: 'Subscriber' },
      { id: 'registered', label: 'Registered' },
      { id: 'anonymous', label: 'Anonymous' },
    ],
  }),
  node('unlock', 'action', {
    title: 'Unlock content',
    description: 'Full article',
  }),
  node('wait', 'delay', { title: 'Let them read', seconds: 3 }),
  node('newsletter', 'action', {
    title: 'Newsletter form',
    description: 'Inline, after 3rd paragraph',
  }),
  node('quota', 'condition', {
    title: 'Articles read this month',
    branches: [
      { id: 'under', label: 'Less than 3' },
      { id: 'over', label: '3 or more' },
    ],
  }),
  node('free', 'action', { title: 'Free article', description: '' }),
  node('paywall', 'action', {
    title: 'Show paywall',
    description: 'Subscription offer',
  }),
  node('end', 'end'),
];

const link = (
  source: string,
  sourceHandle: string,
  target: string,
  rest?: Partial<WorkflowEdge>,
) => createEdge({ source, sourceHandle, target, targetHandle: 'in' }, rest);

const INITIAL_EDGES: WorkflowEdge[] = [
  link('start', 'out', 'status'),
  link('status', 'subscriber', 'unlock'),
  link('status', 'registered', 'wait'),
  link('status', 'anonymous', 'quota'),
  link('wait', 'out', 'newsletter', { lineStyle: 'dashed' }),
  link('quota', 'under', 'free', { type: 'step' }),
  link('quota', 'over', 'paywall', { type: 'step' }),
  link('unlock', 'out', 'end', { lineStyle: 'dotted' }),
  link('newsletter', 'out', 'end', { lineStyle: 'dotted' }),
  link('free', 'out', 'end', { lineStyle: 'dotted' }),
  link('paywall', 'out', 'end', { lineStyle: 'dotted' }),
];

const DRAG_TYPE = 'application/x-junipero-workflow-kind';

const stopPropagation = {
  onClick: (e: SyntheticEvent) => e.stopPropagation(),
  onMouseDown: (e: SyntheticEvent) => e.stopPropagation(),
};

// Overlay layout is done with inline styles: junipero's theme isn't in a css
// layer, so its rules (e.g. `.junipero.card { display: block; padding }`)
// would win over tailwind's (layered) utilities
const OVERLAY: Record<string, CSSProperties> = {
  toolbar: {
    position: 'absolute',
    top: 12,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 50,
    display: 'flex',
    gap: 8,
  },
  palette: {
    position: 'absolute',
    top: 12,
    left: 12,
    bottom: 12,
    width: 200,
    zIndex: 50,
  },
  inspector: {
    position: 'absolute',
    top: 12,
    right: 12,
    bottom: 12,
    width: 280,
    zIndex: 50,
    overflow: 'auto',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    height: '100%',
  },
  hint: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 50,
    pointerEvents: 'none',
  },
  dropMenu: {
    position: 'absolute',
    zIndex: 50,
    padding: 8,
    minWidth: 160,
  },
  zoom: {
    position: 'absolute',
    bottom: 24,
    right: 312,
    zIndex: 50,
  },
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Node
// ---------------------------------------------------------------------------

/** Uses the node context to display the id of the node it is rendered in */
const NodeIdBadge = () => {
  const graphNode = useGraphNode();

  return (
    <span className="ml-auto text-[10px] font-mono opacity-40">
      #{ graphNode?.id }
    </span>
  );
};

interface WorkflowNodeViewProps {
  node: WorkflowNode;
  selected: boolean;
  status?: Status;
  onSelect: () => void;
  onMove: (position: GraphPoint) => void;
  onChange: (changes: Partial<WorkflowNode>) => void;
  onRemoveBranch: (branchId: string) => void;
}

const WorkflowNodeView = ({
  node,
  selected,
  status,
  onSelect,
  onMove,
  onChange,
  onRemoveBranch,
}: WorkflowNodeViewProps) => {
  const kind = KINDS[node.kind];

  return (
    <GraphNode
      id={node.id}
      x={node.x}
      y={node.y}
      step={10}
      selected={selected}
      dragHandle=".workflow-node-header"
      className="!p-0 w-[240px] overflow-visible"
      style={{
        ...status && {
          outline: `2px solid ${status === 'running'
            ? 'var(--junipero-sunglow)' : 'var(--junipero-lime)'}`,
          outlineOffset: 3,
        },
      }}
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
      onMoveEnd={onMove}
    >
      <div
        className={
          'workflow-node-header flex items-center gap-2 px-[15px] py-2 ' +
          'cursor-grab border-b border-black/10 dark:border-white/10'
        }
      >
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: kind.color }}
        />
        <span className="text-[11px] uppercase tracking-wide opacity-60">
          { kind.label }
          { status === 'running' && ' · running' }
        </span>
        <NodeIdBadge />
      </div>

      <div className="px-[15px] py-2">
        <div className="font-bold leading-tight">{ node.title }</div>

        { node.kind === 'action' && (
          <TextField
            className="nodrag w-full mt-2"
            placeholder="Description"
            value={node.description}
            onChange={({ value }) => onChange({ description: `${value}` })}
          />
        ) }

        { node.kind === 'delay' && (
          <div className="nodrag flex items-center gap-2 mt-2 text-sm">
            <TextField
              type="number"
              className="w-20"
              value={node.seconds}
              onChange={({ value }) => onChange({ seconds: Number(value) })}
            />
            seconds
          </div>
        ) }
      </div>

      { node.branches?.map(branch => (
        // Each branch row is positioned so its handle sits at its own level
        <div
          key={branch.id}
          className={
            'relative flex items-center gap-2 px-[15px] py-1 ' +
            'border-t border-black/10 dark:border-white/10'
          }
        >
          <TextField
            className="nodrag flex-auto min-w-0"
            value={branch.label}
            onChange={({ value }) => onChange({
              branches: node.branches.map(b => b.id === branch.id
                ? { ...b, label: `${value}` } : b),
            })}
          />
          <button
            type="button"
            className="nodrag opacity-40 hover:opacity-100 px-1"
            disabled={node.branches.length <= 1}
            title="Remove branch"
            onClick={() => onRemoveBranch(branch.id)}
          >
            ×
          </button>
          <GraphHandle id={branch.id} type="source" title={branch.label} />
        </div>
      )) }

      { node.branches && (
        <div className="px-[15px] py-2 border-t border-black/10 dark:border-white/10">
          <button
            type="button"
            className="nodrag text-sm opacity-60 hover:opacity-100"
            onClick={() => onChange({
              branches: [
                ...node.branches,
                { id: uid('branch'), label: `Branch ${node.branches.length + 1}` },
              ],
            })}
          >
            + Add branch
          </button>
        </div>
      ) }

      { kind.input && <GraphHandle id="in" type="target" /> }
      { kind.output === 'single' && <GraphHandle id="out" type="source" /> }
    </GraphNode>
  );
};

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

export const WorkflowEditor = () => {
  const canvasRef = useRef<InfiniteCanvasRef>(null);
  const graphRef = useRef<GraphRef>(null);
  const runId = useRef(0);
  const lastConnectEnd = useRef(0);

  const [nodes, setNodes] = useState(() => layout(INITIAL_NODES, INITIAL_EDGES));
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [selection, setSelection] = useState<Selection>(null);
  const [panning, setPanning] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [dropMenu, setDropMenu] = useState<{
    from: GraphHandleInfo;
    position: GraphPoint;
  } | null>(null);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [traversed, setTraversed] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const selectedNode = selection?.type === 'node'
    ? nodes.find(n => n.id === selection.id) : null;
  const selectedEdge = selection?.type === 'edge'
    ? edges.find(e => e.id === selection.id) : null;

  const branchLabels = useMemo(() => new Map(
    nodes.flatMap(n => (n.branches || []).map(b => [`${n.id}.${b.id}`, b.label]))
  ), [nodes]);

  // Mutations ---------------------------------------------------------------

  const updateNode = (id: string, changes: Partial<WorkflowNode>) =>
    setNodes(ns => ns.map(n => n.id === id ? { ...n, ...changes } : n));

  const updateEdge = (id: string, changes: Partial<WorkflowEdge>) =>
    setEdges(es => es.map(e => e.id === id ? { ...e, ...changes } : e));

  const removeNode = (id: string) => {
    setNodes(ns => ns.filter(n => n.id !== id));
    setEdges(es => es.filter(e => e.source !== id && e.target !== id));
    setSelection(null);
  };

  const removeEdge = (id: string) => {
    setEdges(es => es.filter(e => e.id !== id));
    setSelection(null);
  };

  const removeBranch = (nodeId: string, branchId: string) => {
    setNodes(ns => ns.map(n => n.id === nodeId
      ? { ...n, branches: n.branches.filter(b => b.id !== branchId) } : n));
    setEdges(es => es.filter(e =>
      !(e.source === nodeId && e.sourceHandle === branchId)));
  };

  const addNode = (kind: Kind, position: GraphPoint, connectTo?: GraphHandleInfo) => {
    const newNode = createNode(kind, position);
    setNodes(ns => [...ns, newNode]);
    setSelection({ type: 'node', id: newNode.id });

    if (connectTo) {
      setEdges(es => [...es, createEdge(connectTo.type === 'source'
        ? {
          source: connectTo.nodeId,
          sourceHandle: connectTo.handleId,
          target: newNode.id,
          targetHandle: 'in',
        }
        : {
          source: newNode.id,
          sourceHandle: 'out',
          target: connectTo.nodeId,
          targetHandle: connectTo.handleId,
        })]);
    }
  };

  const getViewCenter = () => {
    const rect = canvasRef.current?.innerRef.current?.getBoundingClientRect();

    return rect
      ? graphRef.current.toGraphPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      )
      : { x: 0, y: 0 };
  };

  const tidyUp = () => {
    setNodes(ns => layout(ns, edges));
    // Wait for the new positions to be rendered (and measured)
    setTimeout(() => canvasRef.current?.fitIntoView(400), 50);
  };

  // Connections -------------------------------------------------------------

  const isValidConnection = (c: GraphConnection) =>
    c.source !== c.target &&
    !isOutputUsed(edges, c.source, c.sourceHandle) &&
    !createsCycle(edges, c);

  const onConnect = (c: GraphConnection) => {
    setEdges(es => [...es, createEdge(c)]);
  };

  const onConnectEnd = ({ from, to, connection, position }: {
    from: GraphHandleInfo;
    to: GraphHandleInfo | null;
    connection: GraphConnection | null;
    position: GraphPoint;
  }) => {
    setHint(null);
    lastConnectEnd.current = Date.now();

    // Dropped on empty space: offer to create a node already connected
    if (
      !connection && !to &&
      !(from.type === 'source' && isOutputUsed(edges, from.nodeId, from.handleId))
    ) {
      setDropMenu({ from, position });
    }
  };

  // Run simulation ----------------------------------------------------------

  const stop = () => {
    runId.current++;
    setRunning(false);
  };

  const run = async () => {
    const id = ++runId.current;
    const snapshot = { nodes, edges };
    const isCancelled = () => runId.current !== id;
    let current = snapshot.nodes.find(n => n.kind === 'trigger');

    setRunning(true);
    setStatuses({});
    setTraversed([]);

    while (current && !isCancelled()) {
      const nodeId = current.id;
      setStatuses(s => ({ ...s, [nodeId]: 'running' }));
      canvasRef.current?.panTo(
        current.x + 120,
        current.y + estimateHeight(current) / 2,
        400,
      );
      await wait(current.kind === 'delay'
        ? Math.min(current.seconds || 0, 5) * 300 + 400
        : 800);

      if (isCancelled()) {
        break;
      }

      setStatuses(s => ({ ...s, [nodeId]: 'done' }));

      const outgoing = snapshot.edges.filter(e => e.source === nodeId);
      // Conditions pick a random branch, to make each run a bit different
      const next = outgoing[Math.floor(Math.random() * outgoing.length)];

      if (!next) {
        break;
      }

      setTraversed(t => [...t, next.id]);
      await wait(400);
      current = snapshot.nodes.find(n => n.id === next.target);
    }

    if (!isCancelled()) {
      setRunning(false);
    }
  };

  useEffect(() => () => {
    runId.current++;
  }, []);

  // Keyboard ----------------------------------------------------------------

  useEffect(() => {
    const isTyping = (e: KeyboardEvent) =>
      (e.target as Element)?.closest?.('input, textarea, [contenteditable]');

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTyping(e)) {
        return;
      }

      if (e.key === ' ') {
        e.preventDefault();
        setPanning(true);
      } else if (e.key === 'Escape') {
        setSelection(null);
        setDropMenu(null);
      } else if (
        (e.key === 'Delete' || e.key === 'Backspace') && selection
      ) {
        if (selection.type === 'node') {
          removeNode(selection.id);
        } else {
          removeEdge(selection.id);
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setPanning(false);
      }
    };

    globalThis.addEventListener('keydown', onKeyDown);
    globalThis.addEventListener('keyup', onKeyUp);

    return () => {
      globalThis.removeEventListener('keydown', onKeyDown);
      globalThis.removeEventListener('keyup', onKeyUp);
    };
  });

  // Palette drag & drop -----------------------------------------------------

  const onDragOver = (e: DragEvent) => {
    if (e.dataTransfer.types.includes(DRAG_TYPE)) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const onDrop = (e: DragEvent) => {
    const kind = e.dataTransfer.getData(DRAG_TYPE) as Kind;

    if (!kind) {
      return;
    }

    e.preventDefault();
    const point = graphRef.current.toGraphPoint(e.clientX, e.clientY);
    addNode(kind, { x: point.x - 120, y: point.y - 20 });
  };

  // Drop menu position: graph -> screen (relative to the canvas element)
  const dropMenuStyle = (): CSSProperties => {
    const { zoom = 1, offsetX = 0, offsetY = 0 } = canvasRef.current || {};

    return {
      left: dropMenu.position.x * zoom + offsetX,
      top: dropMenu.position.y * zoom + offsetY,
    };
  };

  const dropMenuKinds = (Object.keys(KINDS) as Kind[]).filter(kind =>
    dropMenu?.from.type === 'source'
      ? KINDS[kind].input
      : KINDS[kind].output === 'single'
  );

  return (
    <InfiniteCanvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen"
      background={{ pattern: 'dot', gap: 20 }}
      cursorMode={panning ? 'pan' : 'default'}
      padding={{ left: 220, right: 300, top: 60 }}
      centerMargin={60}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => {
        // The click following a connection drag shouldn't close its menu
        if (Date.now() - lastConnectEnd.current < 100) {
          return;
        }

        setSelection(null);
        setDropMenu(null);
      }}
      overlay={(
        <>
          {/* Toolbar */}
          <div { ...stopPropagation } style={OVERLAY.toolbar}>
            { running ? (
              <Button className="danger" onClick={stop}>Stop</Button>
            ) : (
              <Button className="primary" onClick={run}>Run</Button>
            ) }
            <Button onClick={tidyUp}>Tidy up</Button>
            <Button onClick={() => canvasRef.current?.fitIntoView(400)}>
              Fit
            </Button>
            <Button
              className={classNames({ primary: panning })}
              onClick={() => setPanning(p => !p)}
            >
              Pan (hold space)
            </Button>
            <Button
              onClick={() => {
                stop();
                setNodes(layout(INITIAL_NODES, INITIAL_EDGES));
                setEdges(INITIAL_EDGES);
                setStatuses({});
                setTraversed([]);
                setSelection(null);
              }}
            >
              Reset
            </Button>
          </div>

          {/* Palette */}
          <Card { ...stopPropagation } style={OVERLAY.palette}>
            <div style={OVERLAY.column}>
              <div className="font-bold">Blocks</div>
              <div className="text-xs opacity-60 mb-2">
                Drag onto the canvas, or click to add at the center.
              </div>
              { (Object.keys(KINDS) as Kind[]).map(kind => (
                <div
                  key={kind}
                  draggable
                  className={
                    'flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab ' +
                    'border border-black/10 dark:border-white/10 ' +
                    'hover:bg-black/5 dark:hover:bg-white/5 select-none'
                  }
                  onDragStart={e => {
                    e.dataTransfer.setData(DRAG_TYPE, kind);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  onClick={() => {
                    const center = getViewCenter();
                    addNode(kind, { x: center.x - 120, y: center.y - 40 });
                  }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: KINDS[kind].color }}
                  />
                  { KINDS[kind].label }
                </div>
              )) }

              <div
                className="text-xs opacity-60 flex flex-col gap-1"
                style={{ marginTop: 'auto' }}
              >
                <div>{ nodes.length } nodes · { edges.length } edges</div>
                <div>Del: remove selection · Esc: deselect</div>
              </div>
            </div>
          </Card>

          {/* Inspector */}
          <Card { ...stopPropagation } style={OVERLAY.inspector}>
            <div style={{ ...OVERLAY.column, gap: 12 }}>
              { selectedNode ? (
                <>
                  <div className="font-bold">
                    { KINDS[selectedNode.kind].label }
                    <span className="ml-2 text-xs font-mono opacity-50">
                      #{ selectedNode.id }
                    </span>
                  </div>
                  <TextField
                    placeholder="Title"
                    value={selectedNode.title}
                    onChange={({ value }) =>
                      updateNode(selectedNode.id, { title: `${value}` })}
                  />
                  <div className="text-sm opacity-70">
                    { edges.filter(e => e.target === selectedNode.id).length } incoming
                    {' · '}
                    { edges.filter(e => e.source === selectedNode.id).length } outgoing
                  </div>
                  <div className="text-sm opacity-70">
                    Position: { selectedNode.x }, { selectedNode.y }
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const elmt = canvasRef.current?.innerRef.current
                          ?.querySelector<HTMLElement>(
                          `[data-node-id="${selectedNode.id}"]`
                          );
                        canvasRef.current?.centerOn(elmt, 400);
                      }}
                    >
                      Center
                    </Button>
                    <Button
                      className="danger"
                      onClick={() => removeNode(selectedNode.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              ) : selectedEdge ? (
                <>
                  <div className="font-bold">Edge</div>
                  <div className="text-sm font-mono opacity-70">
                    { selectedEdge.source }.{ selectedEdge.sourceHandle }
                    <br />
                    → { selectedEdge.target }.{ selectedEdge.targetHandle }
                  </div>
                  <SelectField
                    placeholder="Type"
                    options={['bezier', 'step', 'straight']}
                    value={selectedEdge.type}
                    onChange={({ value }) => updateEdge(selectedEdge.id, {
                      type: value as GraphEdgeType,
                    })}
                  />
                  <SelectField
                    placeholder="Line style"
                    options={['solid', 'dashed', 'dotted']}
                    value={selectedEdge.lineStyle}
                    onChange={({ value }) => updateEdge(selectedEdge.id, {
                      lineStyle: value as GraphEdgeLineStyle,
                    })}
                  />
                  <Button
                    className="danger"
                    onClick={() => removeEdge(selectedEdge.id)}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <div className="font-bold">Workflow editor</div>
                  <ul className="text-sm opacity-70 list-disc pl-4 flex flex-col gap-1">
                    <li>Drag nodes by their header</li>
                    <li>Drag from a handle to another one to connect them</li>
                    <li>
                      Release a connection on empty space to create a new,
                      already connected, node
                    </li>
                    <li>
                      Outputs accept a single edge, inputs accept many, and
                      loops are refused
                    </li>
                    <li>Click a node or an edge to edit it</li>
                    <li>Run to simulate a reader going through the flow</li>
                  </ul>
                </>
              ) }
            </div>
          </Card>

          {/* Connection hint */}
          { hint && (
            <div
              className="px-3 py-1 rounded-full bg-black/80 text-white text-sm"
              style={OVERLAY.hint}
            >
              { hint }
            </div>
          ) }

          {/* Create-on-drop menu */}
          { dropMenu && (
            <Card
              { ...stopPropagation }
              style={{ ...OVERLAY.dropMenu, ...dropMenuStyle() }}
            >
              <div style={OVERLAY.column}>
                <div className="text-xs opacity-60 px-2 py-1">
                  Add a connected block
                </div>
                { dropMenuKinds.map(kind => (
                  <button
                    key={kind}
                    type="button"
                    className={
                      'flex items-center gap-2 px-2 py-1 rounded text-left ' +
                      'hover:bg-black/5 dark:hover:bg-white/5'
                    }
                    onClick={() => {
                      const { from, position } = dropMenu;
                      addNode(kind, {
                        x: from.type === 'source' ? position.x + 20 : position.x - 260,
                        y: position.y - 20,
                      }, from);
                      setDropMenu(null);
                    }}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: KINDS[kind].color }}
                    />
                    { KINDS[kind].label }
                  </button>
                )) }
              </div>
            </Card>
          ) }

          <div { ...stopPropagation } style={OVERLAY.zoom}>
            <InfiniteCanvasZoom />
          </div>
        </>
      )}
    >
      <Graph
        ref={graphRef}
        isValidConnection={isValidConnection}
        onConnect={onConnect}
        onConnectStart={from => {
          setDropMenu(null);
          setHint(from.type === 'source'
            ? 'Release on an input, or on empty space to add a block'
            : 'Release on an output, or on empty space to add a block');
        }}
        onConnectEnd={onConnectEnd}
      >
        { nodes.map(n => (
          <WorkflowNodeView
            key={n.id}
            node={n}
            status={statuses[n.id]}
            selected={selection?.type === 'node' && selection.id === n.id}
            onSelect={() => setSelection({ type: 'node', id: n.id })}
            onMove={({ x, y }) => updateNode(n.id, { x, y })}
            onChange={changes => updateNode(n.id, changes)}
            onRemoveBranch={branchId => removeBranch(n.id, branchId)}
          />
        )) }

        { edges.map(edge => {
          const isSelected = selection?.type === 'edge' &&
            selection.id === edge.id;
          // Highlight the edges of the selected node too
          const isRelated = selection?.type === 'node' &&
            (edge.source === selection.id || edge.target === selection.id);
          const isTraversed = traversed.includes(edge.id);
          const branchLabel = branchLabels
            .get(`${edge.source}.${edge.sourceHandle}`);

          return (
            <GraphEdge
              key={edge.id}
              source={edge.source}
              sourceHandle={edge.sourceHandle}
              target={edge.target}
              targetHandle={edge.targetHandle}
              type={edge.type}
              lineStyle={edge.lineStyle}
              selected={isSelected || isRelated}
              animated={isTraversed}
              arrow
              arrowSize={12}
              style={isTraversed ? {
                '--stroke-color': 'var(--junipero-lime)',
                '--stroke-width': 2.5,
              } as CSSProperties : undefined}
              label={(branchLabel || isSelected) && (
                <span className="flex items-center gap-1">
                  { branchLabel }
                  { isSelected && (
                    <button
                      type="button"
                      className="opacity-60 hover:opacity-100"
                      title="Delete edge"
                      onClick={e => {
                        e.stopPropagation();
                        removeEdge(edge.id);
                      }}
                    >
                      ×
                    </button>
                  ) }
                </span>
              )}
              onClick={e => {
                e.stopPropagation();
                setDropMenu(null);
                setSelection({ type: 'edge', id: edge.id });
              }}
            />
          );
        }) }
      </Graph>
    </InfiniteCanvas>
  );
};
