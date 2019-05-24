import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from './Dropdown';
import DropdownMenu from './DropdownMenu';
import DropdownToggle from './DropdownToggle';
import DropdownItem from './DropdownItem';

import { inject } from './style';
import { omit, classNames } from './utils';
import styles from './theme/components/TagsField.styl';

class TagsField extends React.Component {

  static propTypes = {
    autoCompleteUniqueValues: PropTypes.bool,
    autoCompleteThreshold: PropTypes.number,
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
    autoComplete: PropTypes.func,
    animateMenu: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onToggle: PropTypes.func,
    parseTitle: PropTypes.func,
    parseValue: PropTypes.func,
  }

  static defaultProps = {
    autoCompleteUniqueValues: false,
    autoCompleteThreshold: 400,
    boxed: false,
    disabled: false,
    forceLabel: false,
    label: null,
    placeholder: '',
    readOnly: false,
    required: false,
    theme: 'default',
    value: [],
    autoComplete: null,
    animateTag: tag => tag,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    onToggle: () => {},
    parseTitle: tag => tag,
    parseValue: tag => tag,
  }

  state = {
    autoCompleteOptions: [],
    autoCompleteValue: '',
    autoCompleting: false,
    focused: false,
    input: '',
    selected: -1,
    value: null,
    opened: false,
  };

  menuRef = null;

  constructor(props) {
    super(props);
    inject(styles, 'junipero-tags-field-styles');
  }

  componentDidMount() {
    this.onPropValueChanged();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.value !== prevProps.value ||
      this.props.value?.length !== prevProps.value?.length
    ) {
      this.onPropValueChanged();
    }
  }

  onPropValueChanged() {
    const { value, parseValue } = this.props;

    this.setState({
      value: value?.map((item) => parseValue(item)) || [],
      selected: -1,
    });
  }

  onClick(e) {
    if (this.props.disabled) {
      return false;
    }

    e?.preventDefault();
    this.textInput?.focus();
    return false;
  }

  onFocus(e) {
    if (this.props.disabled) {
      return false;
    }

    this.props.onFocus(e);

    if (
      e?.defaultPrevented ||
      e?.isImmediatePropagationStopped?.() ||
      e?.isPropagationStopped?.()
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

    this.props.onBlur(e);

    if (
      e?.defaultPrevented ||
      e?.isImmediatePropagationStopped?.() ||
      e?.isPropagationStopped?.()
    ) {
      return false;
    }

    if (!e.relatedTarget || e.relatedTarget.className !== 'junipero-option') {
      this.setState({ opened: false });
    }

    this.setState({ focused: false });

    return true;
  }

  onInputChange(e) {
    if (this.props.disabled) {
      return;
    }

    const { autoComplete, autoCompleteThreshold } = this.props;
    const input = e.target.value;

    this.setState({
      input,
      selected: -1,
    }, () => {
      if (!input || input === '') {
        clearTimeout(this._autoCompleteTimeout);
        this.setState({ opened: false, autoCompleting: false });
        return;
      }

      if (autoComplete) {
        this.setState({
          autoCompleting: true,
        }, () => {
          clearTimeout(this._autoCompleteTimeout);
          this._autoCompleteTimeout = setTimeout(() => {
            autoComplete?.(this.state.input, (items) => {
              let autoCompleteOptions = this.props.autoCompleteUniqueValues
                ? items.filter(item => !this.state.value.includes(item))
                : items;

              this.setState({
                autoCompleteOptions,
                autoCompleting: false,
                opened: !!this.state.input,
              }, () => {
                this.menuRef?.updatePopper();
              });
            });
          }, autoCompleteThreshold);
        });
      }
    });
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
      this.setState({ opened: false });
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
      this.setState({ opened: false });
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

  reset() {
    this.onPropValueChanged();
    this.setState({ input: '' });
  }

  onSelectTag(item) {
    this.add(item);
    this.setState({ opened: false });
  }

  onToggle(opened) {
    this.setState({ opened }, () => {
      this.props.onToggle(opened);
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
      animateMenu,
      autoComplete,
      parseTitle,
      ...rest
    } = this.props;

    const {
      focused,
      selected,
      input,
      value,
      opened,
      autoCompleting,
      autoCompleteOptions,
    } = this.state;

    const hasOptions = autoCompleteOptions.length > 0;

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
              { ...omit(rest, [
                'parseValue',
                'parseTitle',
                'autoComplete',
                'autoCompleteThreshold',
                'autoCompleteUniqueValues',
              ]) }
              ref={ref => this.textInput = ref}
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
        { autoComplete && (
          <Dropdown
            theme={theme}
            isOpen={opened && hasOptions}
            onToggle={this.onToggle.bind(this)}
          >
            <DropdownToggle
              tag="div"
              className="toggle"
            >
            </DropdownToggle>
            <DropdownMenu
              ref={ref => this.menuRef = ref}
              className={classNames({
                'auto-completing': autoCompleting,
              })}
              animate={animateMenu}
            >

              { autoCompleteOptions.map((item, index) => (
                <DropdownItem
                  key={index}
                >
                  <a
                    href="#"
                    className="junipero-option"
                    onClick={this.onSelectTag.bind(this, item)}
                  >
                    { parseTitle(item) }
                  </a>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    );
  }
}

export default TagsField;
