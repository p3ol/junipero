import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import { classNames, mockState } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import {
  type InfiniteCanvasContextType,
  InfiniteCanvasContext,
} from '../contexts';

export declare type InfiniteCanvasCursorMode =
  | 'default'
  | 'add'
  | 'pan';

export declare type InfiniteCanvasBackgroundPattern =
  | 'dot'
  | 'cross';

export declare interface InfiniteCanvasPadding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export declare interface InfiniteCanvasRef extends JuniperoRef {
  zoom: number;
  offsetX: number;
  offsetY: number;
  fitIntoView: (transitionDuration?: number) => Promise<void>;
  setZoom: (newZoom: number, transitionDuration?: number) => Promise<void>;
  zoomIn: (transitionDuration?: number) => Promise<void>;
  zoomOut: (transitionDuration?: number) => Promise<void>;
  getCursorPosition: () => { x: number; y: number };
  panTo: (x: number, y: number, transitionDuration?: number) => Promise<void>;
  panAndZoomTo: (
    x: number,
    y: number,
    zoom: number,
    transitionDuration?: number
  ) => Promise<void>;
  centerOn: (
    elmt: HTMLElement,
    transitionDuration?: number
  ) => Promise<void>;
  innerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  backgroundRef: RefObject<SVGSVGElement | null>;
}

export declare interface InfiniteCanvasProps extends
  SpecialComponentPropsWithRef<'div', InfiniteCanvasRef> {
  initialZoom?: number;
  initialOffsetX?: number;
  initialOffsetY?: number;
  minZoom?: number;
  maxZoom?: number;
  center?: boolean;
  centerMargin?: number;
  padding?: number | InfiniteCanvasPadding;
  cursorMode?: InfiniteCanvasCursorMode;
  fitAbsolute?: boolean;
  background?: {
    pattern?: InfiniteCanvasBackgroundPattern;
    patternId?: string;
    gap?: number;
    size?: number;
    fill?: string;
    opacity?: number;
  };
  overlay?: ReactNode;
  globalEventsTarget?: EventTarget;
  onZoom?: (zoom: number) => void;
  onPan?: (offsetX: number, offsetY: number) => void;
}

export declare interface InfiniteCanvasState {
  zoom: number;
  offsetX: number;
  offsetY: number;
  animate: number;
  panning: boolean;
}

export interface InfiniteCanvasView {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

// Idle time after the last wheel/drag event before the live view is
// committed to React state (and therefore to context consumers)
export const COMMIT_DELAY = 120;

const InfiniteCanvas = ({
  ref,
  children,
  overlay,
  className,
  background,
  initialZoom,
  initialOffsetX,
  initialOffsetY,
  minZoom = 0.1,
  maxZoom = 10,
  // Only auto-fit on mount if the caller didn't ask for a specific
  // initial zoom/offset, otherwise it would silently override them
  center = initialZoom === undefined &&
    initialOffsetX === undefined &&
    initialOffsetY === undefined,
  centerMargin = 300,
  padding,
  cursorMode = 'default',
  fitAbsolute = true,
  globalEventsTarget = globalThis,
  onZoom,
  onPan,
  ...rest
}: InfiniteCanvasProps) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<SVGSVGElement>(null);
  const patternRef = useRef<SVGPatternElement>(null);
  const patternId = useId();
  const {
    gap = 20,
    size = 1,
    fill = 'var(--dots-color)',
    pattern = 'dot',
    patternId: customPatternId = patternId,
  } = background || {};
  const {
    top: paddingTop = 0,
    right: paddingRight = 0,
    bottom: paddingBottom = 0,
    left: paddingLeft = 0,
  } = typeof padding === 'number'
    ? { top: padding, right: padding, bottom: padding, left: padding }
    : padding || {};
  const view = useRef<InfiniteCanvasView>({
    zoom: initialZoom || 1,
    offsetX: initialOffsetX ?? 0,
    offsetY: initialOffsetY ?? 0,
  });
  const mouse = useRef({ x: 0, y: 0 });
  const panning = useRef({ active: false, startX: 0, startY: 0 });
  const cursor = useRef({ x: 0, y: 0 });
  const cursorListeners = useRef(new Set<() => void>());
  const frame = useRef(0);
  const commitTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [state, dispatch] = useReducer(mockState<InfiniteCanvasState>, {
    zoom: view.current.zoom,
    offsetX: view.current.offsetX,
    offsetY: view.current.offsetY,
    animate: 0,
    panning: false,
  });

  useTimeout(() => {
    dispatch({ animate: 0 });
  }, state.animate, [state.animate], { enabled: state.animate > 0 });

  const getContentTransform = ({ zoom, offsetX, offsetY }: InfiniteCanvasView) =>
    `translate3d(${offsetX}px, ${offsetY}px, 0) scale3d(${zoom}, ${zoom}, 1)`;

  const getPatternTransform = (
    { zoom, offsetX, offsetY }: InfiniteCanvasView,
    size: number,
  ) => (
    `translate(${offsetX} ${offsetY}) scale(${zoom}) translate(${size} ${size})`
  );

  // Read through a ref so a non-memoized onZoom/onPan (recreated on every
  // parent render) can't re-trigger these effects and cause an infinite loop
  const onZoomRef = useRef(onZoom);
  onZoomRef.current = onZoom;
  const onPanRef = useRef(onPan);
  onPanRef.current = onPan;

  useEffect(() => {
    onZoomRef.current?.(state.zoom);
  }, [state.zoom]);

  useEffect(() => {
    onPanRef.current?.(state.offsetX, state.offsetY);
  }, [state.offsetX, state.offsetY]);

  useEffect(() => () => {
    cancelAnimationFrame(frame.current);
    clearTimeout(commitTimer.current);
  }, []);

  const notifyCursor = useCallback(() => {
    const { zoom, offsetX, offsetY } = view.current;
    const x = Math.round((mouse.current.x - offsetX) / zoom);
    const y = Math.round((mouse.current.y - offsetY) / zoom);

    if (x === cursor.current.x && y === cursor.current.y) {
      return;
    }

    cursor.current = { x, y };
    cursorListeners.current.forEach(listener => listener());
  }, []);

  const subscribeCursor = useCallback((listener: () => void) => {
    cursorListeners.current.add(listener);

    return () => {
      cursorListeners.current.delete(listener);
    };
  }, []);

  const getCursor = useCallback(() => cursor.current, []);

  const flushView = useCallback(() => {
    frame.current = 0;

    if (contentRef.current) {
      contentRef.current.style.transform = getContentTransform(view.current);
    }

    patternRef.current?.setAttribute(
      'patternTransform', getPatternTransform(view.current, size)
    );

    notifyCursor();
  }, [size, notifyCursor]);

  const scheduleFlush = useCallback(() => {
    if (!frame.current) {
      frame.current = requestAnimationFrame(flushView);
    }
  }, [flushView]);

  const commitView = useCallback((animate?: number) => {
    clearTimeout(commitTimer.current);

    const { zoom, offsetX, offsetY } = view.current;

    dispatch({
      zoom,
      offsetX,
      offsetY,
      ...animate !== undefined && { animate },
    });
  }, []);

  const scheduleCommit = useCallback(() => {
    clearTimeout(commitTimer.current);
    commitTimer.current = setTimeout(() => commitView(), COMMIT_DELAY);
  }, [commitView]);

  const moveTo = useCallback((
    next: Partial<InfiniteCanvasView>,
    animate: number,
  ) => {
    Object.assign(view.current, next);
    commitView(animate);
    notifyCursor();
  }, [commitView, notifyCursor]);

  useImperativeHandle(ref, () => ({
    get zoom () { return view.current.zoom; },
    get offsetX () { return view.current.offsetX; },
    get offsetY () { return view.current.offsetY; },
    get mouseX () { return mouse.current.x; },
    get mouseY () { return mouse.current.y; },
    fitIntoView,
    setZoom,
    zoomIn,
    zoomOut,
    getCursorPosition,
    panTo,
    panAndZoomTo,
    centerOn,
    innerRef,
    contentRef,
    backgroundRef,
    isJunipero: true,
  }));

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const v = view.current;

    // Zoom
    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = Math.exp(-e.deltaY * 0.01);
      const newZoom = Math.max(minZoom, Math.min(maxZoom, v.zoom * zoomFactor));

      // Mouse position relative to canvas
      const rect = innerRef.current?.getBoundingClientRect();
      const mouseX = e.clientX - (rect?.left ?? 0);
      const mouseY = e.clientY - (rect?.top ?? 0);

      // Mouse position in content coordinates (before transform)
      const contentX = (mouseX - v.offsetX) / v.zoom;
      const contentY = (mouseY - v.offsetY) / v.zoom;

      mouse.current = { x: mouseX, y: mouseY };

      // Adjust offset so zoom centers on mouse position
      v.zoom = newZoom;
      v.offsetX = mouseX - contentX * newZoom;
      v.offsetY = mouseY - contentY * newZoom;
    } else {
      // Pan only
      v.offsetX -= e.deltaX;
      v.offsetY -= e.deltaY;
    }

    scheduleFlush();
    scheduleCommit();
  }, [minZoom, maxZoom, scheduleFlush, scheduleCommit]);

  useEffect(() => {
    const ref = innerRef.current;
    ref?.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      ref?.removeEventListener('wheel', onWheel);
    };
  }, [onWheel]);

  const getContentBounds = useCallback(() => {
    if (!contentRef.current) {
      return null;
    }

    if (!fitAbsolute) {
      return {
        minX: 0,
        minY: 0,
        maxX: contentRef.current.scrollWidth,
        maxY: contentRef.current.scrollHeight,
      };
    }

    const children = Array.from(contentRef.current.children) as
      HTMLElement[];

    if (!children.length) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    return children.reduce((bounds, el) => ({
      minX: Math.min(bounds.minX, el.offsetLeft),
      minY: Math.min(bounds.minY, el.offsetTop),
      maxX: Math.max(bounds.maxX, el.offsetLeft + el.offsetWidth),
      maxY: Math.max(bounds.maxY, el.offsetTop + el.offsetHeight),
    }), {
      minX: Infinity,
      minY: Infinity,
      maxX: -Infinity,
      maxY: -Infinity,
    });
  }, [fitAbsolute]);

  // Portion of the canvas not reserved by padding (e.g. sidebars/overlays),
  // used as the target area/center for fitting and centering operations
  const getVisibleRect = useCallback(() => {
    if (!innerRef.current) {
      return null;
    }

    const rect = innerRef.current.getBoundingClientRect();
    const width = Math.max(rect.width - paddingLeft - paddingRight, 0);
    const height = Math.max(rect.height - paddingTop - paddingBottom, 0);

    return {
      width,
      height,
      centerX: paddingLeft + width / 2,
      centerY: paddingTop + height / 2,
    };
  }, [paddingTop, paddingRight, paddingBottom, paddingLeft]);

  const fitIntoView = useCallback(async (
    transitionDuration?: number,
  ): Promise<void> => {
    const bounds = getContentBounds();
    const visible = getVisibleRect();

    if (!visible || !bounds) {
      return;
    }

    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    const contentCenterX = (bounds.minX + bounds.maxX) / 2;
    const contentCenterY = (bounds.minY + bounds.maxY) / 2;

    // Use a padded box (content + margin) only to determine the zoom level,
    // so the content doesn't end up flush against the visible area's edges
    const zoomX = visible.width === 0 || contentWidth === 0
      ? 1 : visible.width / (contentWidth + centerMargin * 2);
    const zoomY = visible.height === 0 || contentHeight === 0
      ? 1 : visible.height / (contentHeight + centerMargin * 2);

    const newZoom = Math.max(Math.min(zoomX, zoomY, maxZoom), minZoom);

    // Center the actual (unpadded) content's bounding box within the
    // visible area, i.e. excluding any space reserved by padding
    const newOffsetX = visible.centerX - contentCenterX * newZoom;
    const newOffsetY = visible.centerY - contentCenterY * newZoom;
    const animate = transitionDuration ?? 100;

    moveTo({
      zoom: newZoom,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    }, animate);

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, [
    minZoom, maxZoom, centerMargin, getContentBounds, getVisibleRect, moveTo,
  ]);

  useLayoutEffect(() => {
    if (!center) {
      return;
    }

    fitIntoView(0);
    // Mount only: a padding change (e.g. sidebar resize) must not reset the view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setZoom = useCallback(async (
    newZoom: number,
    transitionDuration?: number
  ): Promise<void> => {
    const visible = getVisibleRect();

    if (!visible) {
      return;
    }

    const newZoomClamped = Math.max(Math.min(newZoom, maxZoom), minZoom);

    // Keep whatever content point is currently at the visible area's
    // center fixed, instead of jumping back to the content's bounds center
    const { zoom, offsetX, offsetY } = view.current;
    const centerContentX = (visible.centerX - offsetX) / zoom;
    const centerContentY = (visible.centerY - offsetY) / zoom;

    const newOffsetX = visible.centerX - centerContentX * newZoomClamped;
    const newOffsetY = visible.centerY - centerContentY * newZoomClamped;
    const animate = transitionDuration ?? 100;

    moveTo({
      zoom: newZoomClamped,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    }, animate);

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, [minZoom, maxZoom, getVisibleRect, moveTo]);

  const zoomIn = useCallback((transitionDuration?: number) => {
    const newZoom = (view.current.zoom || 1) * 1.2;

    return setZoom(newZoom, transitionDuration);
  }, [setZoom]);

  const zoomOut = useCallback((transitionDuration?: number) => {
    const newZoom = (view.current.zoom || 1) / 1.2;

    return setZoom(newZoom, transitionDuration);
  }, [setZoom]);

  const getCursorPosition = useCallback(() => {
    if (!innerRef.current) {
      return { x: 0, y: 0 };
    }

    const { zoom, offsetX, offsetY } = view.current;

    return {
      x: Math.round((mouse.current.x - offsetX) / zoom),
      y: Math.round((mouse.current.y - offsetY) / zoom),
    };
  }, []);

  const panTo = useCallback(async (
    x: number,
    y: number,
    transitionDuration?: number
  ): Promise<void> => {
    const visible = getVisibleRect();

    if (!visible || !contentRef.current) {
      return;
    }

    const newOffsetX = visible.centerX - x * view.current.zoom;
    const newOffsetY = visible.centerY - y * view.current.zoom;
    const animate = transitionDuration ?? 100;

    moveTo({ offsetX: newOffsetX, offsetY: newOffsetY }, animate);

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, [getVisibleRect, moveTo]);

  const panAndZoomTo = useCallback(async (
    x: number,
    y: number,
    newZoom: number,
    transitionDuration?: number
  ): Promise<void> => {
    const visible = getVisibleRect();

    if (!visible || !contentRef.current) {
      return;
    }

    const newZoomClamped = Math.max(Math.min(newZoom, maxZoom), minZoom);
    const newOffsetX = visible.centerX - x * newZoomClamped;
    const newOffsetY = visible.centerY - y * newZoomClamped;
    const animate = transitionDuration ?? 100;

    moveTo({
      zoom: newZoomClamped,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    }, animate);

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, [minZoom, maxZoom, getVisibleRect, moveTo]);

  const getElementBounds = useCallback((elmt: HTMLElement) => {
    if (!contentRef.current || !elmt) {
      return null;
    }

    let x = 0;
    let y = 0;
    let node: HTMLElement | null = elmt;

    while (node && node !== contentRef.current) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }

    return {
      minX: x,
      minY: y,
      maxX: x + elmt.offsetWidth,
      maxY: y + elmt.offsetHeight,
    };
  }, []);

  const centerOn = useCallback(async (
    elmt: HTMLElement,
    transitionDuration?: number,
  ): Promise<void> => {
    const bounds = elmt && getElementBounds(elmt);
    const visible = getVisibleRect();

    if (!visible || !bounds) {
      return;
    }

    const elWidth = bounds.maxX - bounds.minX;
    const elHeight = bounds.maxY - bounds.minY;
    const elCenterX = (bounds.minX + bounds.maxX) / 2;
    const elCenterY = (bounds.minY + bounds.maxY) / 2;

    const zoomX = visible.width === 0 || elWidth === 0
      ? 1 : visible.width / (elWidth + centerMargin * 2);
    const zoomY = visible.height === 0 || elHeight === 0
      ? 1 : visible.height / (elHeight + centerMargin * 2);

    const newZoom = Math.max(Math.min(zoomX, zoomY, maxZoom), minZoom);

    const newOffsetX = visible.centerX - elCenterX * newZoom;
    const newOffsetY = visible.centerY - elCenterY * newZoom;
    const animate = transitionDuration ?? 100;

    moveTo({
      zoom: newZoom,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
    }, animate);

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, [
    minZoom, maxZoom, centerMargin, getElementBounds, getVisibleRect, moveTo,
  ]);

  // Only committed values are exposed, so consumers re-render once per
  // gesture instead of once per event
  const context = useMemo((): InfiniteCanvasContextType => ({
    zoom: state.zoom,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    subscribeCursor,
    getCursor,
    fitIntoView,
    panTo,
    panAndZoomTo,
    centerOn,
    setZoom,
    zoomIn,
    zoomOut,
  }), [
    state.zoom, state.offsetX, state.offsetY, subscribeCursor, getCursor,
    fitIntoView, setZoom, zoomIn, zoomOut, panTo, panAndZoomTo, centerOn,
  ]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (cursorMode !== 'pan') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    panning.current = { active: true, startX: e.clientX, startY: e.clientY };
    dispatch({ panning: true });
  }, [cursorMode]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    // Track cursor position relative to the canvas, not the viewport, so it
    // stays consistent with offsetX/offsetY regardless of where the canvas
    // is positioned on the page
    const rect = innerRef.current?.getBoundingClientRect();

    mouse.current = {
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
    };

    if (!panning.current.active || cursorMode !== 'pan') {
      notifyCursor();

      return;
    }

    view.current.offsetX += e.clientX - panning.current.startX;
    view.current.offsetY += e.clientY - panning.current.startY;
    panning.current.startX = e.clientX;
    panning.current.startY = e.clientY;

    scheduleFlush();
    scheduleCommit();
  }, [cursorMode, notifyCursor, scheduleFlush, scheduleCommit]);

  const onMouseUp = useCallback(() => {
    if (!panning.current.active || cursorMode !== 'pan') {
      return;
    }

    panning.current = { active: false, startX: 0, startY: 0 };
    dispatch({ panning: false });
    commitView();
  }, [cursorMode, commitView]);

  useEffect(() => {
    if (['pan', 'add'].includes(cursorMode)) {
      globalEventsTarget.addEventListener('mousemove', onMouseMove);
      globalEventsTarget.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      globalEventsTarget.removeEventListener('mousemove', onMouseMove);
      globalEventsTarget.removeEventListener('mouseup', onMouseUp);
    };
  }, [
    onMouseMove, onMouseUp,
    globalEventsTarget, cursorMode,
  ]);

  return (
    <InfiniteCanvasContext value={context}>
      <div
        { ...rest }
        ref={innerRef}
        className={classNames(
          'junipero infinite-canvas',
          'cursor-mode-' + cursorMode,
          {
            'panning': state.panning,
          },
          className,
        )}
        onMouseDown={onMouseDown}
      >
        <div
          ref={contentRef}
          className={classNames(
            'infinite-canvas-content',
          )}
          style={{
            transform: getContentTransform(view.current),
            transformOrigin: '0 0',
            ...state.animate > 0 && {
              transition: `transform ${state.animate}ms ease-in-out`,
            },
          }}
        >
          { children }
        </div>

        { overlay }

        <svg ref={backgroundRef} className="infinite-canvas-background">
          <pattern
            ref={patternRef}
            id={customPatternId}
            patternUnits="userSpaceOnUse"
            width={gap}
            height={gap}
            patternTransform={getPatternTransform(view.current, size)}
          >
            { pattern === 'cross' ? (
              <>
                <line
                  x1={size * 2}
                  y1="0"
                  x2={size * 2}
                  y2={size * 4}
                  stroke={fill}
                  strokeWidth={size / 4}
                />
                <line
                  x1="0"
                  y1={size * 2}
                  x2={size * 4}
                  y2={size * 2}
                  stroke={fill}
                  strokeWidth={size / 4}
                />
              </>
            ) : (
              <circle
                cx={size}
                cy={size}
                r={size}
                fill={fill}
              />
            ) }
          </pattern>

          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${customPatternId})`}
          />
        </svg>
      </div>
    </InfiniteCanvasContext>
  );
};

InfiniteCanvas.displayName = 'InfiniteCanvas';

export default InfiniteCanvas;
