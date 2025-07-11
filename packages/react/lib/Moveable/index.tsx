import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
  type Ref,
  cloneElement,
  useCallback,
  useEffect,
  useReducer,
} from 'react';
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
  children,
  transformScale = 1,
  strategy = 'transform',
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
    deltaX: (x || 0),
    deltaY: (y || 0),
    startX: 0,
    startY: 0,
  });

  const onMouseDown_ = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    dispatch({
      moving: true,
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: state.deltaX,
      startY: state.deltaY,
    });

    onMoveStart?.(e);
    onMouseDown?.(e);
  }, [state.deltaX, state.deltaY, onMoveStart, onMouseDown]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!state.moving) return;

    state.deltaX = (e.clientX - state.mouseX +
      (state.startX * transformScale)) / transformScale;
    state.deltaY = (e.clientY - state.mouseY +
      (state.startY * transformScale)) / transformScale;

    dispatch({ deltaX: state.deltaX, deltaY: state.deltaY });
    onMove?.(state, e);
  }, [state, onMove, transformScale]);

  const onMouseUp = useCallback((e: MouseEvent) => {
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
  }, [state, onMoveEnd]);

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

  const child: ReactElement<
      ComponentPropsWithoutRef<any>
    > = typeof children !== 'string' && Array.isArray(children)
      ? children[0] : children;

  return cloneElement(child, {
    ...rest,
    ref,
    className: classNames(
      className,
      child.props?.className,
      'junipero moveable',
      {
        moving: state.moving,
      }
    ),
    style: {
      ...style,
      ...strategy === 'position' ? {
        position: 'relative',
        left: `${state.deltaX}px`,
        top: `${state.deltaY}px`,
      } : {
        transform: (style?.transform || '') +
          ` translate3d(${state.deltaX}px, ${state.deltaY}px, 0)`,
      },
    },
    onMouseDown: onMouseDown_,
  } as ComponentPropsWithoutRef<any>);
};

Moveable.displayName = 'Moveable';

export default Moveable;
