import {
  type RefObject,
  cloneElement,
  useImperativeHandle,
  useRef,
  use,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoInnerRef,
  JuniperoRef,
  ReactElt,
  ReactLazy,
  SpecialComponentPropsWithRef,
} from '../types';
import { useDropdown } from '../hooks';

export declare interface DropdownToggleRef extends JuniperoRef {
  innerRef: RefObject<JuniperoRef | JuniperoInnerRef>;
}

export declare interface DropdownToggleProps
  extends SpecialComponentPropsWithRef<any, DropdownToggleRef> {}

const DropdownToggle = ({
  ref,
  children,
}: DropdownToggleProps) => {
  const innerRef = useRef<JuniperoRef | JuniperoInnerRef>(null);
  const { opened, refs, getReferenceProps } = useDropdown();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const child: ReactElt | ReactLazy =
    typeof children !== 'string' && Array.isArray(children)
      ? children[0] : children;

  return cloneElement(
    (child as ReactLazy).$$typeof === Symbol.for('react.lazy')
      ? use<ReactElt>((child as ReactLazy)._payload) : child as ReactElt,
    {
      className: classNames(
        (child as ReactElt).props?.className, 'dropdown-toggle', { opened }
      ),
      ref: (r: JuniperoRef | JuniperoInnerRef) => {
        innerRef.current = (r as JuniperoRef)?.isJunipero
          ? (r as JuniperoRef).innerRef.current : r;
        refs.setReference(
          (r as JuniperoRef)?.isJunipero
            ? (r as JuniperoRef).innerRef.current : r
        );
      },
      ...getReferenceProps({ onClick: (child as ReactElt).props?.onClick }),
    });
};

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
