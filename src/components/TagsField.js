import React from 'react';
import PropTypes from 'prop-types';

import { injectStyles, omit } from '../utils';
import styles from '../theme/components/TagsField.styl';

class TagsField extends React.Component {

  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.array,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    boxed: PropTypes.bool,
    parseTitle: PropTypes.func,
    parseValue: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
  }

  static defaultProps = {
    className: null,
    value: [],
    label: '',
    placeholder: '',
    disabled: false,
    required: false,
    boxed: false,
    parseValue: (val) => val,
    parseTitle: (val) => val,
    onChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
  }

  constructor(props) {
    super(props);

    injectStyles(styles,
      { id: 'junipero-tags-field-styles', after: '#junipero-main-styles' });

    this.state = {
      value: null,
      input: '',
      focused: false,
      selected: -1,
    };
  }

  componentDidMount() {
    this.onPropValueChanged();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.value &&
      prevProps.value &&
      this.props.value.length !== prevProps.value.length
    ) {
      this.onPropValueChanged();
    }
  }

  onPropValueChanged() {
    const { value, parseValue } = this.props;

    this.setState({
      value: value?.map((item) => parseValue(item)) || this.state.value,
    });
  }

  onClick(e) {
    if (this.props.disabled) {
      return false;
    }

    e.preventDefault();
    this.textInput?.focus();
    return false;
  }

  onFocus(e) {
    if (this.props.disabled) {
      return false;
    }

    this.props.onFocus(e);

    if (
      e.defaultPrevented ||
      (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) ||
      (e.isPropagationStopped && e.isPropagationStopped())
    ) {
      return false;
    }

    this.setState({ focused: true });
    return true;
  }

  onBlur(e) {
    if (this.props.disabled) {
      return false;
    }

    this.props.onFocus(e);

    if (
      e.defaultPrevented ||
      (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) ||
      (e.isPropagationStopped && e.isPropagationStopped())
    ) {
      return false;
    }

    this.setState({ focused: false });
    return true;
  }

  onInputChange(e) {
    if (this.props.disabled) {
      return false;
    }

    const input = e.target.value;

    this.setState({
      input,
      selected: -1,
    });

    return true;
  }

  onKeyDown(e) {
    if (this.props.disabled) {
      return false;
    }

    const {selected, input, value} = this.state;

    if (
      (e.which === 8 || e.keyCode === 8) && // BACKSPACE
      input.trim() === '' &&
      value.length > 0
    ) {
      if (selected < 0) {
        this.selectItem();
      } else {
        this.remove(selected);
      }
      return false;
    } else if (e.which === 27 || e.keyCode === 27) { // ESC
      this.unselectItem();
    }

    return true;
  }

  onKeyPress(e) {
    if (this.props.disabled) {
      return false;
    }

    if (e.which === 13 || e.keyCode === 13) {
      this.add(this.state.input);
      return false;
    }

    return true;
  }

  add(item) {
    if (!item || item.trim() === '') {
      return;
    }

    this.state.value.push(item.trim());

    this.setState({
      value: this.state.value,
      input: '',
    }, () => {

      this.props.onChange({
        value: this.state.value,
      });
    });
  }

  remove(index) {
    this.state.value.splice(index, 1);

    this.setState({
      value: this.state.value,
      selected: -1,
    }, () => {

      this.props.onChange({
        value: this.state.value,
      });
    });
  }

  selectItem() {
    this.setState({
      selected: this.state.value.length - 1,
    });
  }

  unselectItem() {
    this.setState({
      selected: -1,
    });
  }

  render() {
    const {
      disabled,
      required,
      boxed,
      className,
      tabIndex,
      label,
      placeholder,
      ...rest
    } = this.props;

    const { focused, input, value } = this.state;

    return (
      <div
        className={[
          'junipero',
          'junipero-field',
          'tags-field',
          focused ? 'focused' : null,
          input || value?.length ? 'dirty' : null,
          disabled ? 'disabled' : null,
          required ? 'required' : null,
          boxed ? 'boxed' : null,
          className,
        ].join(' ')}
        role="textbox"
        tabIndex={tabIndex}
        onClick={this.onClick.bind(this)}
      >

        <div className="field-wrapper">
          <label
            htmlFor={rest.id}
          >
            { label || placeholder }
          </label>

          <div className="field">

            { this.state.value?.map((item, index) => (
              <span
                key={index}
                className={[
                  'tag',
                  this.state.selected === index ? 'active' : null,
                ].join(' ')}
              >
                { item }
              </span>
            )) }
            <input
              { ...omit(rest, ['parseValue', 'parseTitle']) }
              ref={(ref) => this.textInput = ref}
              type="text"
              disabled={disabled}
              required={required}
              placeholder={placeholder}
              value={input}
              onFocus={this.onFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              onChange={this.onInputChange.bind(this)}
              onKeyPress={this.onKeyPress.bind(this)}
              onKeyDown={this.onKeyDown.bind(this)}
            />
          </div>
        </div>

      </div>
    );
  }
}

export default TagsField;
