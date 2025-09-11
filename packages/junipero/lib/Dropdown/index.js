import {
  Children,
  cloneElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useCallback,
  useId,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { usePopper } from 'react-popper';
import { classNames, mockState } from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

import { DropdownContext } from '../contexts';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';

const Dropdown = forwardRef(({
  id: idProp,
  children,
  className,
  clickOutsideTarget,
  disabled = false,
  globalEventsTarget = global,
  opened = false,
  placement = 'bottom-start',
  popperOptions = {},
  trigger = 'click',
  filterToggle = child => child.type === DropdownToggle,
  filterMenu = child => child.type === DropdownMenu,
  onToggle = () => {},
  onActiveItemChange,
  ...rest
}, ref) => {
  const fallbackId = useId();
  const id = useMemo(() => (
    idProp ?? `junipero-dropdown-${fallbackId}`
  ), [idProp, fallbackId]);
  const fallbackMenuId = useMemo(() => (
    `${id}-menu`
  ), [id]);

  const innerRef = useRef();
  const toggleRef = useRef();
  const menuRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    opened,
    activeItem: null,
    menuId: fallbackMenuId,
  });

  const { styles, attributes, update, forceUpdate } = usePopper(
    toggleRef.current || innerRef.current,
    menuRef.current || innerRef.current,
    {
      ...popperOptions,
      placement,
      modifiers: [
        { name: 'offset', options: { offset: [0, 10] } },
        ...(popperOptions.modifiers || []),
      ],
    }
  );

  useEffect(() => {
    if (disabled && state.opened) {
      close();
    }
  }, [disabled]);

  useEffect(() => {
    dispatch({ opened: disabled ? false : opened });
  }, [opened, disabled]);

  useEventListener('click', e => {
    onClickOutside_(e);
  }, [], globalEventsTarget);

  useImperativeHandle(ref, () => ({
    opened: state.opened,
    innerRef,
    toggleRef,
    menuRef,
    activeItem: state.activeItem,
    setActiveItem,
    toggle,
    open,
    close,
    update: update_,
    forceUpdate: forceUpdate_,
    isJunipero: true,
  }));

  const open = () => {
    if (disabled) {
      return;
    }

    state.opened = true;
    onToggle_();
  };

  const close = () => {
    state.opened = false;
    dispatch({ activeItem: undefined });
    onToggle_();
  };

  const toggle = () => {
    if (disabled) {
      return;
    }

    if (state.opened) {
      close();
    } else {
      open();
    }

    onToggle_();
  };

  /* istanbul ignore next: cannot test popper inside jest */
  const update_ = () => {
    update?.();
  };

  /* istanbul ignore next: cannot test popper inside jest */
  const forceUpdate_ = () => {
    forceUpdate?.();
  };

  const setActiveItem = useCallback(id => {
    dispatch({ activeItem: id });
    onActiveItemChange?.(id);
  }, [onActiveItemChange, state.activeItem]);

  const registerMenu = useCallback(id => {
    dispatch({ menuId: id });
  }, []);

  const onToggle_ = () => {
    update?.();
    dispatch({ opened: state.opened });
    onToggle({ opened: state.opened });
    dispatch(s => ({
      ...s,
      opened: state.opened,
      activeItem: state.opened ? s.activeItem : undefined,
    }));

    if (!state.opened) {
      onActiveItemChange?.(undefined);
    }
  };

  const onClickOutside_ = e => {
    const container = innerRef.current;
    const menu = menuRef.current;

    if (!state.opened || !container || trigger === 'manual') {
      return;
    }

    if (
      !container.contains(e.target) &&
      container !== e.target &&
      (
        !menu ||
        (!menu.contains(e.target) &&
        menu !== e.target)
      ) &&
      (
        !clickOutsideTarget ||
        (
          !clickOutsideTarget.contains(e.target) &&
          clickOutsideTarget !== e.target
        )
      )
    ) {
      close();
    }
  };

  const getContext = useCallback(() => ({
    opened: state.opened,
    disabled,
    styles,
    attributes,
    activeItem: state.activeItem,
    menuId: state.menuId,
    fallbackMenuId,
    toggle,
    update: update_,
    setActiveItem,
    registerMenu,
    forceUpdate: forceUpdate_,
  }), [
    state.opened,
    state.activeItem,
    disabled,
    styles,
    attributes,
  ]);

  return (
    <div
      { ...rest }
      id={id}
      className={classNames(
        'junipero',
        'dropdown',
        {
          opened: state.opened,
        },
        className,
      )}
      ref={innerRef}
    >
      <DropdownContext.Provider value={getContext()}>
        { Children.map(children, child => filterToggle(child)
          ? cloneElement(child, {
            ref: ref_ => {
              toggleRef.current = ref_;

              if (typeof child?.ref === 'function') {
                child.ref(ref_);
              } else if (child.ref) {
                child.ref.current = ref_;
              }
            },
          })
          : filterMenu(child)
            ? cloneElement(child, {
              ref: ref_ => {
                menuRef.current = ref_;

                if (typeof child?.ref === 'function') {
                  child.ref(ref_);
                } else if (child.ref) {
                  child.ref.current = ref_;
                }
              },
            })
            : child
        ) }
      </DropdownContext.Provider>
    </div>
  );
});

Dropdown.propTypes = {
  clickOutsideTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  disabled: PropTypes.bool,
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  id: PropTypes.string,
  onToggle: PropTypes.func,
  opened: PropTypes.bool,
  placement: PropTypes.string,
  popperOptions: PropTypes.object,
  trigger: PropTypes.string,
  filterMenu: PropTypes.func,
  onActiveItemChange: PropTypes.func,
  filterToggle: PropTypes.func,
};

export default Dropdown;
