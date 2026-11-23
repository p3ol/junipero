export declare type GraphHandleType = 'source' | 'target';

export declare type GraphHandlePosition =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left';

export declare interface GraphPoint {
  x: number;
  y: number;
}

export declare interface GraphAnchor extends GraphPoint {
  position: GraphHandlePosition;
}

export declare interface GraphConnection {
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
}

export declare interface GraphHandleInfo {
  nodeId: string;
  handleId: string;
  type: GraphHandleType;
}

export declare interface GraphConnectEndParams {
  from: GraphHandleInfo;
  to: GraphHandleInfo | null;
  /** Normalized connection, only set if it was valid and accepted */
  connection: GraphConnection | null;
  /** Pointer position (in canvas coordinates) when the connection ended */
  position: GraphPoint;
}

export declare interface GraphNodeEntry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export declare interface GraphHandleEntry {
  type: GraphHandleType;
  position: GraphHandlePosition;
  connectable: boolean;
  /** Center of the handle, relative to its node's top-left corner */
  x: number;
  y: number;
  measure: () => GraphPoint;
}

export declare interface GraphPendingConnection {
  from: GraphHandleInfo;
  hovered: GraphHandleInfo | null;
  hoveredValid: boolean;
}

export declare interface GraphStoreOptions {
  toGraphPoint: (clientX: number, clientY: number) => GraphPoint;
  onConnect?: (connection: GraphConnection) => void;
  onConnectStart?: (from: GraphHandleInfo) => void;
  onConnectEnd?: (params: GraphConnectEndParams) => void;
  isValidConnection?: (connection: GraphConnection) => boolean;
}

export const CONNECTION_KEY = 'connection';
export const CONNECTION_CURSOR_KEY = 'connection:cursor';
export const NODES_KEY = 'nodes';
export const nodeKey = (id: string) => `node:${id}`;

/**
 * Small external store shared by a Graph and its nodes, handles
 * & edges. Updates are scoped by key (one per node + the pending
 * connection) so that moving a node only re-renders the edges attached to
 * it, instead of the whole canvas.
 */
export class GraphStore {
  nodes = new Map<string, GraphNodeEntry>();
  handles = new Map<string, Map<string, GraphHandleEntry>>();
  connection: GraphPendingConnection | null = null;
  cursor: GraphPoint = { x: 0, y: 0 };
  options: GraphStoreOptions = {
    toGraphPoint: (x, y) => ({ x, y }),
  };

  private _listeners = new Map<string, Set<() => void>>();
  private _versions = new Map<string, number>();

  subscribe (keys: string[], listener: () => void) {
    keys.forEach(key => {
      if (!this._listeners.has(key)) {
        this._listeners.set(key, new Set());
      }

      this._listeners.get(key).add(listener);
    });

    return () => {
      keys.forEach(key => {
        this._listeners.get(key)?.delete(listener);
      });
    };
  }

  getVersion (key: string) {
    return this._versions.get(key) ?? 0;
  }

  emit (key: string) {
    this._versions.set(key, this.getVersion(key) + 1);
    this._listeners.get(key)?.forEach(listener => listener());
  }

  emitNode (id: string) {
    this.emit(nodeKey(id));
    this.emit(NODES_KEY);
  }

  // Nodes

  setNode (id: string, entry: Partial<GraphNodeEntry>) {
    const prev = this.nodes.get(id);
    const next = { x: 0, y: 0, width: 0, height: 0, ...prev, ...entry };

    if (
      prev &&
      prev.x === next.x && prev.y === next.y &&
      prev.width === next.width && prev.height === next.height
    ) {
      return;
    }

    this.nodes.set(id, next);
    this.emitNode(id);
  }

  removeNode (id: string) {
    if (this.nodes.delete(id)) {
      this.emitNode(id);
    }
  }

  /**
   * Bounding box of all the nodes, in graph coordinates
   */
  getBounds () {
    const nodes = Array.from(this.nodes.values());

    if (!nodes.length) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    return nodes.reduce((bounds, node) => ({
      minX: Math.min(bounds.minX, node.x),
      minY: Math.min(bounds.minY, node.y),
      maxX: Math.max(bounds.maxX, node.x + node.width),
      maxY: Math.max(bounds.maxY, node.y + node.height),
    }), {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    });
  }

  // Handles

  setHandle (
    nodeId: string,
    handleId: string,
    entry: Omit<GraphHandleEntry, 'x' | 'y'>,
  ) {
    if (!this.handles.has(nodeId)) {
      this.handles.set(nodeId, new Map());
    }

    const { x, y } = entry.measure();
    this.handles.get(nodeId).set(handleId, { ...entry, x, y });
    this.emit(nodeKey(nodeId));
  }

  removeHandle (nodeId: string, handleId: string) {
    if (this.handles.get(nodeId)?.delete(handleId)) {
      this.emit(nodeKey(nodeId));
    }
  }

  /**
   * Re-measure every handle of a node, usually after it has been resized
   */
  measureHandles (nodeId: string) {
    let changed = false;

    this.handles.get(nodeId)?.forEach(handle => {
      const { x, y } = handle.measure();

      if (x !== handle.x || y !== handle.y) {
        handle.x = x;
        handle.y = y;
        changed = true;
      }
    });

    if (changed) {
      this.emit(nodeKey(nodeId));
    }
  }

  /**
   * Returns the absolute (canvas) position of a node's handle. Falls back to
   * the first handle of the right type, then to the middle of the node's
   * right (source) or left (target) side if it doesn't have any handle.
   */
  getAnchor (
    nodeId: string,
    handleId: string | undefined,
    type: GraphHandleType,
  ): GraphAnchor | null {
    const node = this.nodes.get(nodeId);

    if (!node) {
      return null;
    }

    const handles = this.handles.get(nodeId);
    const handle = handleId
      ? handles?.get(handleId)
      : Array.from(handles?.values() || []).find(h => h.type === type);

    if (handle) {
      return {
        x: node.x + handle.x,
        y: node.y + handle.y,
        position: handle.position,
      };
    }

    return {
      x: type === 'source' ? node.x + node.width : node.x,
      y: node.y + node.height / 2,
      position: type === 'source' ? 'right' : 'left',
    };
  }

  // Connections

  getConnection (
    from: GraphHandleInfo,
    to: GraphHandleInfo | null,
  ): GraphConnection | null {
    if (
      !to ||
      to.type === from.type ||
      (to.nodeId === from.nodeId && to.handleId === from.handleId) ||
      this.handles.get(to.nodeId)?.get(to.handleId)?.connectable === false
    ) {
      return null;
    }

    const [source, target] = from.type === 'source' ? [from, to] : [to, from];
    const connection = {
      source: source.nodeId,
      sourceHandle: source.handleId,
      target: target.nodeId,
      targetHandle: target.handleId,
    };

    return this.options.isValidConnection?.(connection) === false
      ? null
      : connection;
  }

  startConnection (from: GraphHandleInfo, cursor: GraphPoint) {
    this.connection = { from, hovered: null, hoveredValid: false };
    this.cursor = cursor;
    this.options.onConnectStart?.(from);
    this.emit(CONNECTION_KEY);
    this.emit(CONNECTION_CURSOR_KEY);
  }

  moveConnection (cursor: GraphPoint) {
    if (!this.connection) {
      return;
    }

    this.cursor = cursor;
    this.emit(CONNECTION_CURSOR_KEY);
  }

  hoverHandle (handle: GraphHandleInfo | null) {
    if (!this.connection) {
      return;
    }

    this.connection = {
      ...this.connection,
      hovered: handle,
      hoveredValid: !!this.getConnection(this.connection.from, handle),
    };
    this.emit(CONNECTION_KEY);
  }

  endConnection (cursor: GraphPoint) {
    if (!this.connection) {
      return;
    }

    const { from, hovered } = this.connection;
    const connection = this.getConnection(from, hovered);

    this.connection = null;
    this.emit(CONNECTION_KEY);
    this.emit(CONNECTION_CURSOR_KEY);

    if (connection) {
      this.options.onConnect?.(connection);
    }

    this.options.onConnectEnd?.({
      from,
      to: hovered,
      connection,
      position: cursor,
    });
  }

  cancelConnection () {
    if (!this.connection) {
      return;
    }

    this.connection = null;
    this.emit(CONNECTION_KEY);
    this.emit(CONNECTION_CURSOR_KEY);
  }
}
