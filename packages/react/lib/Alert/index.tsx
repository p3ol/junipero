import {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  MutableRefObject,
  ReactNode,
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
} from 'react';
import { classNames } from '@junipero/core';
import { useTimeout } from '@junipero/hooks';
import PropTypes from 'prop-types';

import { Remove } from '../icons';
import Card from '../Card';
import { ForwardedProps } from '../utils';

declare type AlertRef = {
  isJunipero: boolean;
  innerRef: MutableRefObject<any>;
};

declare interface AlertProps extends ComponentPropsWithRef<any> {
  animationTimeout?: number;
  children?: ReactNode | JSX.Element;
  className?: string;
  icon?: ReactNode | JSX.Element;
  index?: string | number;
  lifespan?: number;
  tag?: string | ElementType;
  animate?(
    alert: ReactNode | JSX.Element,
    opts: { opened: boolean; index: string | number }
  ): ReactNode | JSX.Element;
  onDismiss?(index?: string | number): void;
  ref?: MutableRefObject<AlertRef | undefined>;
}

export declare interface AlertObject{
  id?: number | string,
  animationTimeout?: number;
  content?: ReactNode | JSX.Element;
  icon?: ReactNode | JSX.Element;
  index?: string | number;
  title?: ReactNode | JSX.Element;
  duration?: number;
  type?: string;
  lifespan?: number;
  animate?(
    alert: ReactNode | JSX.Element,
    opts: { opened: boolean; index: string | number }
  ): ReactNode | JSX.Element;
  onDismiss?(index?: string | number): void;
}

const Alert = forwardRef(({
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
  sss,
  ...rest
}: AlertProps, ref) => {
  const innerRef = useRef();
  const [enabled, setEnabled] = useState(true);
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

  const onClick_ = e => {
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
}) as ForwardedProps<AlertProps, AlertRef>;

Alert.displayName = 'Alert';
Alert.propTypes = {
  animate: PropTypes.func,
  animationTimeout: PropTypes.number,
  index: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  icon: PropTypes.oneOfType([
    PropTypes.node,
  ]),
  lifespan: PropTypes.number,
  tag: PropTypes.any, //TODO fixme
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.func,
    PropTypes.object,
  ]),
  onDismiss: PropTypes.func,
  onClick: PropTypes.func,
};
export default Alert;
