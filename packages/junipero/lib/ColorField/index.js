import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  classNames,
  mockState,
  parseColor,
  stringifyColor,
} from '@poool/junipero-utils';
import { useEventListener } from '@poool/junipero-hooks';

import Dropdown from '../Dropdown';
import DropdownToggle from '../DropdownToggle';
import DropdownMenu from '../DropdownMenu';
import TextField from '../TextField';

const ColorField = forwardRef(({
  animateMenu,
  value,
  valid,
  className,
  autoFocus = false,
  disabled = false,
  format = 'auto',
  globalEventsTarget = global,
  opened = false,
  readOnly = false,
  onChange = () => {},
  onFocus = () => {},
  onToggle = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const dropdownRef = useRef();
  const inputRef = useRef();
  const colorWheelRef = useRef();
  const colorHueRef = useRef();
  const colorLightnessRef = useRef();
  const colorAlphaRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    opened: opened || autoFocus,
    dirty: false,
    a: 100,
    h: 0,
    s: 0,
    v: 0,
    value: null,
    valid: valid ?? false,
    handleMoving: false,
    handleType: null,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    dropdownRef,
    inputRef,
    colorWheelRef,
    colorHueRef,
    colorLightnessRef,
    colorAlphaRef,
    opened: state.opened,
    internalValue: state.value,
    valid: state.valid,
    dirty: state.dirty,
    h: state.h,
    s: state.s,
    v: state.v,
    a: state.a,
    focus,
    blur,
    reset,
    handleMoving: state.handleMoving,
    handleType: state.handleType,
  }));

  useEffect(() => {
    onColorChange_({ value });
  }, [value]);

  useEffect(() => {
    if (state.opened) {
      // Force a re-render when opening dropdown to ensure color handles are
      // at their right place
      dispatch({ handleMoving: state.handleMoving });
    }
  }, [state.opened]);

  useEventListener('mousemove', e => {
    onMouseMove_(e);
  }, globalEventsTarget);

  useEventListener('mouseup', e => {
    onMouseUp_(e);
  }, globalEventsTarget);

  const focus = () => {
    inputRef.current?.focus();
    dropdownRef.current?.open();
  };

  const blur = () =>
    inputRef.current?.blur();

  const reset = () => {
    state.dirty = false;
    onColorChange_({ value });
  };

  const onFocus_ = e => {
    dropdownRef.current?.open();
    onFocus(e);
  };

  const onChange_ = e => {
    state.dirty = true;
    const parsed = onColorChange_(e);
    onChange({ value: e?.value, valid: !!parsed });
  };

  const onColorChange_ = e => {
    const parsed = parseColor(e?.value);
    const { h = 0, s = 0, v = 1, a = 1 } = parsed || {};

    dispatch({
      h: h * 360,
      s: s * 100,
      v: 100 - (v * 100),
      a: a * 100,
      value: e?.value,
      valid: !!parsed,
      dirty: state.dirty,
    });

    return parsed;
  };

  const onMouseDown_ = (type, e) => {
    if (e.button !== 0) {
      return;
    }

    dispatch({ handleMoving: true, handleType: type });
    onMouseMove_(e);
  };

  const onMouseMove_ = e => {
    if (
      typeof window === 'undefined' || !state.handleMoving ||
      !state.handleType || disabled || readOnly
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

    dispatch({
      h: state.h,
      s: state.s,
      v: state.v,
      a: state.a,
      value: state.value,
      valid: true,
    });

    onChange({ value: state.value, valid: true });
  };

  const onMouseUp_ = () => {
    /* istanbul ignore if: just in case */
    if (!state.handleMoving || !state.handleType || disabled || readOnly) {
      return;
    }

    dispatch({ handleMoving: false, handleType: null });
  };

  const onDropdownToggle_ = ({ opened }) => {
    dispatch({ opened });
    onToggle({ opened });
  };

  const getCursorPosition = type => {
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

  return (
    <div
      className={classNames(
        'junipero',
        'field',
        'color-input',
        {
          empty: !state.value,
          dirty: state.dirty,
          invalid: !state.valid && state.dirty,
          moving: state.handleMoving,
          opened: state.opened,
        },
        className,
      )}
      ref={innerRef}
    >
      <Dropdown
        opened={state.opened}
        globalEventsTarget={globalEventsTarget}
        onToggle={onDropdownToggle_}
        ref={dropdownRef}
      >
        <DropdownToggle trigger="manual" href={null} tag="div">
          <TextField
            { ...rest }
            ref={inputRef}
            disabled={disabled}
            value={state.value}
            validate={() => state.valid}
            readOnly={readOnly}
            onFocus={onFocus_}
            onChange={onChange_}
            autoFocus={autoFocus}
          />
        </DropdownToggle>
        <DropdownMenu animate={animateMenu}>
          <div className="color-wheel" ref={colorWheelRef}>
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
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
});

ColorField.propTypes = {
  animateMenu: PropTypes.func,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  format: PropTypes.oneOf(['auto', 'hex', 'rgb', 'rgba', 'hsla']),
  globalEventsTarget: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
  opened: PropTypes.bool,
  readOnly: PropTypes.bool,
  valid: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onToggle: PropTypes.func,
};

export default ColorField;
