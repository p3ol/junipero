import type { UseDismissProps } from '@floating-ui/react';
import {
  type ReactNode,
  type RefObject,
  type MouseEvent,
  type FocusEvent,
  useImperativeHandle,
  useReducer,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import {
  classNames,
  exists,
  stringifyColor,
  parseColor,
  mockState,
} from '@junipero/core';
import { useEventListener } from '@junipero/hooks';

import type {
  FieldContent,
  JuniperoRef,
  SpecialComponentPropsWithRef,
} from '../types';
import type { TransitionProps } from '../Transition';
import { useFieldControl } from '../hooks';
import Dropdown, { type DropdownProps, type DropdownRef } from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import TextField, { type TextFieldRef } from '../TextField';
import FieldControl from '../FieldControl';

export declare interface ColorFieldRef extends JuniperoRef {
  dirty: boolean;
  valid: boolean;
  value: string;
  blur(): void;
  close(): void;
  focus(): void;
  open(): void;
  reset(): void;
  toggle(): void;
  colorAlphaRef: RefObject<HTMLDivElement>;
  colorHueRef: RefObject<HTMLDivElement>;
  colorLightnessRef: RefObject<HTMLDivElement>;
  innerRef: RefObject<DropdownRef>;
  textFieldRef: RefObject<TextFieldRef>;
}

export declare interface ColorFieldProps extends Omit<
  SpecialComponentPropsWithRef<typeof Dropdown, ColorFieldRef>,
  'trigger' | 'onChange'
> {
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  dismissOptions?: UseDismissProps;
  format?: 'auto' | 'hex' | 'rgb' | 'rgba' | 'hsla';
  globalEventsTarget?: EventTarget;
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  tabIndex?: number;
  valid?: boolean;
  value?: string;
  trigger?: DropdownProps['trigger'] | 'focus';
  animateMenu?(
    menu: ReactNode,
    opts: { opened: boolean } & Partial<TransitionProps>,
  ): ReactNode;
  onBlur?(e: FocusEvent<HTMLInputElement>): void;
  onChange?(field: FieldContent<string>): void;
  onFocus?(e: FocusEvent<HTMLInputElement>): void;
  onToggle?({ opened }: { opened: boolean }): void;
  onValidate?(
    value: string,
    { dirty, required }: { dirty?: boolean; required?: boolean }
  ): boolean;
}

export declare interface ColorFieldState {
  value: string;
  a: number;
  h: number;
  s: number;
  v: number;
  valid: boolean;
  dirty: boolean;
  opened: boolean;
  handleMoving: boolean;
  handleType: string | null;
  focused: boolean;
}

const ColorField = ({
  ref,
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
  animateMenu,
  onBlur,
  onChange,
  onFocus,
  onToggle,
  onValidate = (val, { required }) => !!val || !required,
  ...rest
}: ColorFieldProps) => {
  const innerRef = useRef<DropdownRef>(null);
  const textFieldRef = useRef<TextFieldRef>(null);
  const colorLightnessRef = useRef<HTMLDivElement>(null);
  const colorHueRef = useRef<HTMLDivElement>(null);
  const colorAlphaRef = useRef<HTMLDivElement>(null);
  const { update: updateControl } = useFieldControl();
  const [state, dispatch] = useReducer(mockState<ColorFieldState>, {
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

  const onChange_ = (field: FieldContent<string>) => {
    onColorChange_(field.value, { valuePropChange: false });
  };

  const onFocus_ = (e: FocusEvent<HTMLInputElement>) => {
    if (trigger === 'focus') {
      innerRef.current?.open();
    }

    if (!state.opened) {
      updateControl?.({ focused: true });
    }

    onFocus?.(e);
  };

  const onBlur_ = (e: FocusEvent<HTMLInputElement>) => {
    if (trigger === 'focus') {
      innerRef.current?.close();
    }

    if (!state.opened) {
      updateControl?.({ focused: false });
    }

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
};

ColorField.displayName = 'ColorField';

export default ColorField;
