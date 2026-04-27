import {
  type RefObject,
  useImperativeHandle,
  useRef,
  useMemo,
  useId,
} from 'react';
import { Slot } from '@radix-ui/react-slot';
import { classNames } from '@junipero/core';

import type {
  JuniperoInnerRef,
  JuniperoRef,
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
  className,
  a11yEnabled = true,
  ...rest
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

  return (
    <Slot
      { ...rest }
      className={classNames(
        'dropdown-toggle',
        className,
        { opened }
      )}
      ref={r => {
        const jref = r as unknown as JuniperoRef | JuniperoInnerRef;

        innerRef.current = (jref as JuniperoRef)?.isJunipero
          ? (jref as JuniperoRef).innerRef?.current : r;
        refs?.setReference(
          (jref as JuniperoRef)?.isJunipero
            ? (jref as JuniperoRef).innerRef?.current : r
        );
      }}
      { ...getReferenceProps?.() }
      id={id}
      {...a11yEnabled && {
        dir: 'ltr',
        role: 'combobox',
        'aria-controls': menuId ?? fallbackMenuId,
        'aria-expanded': opened,
        'aria-activedescendant': activeItem,
        'aria-haspopup': 'listbox',
        'aria-autocomplete': 'none',
      }}
    />
  );
};

DropdownToggle.displayName = 'DropdownToggle';

export default DropdownToggle;
