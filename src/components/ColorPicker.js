import React from 'react';
import PropTypes from 'prop-types';

import TextField from './TextField';
import { injectStyles, omit, parseColor, stringifyColor } from '../utils';
import styles from '../theme/components/ColorPicker.styl';

class ColorPicker extends React.Component {

  static propTypes = {
    theme: PropTypes.string,
    format: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  }

  static defaultProps = {
    theme: 'default',
    format: 'auto',
    disabled: false,
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
  }

  state = {
    opened: false,
    handleMoving: false,
    handleType: null,
    value: null,
    h: 0,
    s: 0,
    v: 0,
    a: 100,
  }

  input = null

  colorWheel = null

  colorHue = null

  colorAlpha = null

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-color-picker-styles', after: '#junipero-main-styles' });
  }

  componentDidMount() {
    const doc = document;
    doc.addEventListener('mousedown', this.onClickOutside.bind(this), true);
    doc.addEventListener('mousemove', this.onMouseMove.bind(this), true);
    doc.addEventListener('mouseup', this.onMouseUp.bind(this), true);
  }

  onChange(e) {

  }

  onFocus(e) {
    this.setState({ opened: true });
    this.props.onFocus(e);
  }

  onClickOutside(e) {
    if (this.input && this.input === e.target) {
      return;
    }

    if (this.colorWheel && !this.colorWheel.contains(e.target)) {
      this.setState({ opened: false });
    }
  }

  getCursorPosition(type) {
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

  onMouseDown(type, e) {
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

  onMouseMove(e) {
    const { disabled, format } = this.props;
    const { handleMoving, handleType } = this.state;

    if (!handleMoving || !handleType || disabled) {
      return;
    }

    let offsetX, offsetY, offsetWidth, offsetHeight;

    switch (handleType) {
      case 'hue':
        offsetX = this.getElementOffset(this.colorHue).left;
        offsetWidth = this.colorHue?.offsetWidth;
        this.state.h = Math.max(0,
          Math.min(360,
            360 * (e.pageX - offsetX) / offsetWidth)
        );
        break;
      case 'alpha':
        offsetX = this.getElementOffset(this.colorAlpha).left;
        offsetWidth = this.colorAlpha?.offsetWidth;
        this.state.a = Math.max(0,
          Math.min(100,
            100 * (e.pageX - offsetX) / offsetWidth)
        );
        break;
      default:
        offsetWidth = this.colorLightness?.offsetWidth;
        offsetX = this.getElementOffset(this.colorLightness).left;
        this.state.s = Math.max(0,
          Math.min(100,
            100 * (e.pageX - offsetX) / offsetWidth)
        );

        offsetHeight = this.colorLightness?.offsetHeight;
        offsetY = this.getElementOffset(this.colorLightness).top;
        this.state.v = Math.max(0,
          Math.min(100,
            100 * (e.pageY - offsetY) / offsetHeight)
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
    });
  }

  onMouseUp(e) {
    const { disabled } = this.props;
    const { handleMoving, handleType } = this.state;

    if (!handleMoving || !handleType || disabled) {
      return;
    }

    this.setState({
      handleMoving: false,
      handleType: null,
    });
  }

  getElementOffset(el) {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
  }

  render() {
    const { theme, ...rest } = this.props;
    const { opened, value, h, s, v, a } = this.state;

    return (
      <div
        className={[
          'junipero',
          'color-picker',
          'theme-' + theme,
          opened ? 'opened' : null,
        ].join(' ')}
      >
        <TextField
          ref={(ref) => this.input = ref?.input}
          { ...omit(rest, [
            'onChange',
          ])}
          type="text"
          value={value}
          onChange={this.onChange.bind(this)}
          onFocus={this.onFocus.bind(this)}
        />

        <div className="color-wheel" ref={(ref) => this.colorWheel = ref}>
          <div
            className="lightness"
            ref={(ref) => this.colorLightness = ref}
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
                ref={(ref) => this.colorHue = ref}
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
                ref={(ref) => this.colorAlpha = ref}
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
      </div>
    );
  }

  componentWillUnmount() {
    const doc = document;
    doc.removeEventListener('mousedown', this.onClickOutside.bind(this));
    doc.removeEventListener('mousemove', this.onMouseMove.bind(this), true);
    doc.removeEventListener('mouseup', this.onMouseUp.bind(this), true);
  }

}

export default ColorPicker;
