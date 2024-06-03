import {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
  useLayoutEffect,
  ReactNode,
  ComponentPropsWithRef,
  MutableRefObject,
  ChangeEvent,
  MouseEvent,
} from 'react';
import {
  classNames,
  mockState,
  exists,
  stringifyColor,
  parseColor,
} from '@junipero/core';
import { useEventListener } from '@junipero/hooks';
import PropTypes from 'prop-types';
import { UseDismissProps } from '@floating-ui/react';

import { useFieldControl } from '../hooks';
import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import TextField, { TextFieldChangeEvent } from '../TextField';
import FieldControl from '../FieldControl';
import { ForwardedProps, MockState } from '../utils';

export declare type ColorFieldRef = {
  dirty: boolean;
  isJunipero: boolean;
  valid: boolean;
  value: string;
  blur(): void;
  close(): void;
  focus(): void;
  open(): void;
  reset(): void;
  toggle(): void;
  colorAlphaRef: MutableRefObject<any>;
  colorHueRef: MutableRefObject<any>;
  colorLightnessRef: MutableRefObject<any>;
  innerRef: MutableRefObject<any>;
  textFieldRef: MutableRefObject<any>;
};

export declare interface ColorFieldProps extends ComponentPropsWithRef<any> {
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  format?: 'auto' | 'hex' | 'rgb' | 'rgba' | 'hsla';
  globalEventsTarget?: EventTarget;
  id?: string;
  name?: string;
  opened?: boolean;
  placeholder?: string;
  required?: boolean;
  tabIndex?: number;
  trigger?: 'click' | 'hover' | 'manual' | 'focus';
  valid?: boolean;
  value?: string;
  animateMenu?(
    menu: ReactNode | JSX.Element,
    opts: { opened: boolean }
  ): ReactNode | JSX.Element;
  onBlur?(e: Event): void;
  onChange?(props: { value: string; valid: boolean }): void;
  onFocus?(e: Event): void;
  onToggle?({ opened }: { opened: boolean }): void;
  onValidate?(
    value: string,
    { dirty, required }: { dirty?: boolean; required?: boolean }
  ): boolean;
  ref?: MutableRefObject<ColorFieldRef | undefined>;
}

const ColorField = forwardRef(({
  animateMenu,
  className,
  dismissOptions,
  globalEventsTarget,
  id,
  name,
  placeholder,
  tabIndex,
  trigger,
  valid,
  value,
  opened,
  children,
  autoFocus = false,
  disabled = false,
  format = 'auto',
  required = false,
  onBlur,
  onChange,
  onFocus,
  onToggle,
  onValidate = (val, { required }) => !!val || !required,
  ...rest
}: ColorFieldProps, ref) => {
  type ColorFieldState = {
    value: string,
    a: number,
    h: number,
    s: number,
    v: number,
    valid: boolean,
    dirty: boolean,
    opened: boolean,
    handleMoving: boolean,
    handleType: string | null,
    focused: boolean
  }

  const innerRef = useRef<any>();
  const textFieldRef = useRef<any>();
  const colorLightnessRef = useRef<any>();
  const colorHueRef = useRef<any>();
  const colorAlphaRef = useRef<any>();
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer<MockState<ColorFieldState>>(mockState, {
    value: value ?? '',
    a: 100,
    h: 0,
    s: 0,
    v: 0,
    valid: valid ?? false,
    dirty: false,
    opened: (autoFocus || opened) ?? false,
    handleMoving: false,
    handleType: null,
    focused: false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    textFieldRef,
    colorLightnessRef,
    colorHueRef,
    colorAlphaRef,
    value: state.value,
    valid: state.valid,
    dirty: state.dirty,
    open,
    close,
    toggle,
    focus,
    blur,
    reset,
    isJunipero: true,
  }));

  useEffect(() => {
    if (exists(value)) {
      onColorChange_(value, { valuePropChange: true });
    }
  }, [value]);

  useLayoutEffect(() => {
    dispatch({ h: state.h, s: state.s, v: state.v, a: state.a });
  }, [autoFocus, state.opened]);

  useEventListener('mousemove', e => {
    onMouseMove_(e);
  }, {
    target: globalEventsTarget,
    enabled: state.handleMoving && state.handleType && !disabled,
  });

  useEventListener('mouseup', () => {
    onMouseUp_();
  }, {
    target: globalEventsTarget,
    enabled: state.handleMoving && state.handleType && !disabled,
  });

  const onColorChange_ = (
    val: string,
    { valuePropChange }: { valuePropChange?: boolean} = {}
  ) => {
    const parsed = parseColor(val);
    const { h = 0, s = 0, v = 1, a = 1 } = parsed || {};

    state.value = val;
    state.valid = onValidate?.(state.value, { required });

    if (!valuePropChange) {
      state.dirty = true;
      textFieldRef?.current?.setDirty(true);
    }

    dispatch({
      h: h * 360,
      s: s * 100,
      v: 100 - (v * 100),
      a: a * 100,
      value: state.value,
      valid: state.valid,
      dirty: state.dirty,
    });

    updateControl?.({ valid: state.valid, dirty: state.dirty });

    if (!valuePropChange) {
      onChange?.({ value: state.value, valid: state.valid });
    }
  };

  const onChange_ = (e: TextFieldChangeEvent) => {
    onColorChange_(e.value as string, { valuePropChange: false });
  };

  const onFocus_ = (e: FocusEvent) => {
    if (trigger === 'focus') {
      innerRef.current?.open();
    }

    !state.opened && updateControl?.({ focused: true });
    onFocus?.(e);
  };

  const onBlur_ = (e: FocusEvent) => {
    if (trigger === 'focus') {
      innerRef.current?.close();
    }

    !state.opened && updateControl?.({ focused: false });
    onBlur?.(e);
  };

  const onToggle_ = ({ opened }: { opened: boolean }) => {
    dispatch({ opened });
    updateControl?.({ focused: opened });
    onToggle?.({ opened });
  };

  const onTogglePreview = (e: MouseEvent) => {
    e.preventDefault();

    if (!state.opened) {
      textFieldRef.current?.focus();
    }

    innerRef.current?.toggle();
  };

  const getCursorPosition = (type: string) => {
    switch (type) {
      case 'hue':
        return {
          x: colorHueRef.current?.offsetWidth * (state.h / 360),
          y: 0,
        };
      case 'alpha':
        return {
          x: colorAlphaRef.current?.offsetWidth * (state.a / 100),
          y: 0,
        };
      default:
        return {
          x: colorLightnessRef.current?.offsetWidth * (state.s / 100),
          y: colorLightnessRef.current?.offsetHeight * (state.v / 100),
        };
    }
  };

  const onMouseDown_ = (type: string, e: MouseEvent) => {
    if (e.button !== 0) {
      return;
    }

    state.handleMoving = true;
    state.handleType = type;
    dispatch({ handleMoving: true, handleType: type });
    onMouseMove_(e);
  };

  const onMouseMove_ = (e: MouseEvent) => {
    if (
      typeof window === 'undefined' || !state.handleMoving ||
      !state.handleType || disabled
    ) {
      return;
    }

    let offsetX, offsetY, offsetWidth, offsetHeight;

    switch (state.handleType) {
      case 'hue':
        offsetX = colorHueRef.current?.getBoundingClientRect().left;
        offsetWidth = colorHueRef.current?.offsetWidth;
        state.h = Math.max(0,
          Math.min(360,
            360 * (e.pageX - offsetX - window.pageXOffset) / offsetWidth)
        );
        break;
      case 'alpha':
        offsetX = colorAlphaRef.current?.getBoundingClientRect().left;
        offsetWidth = colorAlphaRef.current?.offsetWidth;
        state.a = Math.max(0,
          Math.min(100,
            100 * (e.pageX - offsetX - window.pageXOffset) / offsetWidth)
        );
        break;
      default:
        offsetWidth = colorLightnessRef.current?.offsetWidth;
        offsetX = colorLightnessRef.current?.getBoundingClientRect().left;
        state.s = Math.max(0,
          Math.min(100,
            100 * (e.pageX - offsetX - window.pageXOffset) / offsetWidth)
        );

        offsetHeight = colorLightnessRef.current?.offsetHeight;
        offsetY = colorLightnessRef.current?.getBoundingClientRect().top;
        state.v = Math.max(0,
          Math.min(100,
            100 * (e.pageY - offsetY - window.pageYOffset) / offsetHeight)
        );
    }

    state.value = stringifyColor({
      h: state.h / 360,
      s: state.s / 100,
      v: (100 - state.v) / 100,
      a: state.a / 100,
    }, format);
    state.valid = onValidate?.(state.value, { required, dirty: true });
    textFieldRef.current?.setDirty(true);

    dispatch({
      h: state.h,
      s: state.s,
      v: state.v,
      a: state.a,
      dirty: true,
      value: state.value,
      valid: state.valid,
    });

    updateControl?.({ valid: state.valid, dirty: true });
    onChange?.({ value: state.value, valid: state.valid });
  };

  const onMouseUp_ = () => {
    if (!state.handleMoving || !state.handleType || disabled) {
      return;
    }

    dispatch({ handleMoving: false, handleType: null });
  };

  const open = () => {
    innerRef.current?.open();
  };

  const close = () => {
    innerRef.current?.close();
  };

  const toggle = () => {
    innerRef.current?.toggle();
  };

  const focus = () => {
    textFieldRef.current?.focus();
  };

  const blur = () => {
    textFieldRef.current?.blur();
  };

  const reset = () => {
    state.dirty = false;
    onColorChange_(value, { valuePropChange: true });
    textFieldRef.current?.reset();
  };

  const isEmpty = () =>
    !!state.value;

  return (
    <Dropdown
      { ...rest }
      opened={state.opened}
      ref={innerRef}
      disabled={disabled}
      clickOptions={{ toggle: false, keyboardHandlers: false }}
      className={classNames(
        'color-field',
        state.dirty ? 'dirty' : 'pristine',
        !state.valid && state.dirty ? 'invalid' : 'valid',
        {
          empty: isEmpty(),
          moving: state.handleMoving,
          focused: state.focused,
        },
        className
      )}
      dismissOptions={{
        ...!trigger && { enabled: true },
        ...dismissOptions,
      }}
      trigger={trigger === 'focus' ? 'manual' : trigger ?? 'manual'}
      onToggle={onToggle_}
    >
      <DropdownToggle>
        <div className="inner">
          <FieldControl>
            <TextField
              id={id}
              name={name}
              autoFocus={autoFocus}
              ref={textFieldRef}
              value={state.value}
              placeholder={placeholder}
              onFocus={onFocus_}
              onBlur={onBlur_}
              onChange={onChange_}
              tabIndex={tabIndex}
              valid={state.valid || !state.dirty || state.opened}
            />
          </FieldControl>

          <a
            className="pigment"
            onClick={onTogglePreview}
            style={{ backgroundColor: state.value }}
          />
        </div>
      </DropdownToggle>
      <DropdownMenu animate={animateMenu} className="color-menu">
        <div className="color-wheel">
          <div
            className="lightness"
            ref={colorLightnessRef}
            onMouseDown={onMouseDown_.bind(null, 'lightness')}
            style={{
              backgroundColor: stringifyColor({
                h: state.h / 360,
                s: 1,
                v: 1,
                a: 1,
              }),
            }}
          >
            <a
              className="handle"
              style={{
                transform: 'translate3d(' +
                  `${getCursorPosition('lightness').x}px, ` +
                  `${getCursorPosition('lightness').y}px, ` +
                  '0)',
              }}
            />
          </div>
          <div className="controls">
            <div className="sliders">
              <div
                className="hue"
                ref={colorHueRef}
                onMouseDown={onMouseDown_.bind(null, 'hue')}
              >
                <a
                  className="handle"
                  style={{
                    transform: 'translate3d(' +
                      `${getCursorPosition('hue').x}px, ` +
                      '0, 0)',
                  }}
                />
              </div>
              <div
                className="alpha"
                ref={colorAlphaRef}
                onMouseDown={onMouseDown_.bind(null, 'alpha')}
                style={{
                  backgroundColor: stringifyColor({
                    h: state.h / 360,
                    s: 1,
                    v: 1,
                    a: 1,
                  }),
                }}
              >
                <a
                  className="handle"
                  style={{
                    transform: 'translate3d(' +
                      `${getCursorPosition('alpha').x}px, ` +
                      '0, 0)',
                  }}
                />
              </div>
            </div>
            <div className="color-preview">
              <div
                className="preview-inner"
                style={{
                  backgroundColor: stringifyColor({
                    h: state.h / 360,
                    s: state.s / 100,
                    v: (100 - state.v) / 100,
                    a: state.a / 100,
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </DropdownMenu>
      { children }
    </Dropdown>
  );
}) as ForwardedProps<ColorFieldProps, ColorFieldRef>;

ColorField.displayName = 'ColorField';
ColorField.propTypes = {
  animateMenu: PropTypes.func,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  dismissOptions: PropTypes.object,
  opened: PropTypes.bool,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  valid: PropTypes.bool,
  value: PropTypes.string,
  onValidate: PropTypes.func,
  trigger: PropTypes.oneOf(['click', 'hover', 'manual', 'focus']),
  tabIndex: PropTypes.number,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onToggle: PropTypes.func,
  globalEventsTarget: PropTypes.any, //TODO fixme
  format: PropTypes.oneOf(['auto', 'hex', 'rgb', 'rgba', 'hsla']),
  id: PropTypes.string,
  name: PropTypes.string,
};
export default ColorField;
