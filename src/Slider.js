import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/Slider.styl';

export default class Slider extends React.Component {

  static propTypes = {
    autoResize: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number,
    theme: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func,
    renderValue: PropTypes.func,
  }

  static defaultProps = {
    autoResize: false,
    disabled: false,
    label: '',
    max: 100,
    min: 0,
    step: 1,
    theme: 'default',
    value: 0,
    onChange: () => {},
    renderValue: value => value,
  }

  state = {
    parentWidth: 0,
    value: this.props.value,
    precision: this.getPrecision(),
    moving: false,
  }

  innerRef = null

  slideRef = null

  constructor (props) {
    super(props);
    inject(styles, 'junipero-slider-styles');
  }

  componentDidMount () {
    document.addEventListener('mousemove', this.onMouseMove, true);
    document.addEventListener('mouseup', this.onMouseUp, true);

    if (this.props.autoResize) {
      document.addEventListener('resize', this.onResize, true);
    }

    this.setState({
      parentWidth: this.slideRef?.offsetWidth,
    });
  }

  componentDidUpdate (prevProps) {
    if (this.props.step !== prevProps.step) {
      this.setState({ precision: this.getPrecision() });
    }

    if (this.props.value !== prevProps.value) {
      this.setState({ value: this.props.value });
    }
  }

  getPrecision () {
    const decimals = `${this.props.step}`.split('.')[1];
    return decimals?.length || 0;
  }

  getValue (value) {
    const { min, max, step } = this.props;

    return parseFloat((
      Math.max(min, Math.min(max, Math.round(value / step) * step))
    ).toFixed(this.state.precision));
  }

  getElementOffset (el) {
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft,
    };
  }

  getPosition () {
    return this.state.parentWidth * (this.state.value / this.props.max);
  }

  onMouseDown (e) {
    if (e.button !== 0) {
      return;
    }

    e.persist?.();

    this.setState({
      moving: true,
    }, () => {
      this.onMouseMove(e);
    });

    e.preventDefault?.();
  }

  onMouseMove = (e) => {
    if (!this.state.moving || !this.slideRef || this.props.disabled) {
      return;
    }

    const slideOffset = this.getElementOffset(this.slideRef);
    const slideWidth = this.slideRef?.offsetWidth;
    const value = this.getValue(this.props.max * (
      (e.pageX - slideOffset.left) / slideWidth
    ));

    this.onChange(value || 0);
  }

  onMouseUp = (e) => {
    this.setState({
      moving: false,
    });
  }

  onResize = /* istanbul ignore next */ () => {
    this.setState({
      parentWidth: this.slideRef?.offsetWidth,
    });
  }

  onChange (value) {
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

  render () {
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
          'onChange', 'step', 'min', 'max', 'value', 'autoResize',
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
        ref={ref => { this.innerRef = ref; }}
        onMouseDown={this.onMouseDown.bind(this)}
      >
        <div className="slider-wrapper">
          { label && (
            <span className="label">{ label }</span>
          ) }

          <div className="slide" ref={ref => { this.slideRef = ref; }}>
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

  componentWillUnmount () {
    document.removeEventListener('mousemove', this.onMouseMove, true);
    document.removeEventListener('mouseup', this.onMouseUp, true);
    document.removeEventListener('resize', this.onResize, true);
  }

}
