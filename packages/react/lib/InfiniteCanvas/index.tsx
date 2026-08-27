import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
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
  mouseX: number;
  mouseY: number;
  offsetX: number;
  offsetY: number;
  animate: number;
  panning: boolean;
  panStartX: number;
  panStartY: number;
}

const InfiniteCanvas = ({
  ref,
  children,
  overlay,
  className,
  background,
  initialZoom = 1,
  initialOffsetX = 0,
  initialOffsetY = 0,
  minZoom = 0.1,
  maxZoom = 10,
  center = true,
  centerMargin = 300,
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
  const patternId = useId();
  const {
    gap = 20,
    size = 1,
    fill = 'var(--dots-color)',
    pattern = 'dot',
    patternId: customPatternId = patternId,
  } = background || {};
  const [state, dispatch] = useReducer(mockState<InfiniteCanvasState>, {
    zoom: initialZoom || 1,
    mouseX: 0,
    mouseY: 0,
    offsetX: initialOffsetX,
    offsetY: initialOffsetY,
    animate: 0,
    panning: false,
    panStartX: 0,
    panStartY: 0,
  });

  useTimeout(() => {
    dispatch({ animate: 0 });
  }, state.animate, [state.animate], { enabled: state.animate > 0 });

  useEffect(() => {
    onZoom?.(state.zoom);
  }, [state.zoom, onZoom]);

  useEffect(() => {
    onPan?.(state.offsetX, state.offsetY);
  }, [state.offsetX, state.offsetY, onPan]);

  useImperativeHandle(ref, () => ({
    zoom: state.zoom,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    mouseX: state.mouseX,
    mouseY: state.mouseY,
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

    // Zoom
    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = Math.exp(-e.deltaY * 0.01);
      const newZoom = Math.max(minZoom,
        Math.min(maxZoom, state.zoom * zoomFactor));

      // Mouse position relative to canvas
      const rect = innerRef.current?.getBoundingClientRect();
      const mouseX = e.clientX - (rect?.left ?? 0);
      const mouseY = e.clientY - (rect?.top ?? 0);

      // Mouse position in content coordinates (before transform)
      const contentX = (mouseX - state.offsetX) / state.zoom;
      const contentY = (mouseY - state.offsetY) / state.zoom;

      // Adjust offset so zoom centers on mouse position
      const newOffsetX = mouseX - contentX * newZoom;
      const newOffsetY = mouseY - contentY * newZoom;

      dispatch({
        zoom: newZoom,
        offsetX: newOffsetX,
        offsetY: newOffsetY,
      });
    } else {
      // Pan only
      dispatch({
        offsetX: state.offsetX - e.deltaX,
        offsetY: state.offsetY - e.deltaY,
      });
    }
  }, [state.zoom, state.offsetX, state.offsetY, minZoom, maxZoom]);

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

  const fitIntoView = useCallback(async (
    transitionDuration?: number,
  ): Promise<void> => {
    const bounds = getContentBounds();

    if (!innerRef.current || !bounds) {
      return;
    }

    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    const contentCenterX = (bounds.minX + bounds.maxX) / 2;
    const contentCenterY = (bounds.minY + bounds.maxY) / 2;

    const rect = innerRef.current.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    // Use a padded box (content + margin) only to determine the zoom level,
    // so the content doesn't end up flush against the canvas edges
    const zoomX = canvasWidth === 0 || contentWidth === 0
      ? 1 : canvasWidth / (contentWidth + centerMargin * 2);
    const zoomY = canvasHeight === 0 || contentHeight === 0
      ? 1 : canvasHeight / (contentHeight + centerMargin * 2);

    const newZoom = Math.max(Math.min(zoomX, zoomY, maxZoom), minZoom);

    // Center the actual (unpadded) content's bounding box at the new zoom
    const newOffsetX = canvasWidth / 2 - contentCenterX * newZoom;
    const newOffsetY = canvasHeight / 2 - contentCenterY * newZoom;
    const animate = transitionDuration ?? 100;

    dispatch({
      zoom: newZoom,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
      animate,
    });

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, [minZoom, maxZoom, centerMargin, getContentBounds]);

  useLayoutEffect(() => {
    if (!center) {
      return;
    }

    fitIntoView(0);
  }, [center, fitIntoView]);

  const setZoom = useCallback(async (
    newZoom: number,
    transitionDuration?: number
  ): Promise<void> => {
    const bounds = getContentBounds();

    if (
      newZoom < minZoom ||
      newZoom > maxZoom ||
      !innerRef.current ||
      !bounds
    ) {
      return;
    }

    const rect = innerRef.current.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const contentCenterX = (bounds.minX + bounds.maxX) / 2;
    const contentCenterY = (bounds.minY + bounds.maxY) / 2;

    const newZoomClamped = Math.max(Math.min(newZoom, maxZoom), minZoom);
    const newOffsetX = canvasWidth / 2 - contentCenterX * newZoomClamped;
    const newOffsetY = canvasHeight / 2 - contentCenterY * newZoomClamped;
    const animate = transitionDuration ?? 100;

    dispatch({
      zoom: newZoomClamped,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
      animate,
    });

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, [minZoom, maxZoom, getContentBounds]);

  const zoomIn = useCallback((transitionDuration?: number) => {
    const newZoom = (state.zoom || 1) * 1.2;

    return setZoom(newZoom, transitionDuration);
  }, [state.zoom, setZoom]);

  const zoomOut = useCallback((transitionDuration?: number) => {
    const newZoom = (state.zoom || 1) / 1.2;

    return setZoom(newZoom, transitionDuration);
  }, [state.zoom, setZoom]);

  const getCursorPosition = useCallback(() => {
    if (!innerRef.current) {
      return { x: 0, y: 0 };
    }

    return {
      x: Math.round((state.mouseX - state.offsetX) / state.zoom),
      y: Math.round((state.mouseY - state.offsetY) / state.zoom),
    };
  }, [state.mouseX, state.mouseY, state.zoom, state.offsetX, state.offsetY]);

  const panTo = useCallback(async (
    x: number,
    y: number,
    transitionDuration?: number
  ): Promise<void> => {
    if (!innerRef.current || !contentRef.current) {
      return;
    }

    const rect = innerRef.current.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const newOffsetX = canvasWidth / 2 - x * state.zoom;
    const newOffsetY = canvasHeight / 2 - y * state.zoom;
    const animate = transitionDuration ?? 100;

    dispatch({
      offsetX: newOffsetX,
      offsetY: newOffsetY,
      animate,
    });

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, [state.zoom]);

  const panAndZoomTo = useCallback(async (
    x: number,
    y: number,
    newZoom: number,
    transitionDuration?: number
  ): Promise<void> => {
    if (!innerRef.current || !contentRef.current) {
      return;
    }

    const rect = innerRef.current.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const newOffsetX = canvasWidth / 2 - x * newZoom;
    const newOffsetY = canvasHeight / 2 - y * newZoom;
    const animate = transitionDuration ?? 100;

    dispatch({
      zoom: newZoom,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
      animate,
    });

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, []);

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

    if (!innerRef.current || !bounds) {
      return;
    }

    const elWidth = bounds.maxX - bounds.minX;
    const elHeight = bounds.maxY - bounds.minY;
    const elCenterX = (bounds.minX + bounds.maxX) / 2;
    const elCenterY = (bounds.minY + bounds.maxY) / 2;

    const rect = innerRef.current.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const zoomX = canvasWidth / (elWidth + centerMargin * 2);
    const zoomY = canvasHeight / (elHeight + centerMargin * 2);

    const newZoom = Math.max(Math.min(zoomX, zoomY, maxZoom), minZoom);

    const newOffsetX = canvasWidth / 2 - elCenterX * newZoom;
    const newOffsetY = canvasHeight / 2 - elCenterY * newZoom;
    const animate = transitionDuration ?? 100;

    dispatch({
      zoom: newZoom,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
      animate,
    });

    if (animate > 0) {
      return new Promise(resolve => {
        setTimeout(resolve, animate);
      });
    }
  }, [minZoom, maxZoom, centerMargin, getElementBounds]);

  const getContext = useCallback((): InfiniteCanvasContextType => ({
    zoom: state.zoom,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    mouseX: state.mouseX,
    mouseY: state.mouseY,
    fitIntoView,
    panTo,
    panAndZoomTo,
    centerOn,
    setZoom,
    zoomIn,
    zoomOut,
  }), [
    state.zoom, state.offsetX, state.offsetY, state.mouseX, state.mouseY,
    fitIntoView, setZoom, zoomIn, zoomOut, panTo, panAndZoomTo, centerOn,
  ]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (cursorMode !== 'pan') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    dispatch({
      panning: true,
      panStartX: e.clientX,
      panStartY: e.clientY,
    });
  }, [cursorMode]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!state.panning || cursorMode !== 'pan') {
      dispatch({ mouseX: e.clientX, mouseY: e.clientY });

      return;
    }

    const deltaX = e.clientX - state.panStartX;
    const deltaY = e.clientY - state.panStartY;

    dispatch({
      mouseX: e.clientX,
      mouseY: e.clientY,
      offsetX: state.offsetX + deltaX,
      offsetY: state.offsetY + deltaY,
      panStartX: e.clientX,
      panStartY: e.clientY,
    });
  }, [
    state.panStartX, state.panStartY, state.offsetX, state.offsetY,
    state.panning,
    cursorMode,
  ]);

  const onMouseUp = useCallback(() => {
    if (!state.panning || cursorMode !== 'pan') {
      return;
    }

    dispatch({
      panning: false,
      panStartX: 0,
      panStartY: 0,
    });
  }, [state.panning, cursorMode]);

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

  const scaledPatternGap = gap * state.zoom;
  const scaledPatternSize = size * state.zoom;

  return (
    <InfiniteCanvasContext value={getContext()}>
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
            transform:
              `translate3d(${state.offsetX}px, ${state.offsetY}px, 0) ` +
              `scale3d(${state.zoom}, ${state.zoom}, 1)`,
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
            id={customPatternId}
            patternUnits="userSpaceOnUse"
            x={state.offsetX % scaledPatternGap}
            y={state.offsetY % scaledPatternGap}
            width={scaledPatternGap}
            height={scaledPatternGap}
            patternTransform={
              `translate(${scaledPatternSize}, ${scaledPatternSize})`
            }
          >
            { pattern === 'cross' ? (
              <>
                <line
                  x1={scaledPatternSize * 2}
                  y1="0"
                  x2={scaledPatternSize * 2}
                  y2={scaledPatternSize * 4}
                  stroke={fill}
                  strokeWidth={scaledPatternSize / 4}
                />
                <line
                  x1="0"
                  y1={scaledPatternSize * 2}
                  x2={scaledPatternSize * 4}
                  y2={scaledPatternSize * 2}
                  stroke={fill}
                  strokeWidth={scaledPatternSize / 4}
                />
              </>
            ) : (
              <circle
                cx={scaledPatternSize}
                cy={scaledPatternSize}
                r={scaledPatternSize}
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
