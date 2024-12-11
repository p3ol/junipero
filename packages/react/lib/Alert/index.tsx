import {
  type ReactNode,
  type ElementType,
  type MouseEvent,
  useState,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';

import type {
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import type { TransitionProps } from '../Transition';
import { Remove } from '../icons';
import Card from '../Card';

export declare interface AlertRef extends JuniperoRef {}

export declare interface AlertProps
  extends SpecialComponentPropsWithRef<any, AlertRef> {
  animationTimeout?: number;
  icon?: ReactNode;
  index?: string | number;
  lifespan?: number;
  tag?: ElementType;
  title?: ReactNode;
  animate?(
    alert: ReactNode,
    opts: {
      opened: boolean;
      index: string | number;
    } & Partial<TransitionProps>
  ): ReactNode;
  onDismiss?(index?: string | number): void;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export declare interface AlertObject {
  id?: number | string,
  animationTimeout?: number;
  content?: ReactNode;
  icon?: ReactNode;
  index?: string | number;
  title?: ReactNode;
  duration?: number;
  type?: string;
  lifespan?: number;
  animate?(
    alert: ReactNode,
    opts: { opened: boolean; index: string | number }
  ): ReactNode;
  onDismiss?(index?: string | number): void;
}

const Alert = ({
  ref,
  animationTimeout = 100,
  tag: Tag = 'div',
  lifespan = 0,
  index,
  animate,
  className,
  icon,
  title,
  children,
  onClick,
  onDismiss,
  ...rest
}: AlertProps) => {
  const innerRef = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState<boolean>(true);
  const timeout = animate ? animationTimeout : 0;

  useTimeout(() => {
    setEnabled(false);
  }, lifespan + timeout, [lifespan], { enabled: lifespan > 0 });

  useTimeout(() => {
    onDismiss?.(index);
  }, timeout, [enabled], { enabled: !enabled });

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const onClick_ = (e : MouseEvent<HTMLElement>) => {
    onClick?.(e);
    setEnabled(false);
  };

  const content = (
    <Tag
      { ...rest }
      ref={ref}
      className={classNames('junipero', 'alert', className)}
      onClick={onClick_}
    >
      <Card>
        { icon && (
          <div className="type-icon">{ icon }</div>
        ) }
        <div className="content">
          <h6 className="junipero">{ title }</h6>
          <div className="junipero secondary">{ children }</div>
        </div>
        <Remove className="close" />
      </Card>
    </Tag>
  );

  return animate ? animate(content, { opened: enabled, index }) : content;
};

Alert.displayName = 'Alert';

export default Alert;
