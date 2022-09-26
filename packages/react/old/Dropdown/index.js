import {
  Children,
  cloneElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { usePopper } from 'react-popper';
import { classNames, mockState } from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

import { DropdownContext } from '../contexts';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';

const Dropdown = forwardRef(({
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
  ...rest
}, ref) => {
  const innerRef = useRef();
  const toggleRef = useRef();
  const menuRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    opened,
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
    dispatch({ opened: disabled ? false : opened });
  }, [opened, disabled]);

  useEventListener('click', e => {
    onClickOutside_(e);
  }, globalEventsTarget);

  useImperativeHandle(ref, () => ({
    opened: state.opened,
    innerRef,
    toggleRef,
    menuRef,
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
    onToggle_();
  };

  const toggle = () => {
    state.opened = !state.opened;
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

  const onToggle_ = () => {
    update?.();
    dispatch({ opened: state.opened });
    onToggle({ opened: state.opened });
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
    toggle,
    update: update_,
    forceUpdate: forceUpdate_,
  }), [
    state.opened,
    disabled,
    styles,
    attributes,
  ]);

  return (
    <div
      { ...rest }
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
  onToggle: PropTypes.func,
  opened: PropTypes.bool,
  placement: PropTypes.string,
  popperOptions: PropTypes.object,
  trigger: PropTypes.string,
  filterMenu: PropTypes.func,
  filterToggle: PropTypes.func,
};

export default Dropdown;