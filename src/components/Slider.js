import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { injectStyles, omit } from '../utils';
import styles from '../theme/components/Slider.styl';

class Slider extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.number,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    min: PropTypes.number,
    max: PropTypes.number,
    renderValue: PropTypes.func,
    disabled: PropTypes.bool,
    step: PropTypes.number,
    onChange: PropTypes.func,
    theme: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    label: '',
    value: 0,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    renderValue: value => value,
    onChange: () => {},
    theme: 'default',
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-slider-styles', after: '#junipero-main-styles' });

    this.state = {
      value: this.props.value,
      precision: this.getPrecision(),
      moving: false,
    };
  }

  componentDidMount() {
    const doc = document;
    doc.addEventListener('mousemove', this.onMouseMove.bind(this), true);
    doc.addEventListener('mouseup', this.onMouseUp.bind(this), true);
  }

  componentDidUpdate(prevProps) {
    if (this.props.step !== prevProps.step) {
      this.setState({ precision: this.getPrecision() });
    }
  }

  getPrecision() {
    const decimals = `${this.props.step}`.split('.')[1];
    return decimals?.length || 0;
  }

  getValue(value) {
    const { min, max, step } = this.props;

    return parseFloat((
      Math.max(min, Math.min(max, Math.round(value / step) * step))
    ).toFixed(this.state.precision));
  }

  getElementOffset(el) {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
  }

  getPosition() {
    return this.slide?.offsetWidth * (this.state.value / this.props.max);
  }

  onMouseDown(e) {
    if (e.button !== 0) {
      return;
    }

    e.persist();

    this.setState({
      moving: true,
    }, () => {
      this.onMouseMove(e);
    });

    e.preventDefault();
  }

  onMouseMove(e) {
    if (!this.state.moving || !this.slide || this.props.disabled) {
      return;
    }

    const slideOffset = this.getElementOffset(this.slide);
    const slideWidth = this.slide?.offsetWidth;
    const value = this.getValue(this.props.max * (
      (e.pageX - slideOffset.left) / slideWidth
    ));

    this.onChange(value);
  }

  onMouseUp(e) {
    if (!this.state.moving || !this.slide || this.props.disabled) {
      return;
    }

    this.setState({
      moving: false,
    });
  }

  onChange(value) {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      value,
    }, () => {
      this.props.onChange({
        value,
      });
    });
  }

  render() {
    const {
      theme,
      disabled,
      className,
      label,
      renderValue,
      ...rest
    } = this.props;
    const { value } = this.state;

    return (
      <div
        { ...omit(rest, [
          'onChange', 'step', 'min', 'max', 'value',
        ]) }
        className={classNames(
          'junipero',
          'junipero-slider',
          'theme-' + theme,
          {
            disabled,
          },
          className,
        )}
        onMouseDown={this.onMouseDown.bind(this)}
      >
        <div className="slider-wrapper">
          { label && (
            <span className="label">{ label }</span>
          ) }

          <div className="slide" ref={(ref) => this.slide = ref}>
            <div
              className="fill"
              style={{ width: `${this.getPosition()}px` }}
            />
            <div
              className="handle"
              style={{
                transform: `translate3d(${this.getPosition()}px, 0, 0)`,
              }}
            />
          </div>

          <div className="value">
            { renderValue(value) }
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    const doc = document;
    doc.removeEventListener('mousemove', this.onMouseMove.bind(this), true);
    doc.removeEventListener('mouseup', this.onMouseUp.bind(this), true);
  }

}

export default Slider;
