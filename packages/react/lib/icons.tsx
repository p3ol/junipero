import { classNames } from '@junipero/core';
import { ComponentPropsWithRef, ComponentPropsWithoutRef } from 'react';

declare interface IconProps extends ComponentPropsWithoutRef<'svg'> {
  className?: string
}

export const Arrows = ({ className, ...rest }: IconProps) => (
  <svg
    { ...rest }
    className={classNames('junipero icon arrows', className)}
    width="8"
    height="13"
    viewBox="0 0 8 13"
  >
    <path d="M1 4.5L4 1.5L7 4.5" />
    <path d="M1 8.5L4 11.5L7 8.5" />
  </svg>
);

export const Remove = ({ className, ...rest }: IconProps) => (
  <svg
    { ...rest }
    className={classNames('junipero icon remove', className)}
    width="10"
    height="10"
    viewBox="0 0 9 10"
  >
    <path d="M8 1.5L1 8.5" />
    <path d="M1 1.5L8 8.5" />
  </svg>
);

export const ArrowLeft = ({ className, ...rest }: IconProps) => (
  <svg
    { ...rest }
    className={classNames('junipero icon arrow-left', className)}
    width="7"
    height="11"
    viewBox="0 0 7 11"
  >
    <path d="M5.59863 9.04065L1.66113 5.04065L5.59863 1.04065" />
  </svg>
);

export const ArrowRight = ({ className, ...rest }: IconProps) => (
  <svg
    { ...rest }
    className={classNames('junipero icon arrow-right', className)}
    width="7"
    height="11"
    viewBox="0 0 7 11"
  >
    <path d="M1.72388 9.04065L5.66138 5.04065L1.72388 1.04065" />
  </svg>
);

export const ArrowDown = ({ className, ...rest }: IconProps) => (
  <svg
    { ...rest }
    className={classNames('junipero icon arrow-bottom', className)}
    width="8"
    height="5"
    viewBox="0 0 8 5"
  >
    <path d="M1 1L4 4L7 1" />
  </svg>
);

export const ArrowUp = ({ className, ...rest }: IconProps) => (
  <svg
    { ...rest }
    className={classNames('junipero icon arrow-up', className)}
    width="8"
    height="5"
    viewBox="0 0 8 5"
  >
    <path d="M1 4L4 1L7 4" />
  </svg>
);

export const Time = ({ className, ...rest }: IconProps) => (
  <svg
    { ...rest }
    className={classNames('junipero icon time', className)}
    width="19"
    height="19"
    viewBox="0 0 19 19"
  >
    <circle cx="9.5" cy="9.5" r="8.5" strokeWidth={2} />
    <path d="M13.4558 13L9 9.61266L9 4" />
  </svg>
);

export const Check = ({ className, ...rest }: IconProps) => (
  <svg
    { ...rest }
    className={classNames('junipero icon check', className)}
    width="10"
    height="7"
    viewBox="0 0 10 7"
  >
    <path
      d="M1.75259 3.49582L4.25675 6L8.24741 1"
    />
  </svg>
);
