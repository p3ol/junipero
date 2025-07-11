import {
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { classNames, mockState } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import type { JuniperoRef, SpecialComponentPropsWithRef } from '../types';
import { InfiniteCanvasContext } from '../contexts';

export declare type InfiniteCanvasCursorMode =
  | 'default'
  | 'pan';

export declare type InfiniteCanvasBackgroundPattern =
  | 'dot'
  | 'cross';

export declare interface InfiniteCanvasRef extends JuniperoRef {
  zoom: number;
  offsetX: number;
  offsetY: number;
  fitIntoView: (transitionDuration?: number) => void;
  setZoom: (newZoom: number, transitionDuration?: number) => void;
  zoomIn: (transitionDuration?: number) => void;
  zoomOut: (transitionDuration?: number) => void;
  innerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  backgroundRef: RefObject<SVGSVGElement | null>;
}

export declare interface InfiniteCanvasProps extends
  SpecialComponentPropsWithRef<'div', InfiniteCanvasRef> {
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  centerMargin?: number;
  cursorMode?: InfiniteCanvasCursorMode;
  background?: {
    pattern?: InfiniteCanvasBackgroundPattern;
    gap?: number;
    size?: number;
    fill?: string;
    opacity?: number;
  };
  overlay?: ReactNode;
  globalEventsTarget?: EventTarget;
}

export declare interface InfiniteCanvasState {
  zoom: number;
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
  minZoom = 0.1,
  maxZoom = 10,
  centerMargin = 1000,
  cursorMode = 'default',
  globalEventsTarget = globalThis,
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
  } = background || {};
  const [state, dispatch] = useReducer(mockState<InfiniteCanvasState>, {
    zoom: initialZoom || 1,
    offsetX: 0,
    offsetY: 0,
    animate: 0,
    panning: false,
    panStartX: 0,
    panStartY: 0,
  });

  useTimeout(() => {
    dispatch({ animate: 0 });
  }, state.animate, [state.animate], { enabled: state.animate > 0 });

  useImperativeHandle(ref, () => ({
    zoom: state.zoom,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    fitIntoView,
    setZoom,
    zoomIn,
    zoomOut,
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

  const fitIntoView = useCallback((transitionDuration?: number) => {
    if (!innerRef.current || !contentRef.current) {
      return;
    }

    const contentWidth = contentRef.current.scrollWidth + centerMargin * 2;
    const contentHeight = contentRef.current.scrollHeight + centerMargin * 2;

    const rect = innerRef.current.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const zoomX = canvasWidth / contentWidth;
    const zoomY = canvasHeight / contentHeight;

    const newZoom = Math.max(Math.min(zoomX, zoomY, maxZoom), minZoom);

    // TODO: this is quite off due to margins but can't do better for now
    const newOffsetX = (canvasWidth - contentWidth * newZoom) / 2 +
      centerMargin / 2;
    const newOffsetY = (canvasHeight - contentHeight * newZoom) / 2 +
      centerMargin / 2;

    dispatch({
      zoom: newZoom,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
      animate: transitionDuration ?? 100,
    });
  }, [minZoom, maxZoom, centerMargin]);

  const setZoom = useCallback((
    newZoom: number,
    transitionDuration?: number
  ) => {
    if (
      newZoom < minZoom ||
      newZoom > maxZoom ||
      !innerRef.current ||
      !contentRef.current
    ) {
      return;
    }

    const rect = innerRef.current.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const contentWidth = contentRef.current.scrollWidth + centerMargin * 2;
    const contentHeight = contentRef.current.scrollHeight + centerMargin * 2;

    const newZoomClamped = Math.max(Math
      .min(newZoom, maxZoom), minZoom);
    const newOffsetX = (canvasWidth - contentWidth * newZoomClamped) / 2 +
      centerMargin / 2;
    const newOffsetY = (canvasHeight - contentHeight * newZoomClamped) / 2 +
      centerMargin / 2;

    dispatch({
      zoom: newZoomClamped,
      offsetX: newOffsetX,
      offsetY: newOffsetY,
      animate: transitionDuration ?? 100,
    });
  }, [minZoom, maxZoom, centerMargin]);

  const zoomIn = useCallback((transitionDuration?: number) => {
    const newZoom = (state.zoom || 1) * 1.2;
    setZoom(newZoom, transitionDuration);
  }, [state.zoom, setZoom]);

  const zoomOut = useCallback((transitionDuration?: number) => {
    const newZoom = (state.zoom || 1) / 1.2;
    setZoom(newZoom, transitionDuration);
  }, [state.zoom, setZoom]);

  const getContext = useCallback(() => ({
    zoom: state.zoom,
    offsetX: state.offsetX,
    offsetY: state.offsetY,
    fitIntoView,
    setZoom,
    zoomIn,
    zoomOut,
  }), [
    state.zoom, state.offsetX, state.offsetY,
    fitIntoView, setZoom, zoomIn, zoomOut,
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
      return;
    }

    const deltaX = e.clientX - state.panStartX;
    const deltaY = e.clientY - state.panStartY;

    dispatch({
      offsetX: state.offsetX + deltaX,
      offsetY: state.offsetY + deltaY,
      panStartX: e.clientX,
      panStartY: e.clientY,
    });
  }, [
    state.panStartX, state.panStartY, state.offsetX, state.offsetY,
    state.panning, cursorMode,
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
    if (state.panning && cursorMode === 'pan') {
      globalEventsTarget.addEventListener('mousemove', onMouseMove);
      globalEventsTarget.addEventListener('mouseup', onMouseUp);
    }

    return () => {
      globalEventsTarget.removeEventListener('mousemove', onMouseMove);
      globalEventsTarget.removeEventListener('mouseup', onMouseUp);
    };
  }, [
    state.panning,
    cursorMode, globalEventsTarget,
    onMouseMove, onMouseUp,
  ]);

  const scaledPatternGap = gap * state.zoom;
  const scaledPatternSize = size * state.zoom;

  return (
    <InfiniteCanvasContext.Provider value={getContext()}>
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
            id={patternId}
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
            fill={`url(#${patternId})`}
          />
        </svg>
      </div>
    </InfiniteCanvasContext.Provider>
  );
};

InfiniteCanvas.displayName = 'InfiniteCanvas';

export default InfiniteCanvas;
