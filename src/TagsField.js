import React from 'react';
import PropTypes from 'prop-types';

import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/TagsField.styl';

class TagsField extends React.Component {

  static propTypes = {
    boxed: PropTypes.bool,
    disabled: PropTypes.bool,
    forceLabel: PropTypes.bool,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
    ]),
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    theme: PropTypes.string,
    value: PropTypes.array,
    animateTag: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    parseTitle: PropTypes.func,
    parseValue: PropTypes.func,
  }

  static defaultProps = {
    boxed: false,
    disabled: false,
    forceLabel: false,
    label: '',
    placeholder: '',
    readOnly: false,
    required: false,
    theme: 'default',
    value: [],
    animateTag: tag => tag,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    parseTitle: tag => tag,
    parseValue: tag => tag,
  }

  state = {
    focused: false,
    input: '',
    selected: -1,
    value: null,
  };

  constructor(props) {
    super(props);
    inject(styles, 'junipero-tags-field-styles');
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

  onKeyDown(event) {
    if (this.props.disabled) {
      return false;
    }

    const {selected, input, value} = this.state;

    if (
      (event.which === 8 || event.keyCode === 8) && // BACKSPACE
      input.trim() === '' &&
      value.length > 0
    ) {
      if (selected < 0) {
        this.selectItem();
      } else {
        this.remove(selected);
      }
      return false;
    } else if (event.which === 27 || event.keyCode === 27) { // ESC
      this.unselectItem();
    }

    return true;
  }

  onKeyPress(event) {
    if (this.props.disabled) {
      return false;
    }

    if (event.which === 13 || event.keyCode === 13) { // ENTER
      this.add(this.state.input);
      event.preventDefault();
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
      readOnly,
      required,
      boxed,
      className,
      tabIndex,
      label,
      placeholder,
      theme,
      animateTag,
      forceLabel,
      ...rest
    } = this.props;

    const { focused, selected, input, value } = this.state;

    return (
      <div
        className={classNames(
          'junipero',
          'junipero-field',
          'junipero-tags-field',
          'theme-' + theme,
          {
            focused,
            disabled,
            required,
            boxed,
            dirty: input || value?.length,
            'force-label': forceLabel,
            'with-label': label !== false && (label || placeholder),
          },
          className,
        )}
        role="textbox"
        tabIndex={tabIndex}
        onClick={this.onClick.bind(this)}
      >

        <div className="field-wrapper">
          { label !== false && (
            <label
              htmlFor={rest.id}
            >
              { label || placeholder }
            </label>
          )}

          <div className="field">

            { value?.map((item, index) => animateTag((
              <span
                key={index}
                className={classNames(
                  'tag',
                  {
                    active: selected === index,
                  },
                )}
              >
                { item }
                <i
                  role="button"
                  tabIndex={-1}
                  className="delete"
                  onClick={this.remove.bind(this, index)}
                />
              </span>
            ), index)) }
            <input
              { ...omit(rest, ['parseValue', 'parseTitle']) }
              ref={(ref) => this.textInput = ref}
              type="text"
              readOnly={readOnly}
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
