import {
  type RefObject,
  type ReactElement,
  type ComponentPropsWithoutRef,
  Children,
  cloneElement,
  useImperativeHandle,
  useRef,
} from 'react';
import { classNames } from '@junipero/core';

import type {
  JuniperoInnerRef,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import { useAccessibility, useDropdown } from '../hooks';

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
  const { onKeyDown, currentlyFocusedElement } = useAccessibility();

  useImperativeHandle(ref, () => ({
    innerRef,
    isJunipero: true,
  }));

  const injectAccessibilityProps = (
    child: ReactElement<ComponentPropsWithoutRef<any>>,
  ): ReactElement<ComponentPropsWithoutRef<any>> => {
    if (!child) return child;

    if (child.type === 'input') {
      return cloneElement(child, {
        onKeyDown,
        'aria-haspopup': 'listbox',
        'aria-expanded': opened,
        'aria-controls': refs.floating?.current?.id,
        'aria-activedescendant': currentlyFocusedElement,
        role: 'combobox',
      });
    }

    if (child?.props?.children) {
      return cloneElement(child, {
        children: Children.map(
          child.props.children, (c: ReactElement<ComponentPropsWithoutRef<any>>
          ) =>
            injectAccessibilityProps(c)
        ),
      });
    }

    return child;
  };

  const child: ReactElement<
    ComponentPropsWithoutRef<any>
  > = typeof children !== 'string' && Array.isArray(children)
    ? children[0] : children;

  return cloneElement(injectAccessibilityProps(child), {
    className: classNames(
      child.props?.className, 'dropdown-toggle', { opened }
    ),
    ref: (r: JuniperoRef | JuniperoInnerRef) => {
      innerRef.current = (r as JuniperoRef)?.isJunipero
        ? (r as JuniperoRef).innerRef.current : r;
      refs.setReference(
        (r as JuniperoRef)?.isJunipero
          ? (r as JuniperoRef).innerRef.current : r
      );
    },
    ...getReferenceProps({ onClick: child.props?.onClick }),
    id: 'dropdown-toggle',
  });
};

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
