import { use, useCallback, useMemo, useSyncExternalStore } from 'react';

import {
  AlertsContext,
  DropdownContext,
  FieldControlContext,
  ListContext,
  ToastsContext,
  ModalContext,
  InfiniteCanvasContext,
  GraphContext,
  GraphNodeContext,
} from './contexts';
import { nodeKey } from './Graph/store';

export const useFieldControl = () => use(FieldControlContext);
export const useDropdown = () => use(DropdownContext);
export const useAlerts = () => use(AlertsContext);
export const useList = () => use(ListContext);
export const useToasts = () => use(ToastsContext);
export const useModal = () => use(ModalContext);
export const useInfiniteCanvas = () => use(InfiniteCanvasContext);

export const useInfiniteCanvasCursor = () => {
  const { subscribeCursor, getCursor } = use(InfiniteCanvasContext);

  return useSyncExternalStore(subscribeCursor, getCursor, getCursor);
};

export const useGraph = () => use(GraphContext);
export const useGraphNode = () => use(GraphNodeContext);

const KEYS_SEPARATOR = '\u0000';

/**
 * Re-renders the calling component whenever one of the given graph keys
 * (e.g. `node:<id>`, `connection`) is updated
 */
export const useGraphSubscription = (keys: string[]) => {
  const graph = use(GraphContext);
  const keysId = keys.join(KEYS_SEPARATOR);

  const subscribe = useCallback((listener: () => void) => (
    graph?.subscribe(keysId.split(KEYS_SEPARATOR), listener) ?? (() => {})
  ), [graph, keysId]);

  const getSnapshot = useCallback(() => (
    keysId
      .split(KEYS_SEPARATOR)
      .map(key => graph?.getVersion(key) ?? 0)
      .join(KEYS_SEPARATOR)
  ), [graph, keysId]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};

/**
 * Returns the positions (in graph coordinates) of both ends of an edge, kept up
 * to date while the source/target nodes are moved or resized.
 * Useful to build custom edges.
 */
export const useGraphEdgeAnchors = ({
  source,
  sourceHandle,
  target,
  targetHandle,
}: {
  source: string;
  sourceHandle?: string;
  target: string;
  targetHandle?: string;
}) => {
  const graph = use(GraphContext);
  const version = useGraphSubscription([
    nodeKey(source),
    nodeKey(target),
  ]);

  return useMemo(() => ({
    source: graph?.getAnchor(source, sourceHandle, 'source') ?? null,
    target: graph?.getAnchor(target, targetHandle, 'target') ?? null,
  // `version` is what tells us the graph has been updated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [graph, version, source, sourceHandle, target, targetHandle]);
};
