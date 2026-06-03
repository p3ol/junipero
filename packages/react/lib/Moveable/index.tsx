import {
  type ComponentPropsWithoutRef,
  type MouseEvent as ReactMouseEvent,
  type Ref,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { mockState, classNames } from '@junipero/core';

export declare interface MoveableState {
  moving: boolean;
  deltaX: number;
  deltaY: number;
  mouseX: number;
  mouseY: number;
  startX: number;
  startY: number;
}

export declare type MoveableStrategy = 'transform' | 'position';

export declare type MoveableRef = any;

export declare interface MoveableProps extends ComponentPropsWithoutRef<any> {
  ref?: Ref<MoveableRef>;
  x?: number;
  y?: number;
  transformScale?: number;
  strategy?: MoveableStrategy;
  disabled?: boolean;
  step?: number;
  onMouseDown?: (
    e: ReactMouseEvent<HTMLDivElement>
  ) => void;
  onMoveStart?: (
    e: ReactMouseEvent<HTMLDivElement>
  ) => void;
  onMove?: (
    state: MoveableState,
    e: MouseEvent
  ) => void;
  onMoveEnd?: (
    state: MoveableState,
    e: MouseEvent
  ) => void;
}

const Moveable = ({
  ref,
  x,
  y,
  style,
  className,
  step = 1,
  transformScale = 1,
  strategy = 'transform',
  disabled = false,
  onMouseDown,
  onMoveStart,
  onMove,
  onMoveEnd,
  ...rest
}: MoveableProps) => {
  const [state, dispatch] = useReducer(mockState<MoveableState>, {
    moving: false,
    mouseX: 0,
    mouseY: 0,
    deltaX: Math.round((x || 0) / step) * step,
    deltaY: Math.round((y || 0) / step) * step,
    startX: 0,
    startY: 0,
  });

  useEffect(() => {
    dispatch({
      deltaX: Math.round((x || 0) / step) * step,
      deltaY: Math.round((y || 0) / step) * step,
    });
  }, [x, y, step]);

  const onMouseDown_ = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled) {
      onMouseDown?.(e);

      return;
    }

    dispatch({
      moving: true,
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: state.deltaX,
      startY: state.deltaY,
    });

    onMoveStart?.(e);
    onMouseDown?.(e);
  }, [disabled, state.deltaX, state.deltaY, onMoveStart, onMouseDown]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!state.moving || disabled) {
      return;
    }

    const rawDeltaX = (e.clientX - state.mouseX +
      (state.startX * transformScale)) / transformScale;
    const rawDeltaY = (e.clientY - state.mouseY +
      (state.startY * transformScale)) / transformScale;

    state.deltaX = Math.round(rawDeltaX / step) * step;
    state.deltaY = Math.round(rawDeltaY / step) * step;

    dispatch({ deltaX: state.deltaX, deltaY: state.deltaY });
    onMove?.(state, e);
  }, [disabled, state, onMove, transformScale, step]);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (!state.moving || disabled) {
      return;
    }

    state.moving = false;
    state.mouseX = 0;
    state.mouseY = 0;
    state.startX = state.deltaX;
    state.startY = state.deltaY;

    dispatch({
      moving: false,
      mouseX: 0,
      mouseY: 0,
      startX: state.deltaX,
      startY: state.deltaY,
    });

    onMoveEnd?.(state, e);
  }, [disabled, state, onMoveEnd]);

  useEffect(() => {
    if (state.moving) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [state.moving, onMouseMove, onMouseUp]);

  return (
    <Slot
      { ...rest }
      ref={ref}
      className={classNames(
        className,
        'junipero moveable',
        { moving: state.moving }
      )}
      style={{
        ...style,
        ...strategy === 'position' ? {
          position: style?.position || 'relative',
          left: `${state.deltaX}px`,
          top: `${state.deltaY}px`,
        } : {
          transform: (style?.transform || '') +
            ` translate3d(${state.deltaX}px, ${state.deltaY}px, 0)`,
        },
      }}
      onMouseDown={onMouseDown_}
    />
  );
};

Moveable.displayName = 'Moveable';

export default Moveable;
