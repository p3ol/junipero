import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from './Dropdown';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import TextField from './TextField';
import { inject } from './style';
import {
  omit,
  parseColor,
  stringifyColor,
  classNames,
} from './utils';
import styles from './theme/components/ColorPicker.styl';

export default class ColorPicker extends React.Component {

  static propTypes = {
    disabled: PropTypes.bool,
    format: PropTypes.oneOf(['auto', 'hex', 'rgb', 'rgba', 'hsla']),
    native: PropTypes.bool,
    readOnly: PropTypes.bool,
    theme: PropTypes.string,
    value: PropTypes.string,
    animateMenu: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onToggle: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    format: 'auto',
    native: false,
    readOnly: false,
    theme: 'default',
    value: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    onToggle: () => {},
  }

  state = {
    a: 100,
    h: 0,
    handleMoving: false,
    handleType: null,
    opened: false,
    s: 0,
    valid: true,
    value: null,
    v: 0,
  }

  menuRef = null

  input = null

  colorWheel = null

  colorHue = null

  colorAlpha = null

  constructor (props) {
    super(props);
    inject(styles, 'junipero-color-picker-styles');
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.onClickOutside, true);
    document.addEventListener('mousemove', this.onMouseMove, true);
    document.addEventListener('mouseup', this.onMouseUp, true);

    this.onInputChange({ value: this.props.value }, false);
  }

  componentDidUpdate (prevProps) {
    if (this.props.value !== prevProps.value) {
      this.onInputChange({ value: this.props.value });
    }
  }

  onChange () {
    const { value, valid } = this.state;

    this.props.onChange({
      value,
      valid,
    });
  }

  onInputChange (e, propagateChange = true) {
    let newState = {
      value: e?.value,
      valid: false,
    };

    if (e?.value) {
      const parsed = parseColor(e.value);

      if (parsed) {
        newState = {
          h: parsed.h * 360,
          s: parsed.s * 100,
          v: 100 - (parsed.v * 100),
          a: parsed.a * 100,
          value: e.value,
          valid: true,
        };
      }
    }

    this.setState(newState, () => {
      if (propagateChange) {
        this.onChange();
      }
    });
  }

  onClickOutside = (e) => {
    if (this.input && this.input === e.target) {
      return;
    }

    if (this.colorWheel && !this.colorWheel.contains(e.target)) {
      this.setState({ opened: false }, () => {
        this.props.onBlur();
      });
    }
  }

  getCursorPosition (type) {
    switch (type) {
      case 'hue':
        return { x: this.colorHue?.offsetWidth * (this.state.h / 360), y: 0 };
      case 'alpha':
        return { x: this.colorAlpha?.offsetWidth * (this.state.a / 100), y: 0 };
      default:
        return {
          x: this.colorLightness?.offsetWidth * (this.state.s / 100),
          y: this.colorLightness?.offsetHeight * (this.state.v / 100),
        };
    }
  }

  onMouseDown (type, e) {
    if (e.button !== 0) {
      return;
    }

    e.persist();

    this.setState({
      handleMoving: true,
      handleType: type,
    }, () => {
      this.onMouseMove(e);
    });

    e.preventDefault();
  }

  onMouseMove = (e) => {
    const { disabled, format, readOnly } = this.props;
    const { handleMoving, handleType } = this.state;

    if (!handleMoving || !handleType || disabled || readOnly) {
      return;
    }

    let offsetX, offsetY, offsetWidth, offsetHeight;

    switch (handleType) {
      case 'hue':
        offsetX = this.getElementOffset(this.colorHue).left;
        offsetWidth = this.colorHue?.offsetWidth;
        this.state.h = Math.max(0,
          Math.min(360,
            360 * (e.pageX - offsetX - window.pageXOffset) / offsetWidth)
        );
        break;
      case 'alpha':
        offsetX = this.getElementOffset(this.colorAlpha).left;
        offsetWidth = this.colorAlpha?.offsetWidth;
        this.state.a = Math.max(0,
          Math.min(100,
            100 * (e.pageX - offsetX - window.pageXOffset) / offsetWidth)
        );
        break;
      default:
        offsetWidth = this.colorLightness?.offsetWidth;
        offsetX = this.getElementOffset(this.colorLightness).left;
        this.state.s = Math.max(0,
          Math.min(100,
            100 * (e.pageX - offsetX - window.pageXOffset) / offsetWidth)
        );

        offsetHeight = this.colorLightness?.offsetHeight;
        offsetY = this.getElementOffset(this.colorLightness).top;
        this.state.v = Math.max(0,
          Math.min(100,
            100 * (e.pageY - offsetY - window.pageYOffset) / offsetHeight)
        );
    }

    this.setState({
      ...this.state,
      value: stringifyColor({
        h: this.state.h / 360,
        s: this.state.s / 100,
        v: (100 - this.state.v) / 100,
        a: this.state.a / 100,
      }, format),
      valid: true,
    }, () => {
      this.onChange();
    });
  }

  onMouseUp = (e) => {
    const { disabled, readOnly } = this.props;
    const { handleMoving, handleType } = this.state;

    if (!handleMoving || !handleType || disabled || readOnly) {
      return;
    }

    this.setState({
      handleMoving: false,
      handleType: null,
    });
  }

  onToggle (opened) {
    this.setState({ opened }, () => {
      this.props.onToggle(opened);
    });
  }

  getElementOffset (el) {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top,
      left: rect.left,
    };
  }

  open () {
    this.onToggle(true);
  }

  close () {
    this.onToggle(false);
  }

  render () {
    const {
      className,
      theme,
      native,
      disabled,
      readOnly,
      animateMenu,
      ...rest
    } = this.props;
    const { opened, value, h, s, v, a } = this.state;

    const field = (
      <TextField
        ref={ref => { this.input = ref?.input; }}
        { ...omit(rest, [
          'onChange', 'native',
        ])}
        type={ native ? 'color' : 'text' }
        value={value}
        theme={theme}
        readOnly={readOnly}
        disabled={disabled}
        onChange={this.onInputChange.bind(this)}
      />
    );

    return (
      <div
        className={classNames(
          'junipero',
          'junipero-color-picker',
          'theme-' + theme,
          { opened },
          className,
        )}
      >
        { native ? field : (
          <Dropdown
            ref={ref => { this.menuRef = ref; }}
            disabled={disabled}
            theme={theme}
            isOpen={opened}
            onToggle={this.onToggle.bind(this)}
          >
            <DropdownToggle tag="div">{ field }</DropdownToggle>
            <DropdownMenu
              apparition="css"
              animate={animateMenu}
            >
              <div
                className="color-wheel"
                ref={ref => { this.colorWheel = ref; }}
              >
                <div
                  className="lightness"
                  ref={ref => { this.colorLightness = ref; }}
                  onMouseDown={this.onMouseDown.bind(this, 'lightness')}
                  style={{
                    backgroundColor: stringifyColor({
                      h: h / 360,
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
                        `${this.getCursorPosition('lightness').x}px, ` +
                        `${this.getCursorPosition('lightness').y}px, ` +
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
                          h: h / 360,
                          s: s / 100,
                          v: (100 - v) / 100,
                          a: a / 100,
                        }),
                      }}
                    />
                  </div>
                  <div className="sliders">
                    <div
                      className="hue"
                      ref={ref => { this.colorHue = ref; }}
                      onMouseDown={this.onMouseDown.bind(this, 'hue')}
                    >
                      <a
                        className="handle"
                        style={{
                          transform: 'translate3d(' +
                            `${this.getCursorPosition('hue').x}px, ` +
                            '0, 0)',
                        }}
                      />
                    </div>
                    <div
                      className="alpha"
                      ref={ref => { this.colorAlpha = ref; }}
                      onMouseDown={this.onMouseDown.bind(this, 'alpha')}
                      style={{
                        backgroundColor: stringifyColor({
                          h: h / 360,
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
                            `${this.getCursorPosition('alpha').x}px, ` +
                            '0, 0)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    );
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.onClickOutside);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

}
