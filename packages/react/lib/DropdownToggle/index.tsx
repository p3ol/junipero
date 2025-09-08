import {
  type RefObject,
  cloneElement,
  useImperativeHandle,
  useRef,
  useMemo,
  useId,
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
  extends SpecialComponentPropsWithRef<any, DropdownToggleRef> {
  a11yEnabled?: boolean;
}

const DropdownToggle = ({
  ref,
  id: idProp,
  children,
  a11yEnabled = true,
}: DropdownToggleProps) => {
  const innerRef = useRef<JuniperoRef | JuniperoInnerRef>(null);
  const {
    opened,
    refs,
    menuId,
    fallbackMenuId,
    activeItem,
    getReferenceProps,
  } = useDropdown();
  const fallbackId = useId();
  const id = useMemo(() => (
    idProp ?? `junipero-dropdown-toggle-${fallbackId}`
  ), [idProp, fallbackId]);

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
      id: (child as ReactElt).props?.id ?? id,
      ...a11yEnabled && {
        dir: 'ltr',
        role: 'combobox',
        'aria-controls': menuId ?? fallbackMenuId,
        'aria-expanded': opened,
        'aria-activedescendant': activeItem,
        'aria-haspopup': 'listbox',
        'aria-autocomplete': 'none',
      },
    });
};

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
