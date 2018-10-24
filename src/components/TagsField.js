import React from 'react';
import PropTypes from 'prop-types';

import '../theme/components/TagsField.styl';

const propTypes = {
  className: PropTypes.string,
  value: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  deleteComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  boxed: PropTypes.bool,
  prefix: PropTypes.object,
  suffix: PropTypes.object,
  forceValue: PropTypes.bool,
  titleKey: PropTypes.string,
  valueKey: PropTypes.string,
  tabIndex: PropTypes.number,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

const defaultProps = {
  className: null,
  value: [],
  label: '',
  deleteComponent: (<i className="close-icon" />),
  placeholder: '',
  disabled: false,
  required: false,
  boxed: false,
  prefix: null,
  suffix: null,
  forceValue: false,
  titleKey: 'title',
  valueKey: 'value',
  tabIndex: 0,
  onChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
};

class TagsField extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
      input: '',
      focused: false,
      selected: -1,
    };
  }

  onClick(e) {
    if (this.props.disabled) {
      return false;
    }

    e.preventDefault();
    this.input?.focus();
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
    return (
      <div
        className={[
          'junipero',
          'junipero-field',
          'tags-field',
          this.state.focused ? 'focused' : null,
          this.state.input || this.state.value.length ? 'dirty' : null,
          this.props.disabled ? 'disabled' : null,
          this.state.opened ? 'opened' : null,
          this.props.required ? 'required' : null,
          this.props.boxed ? 'boxed' : null,
          this.props.className,
        ].join(' ')}
        role="textbox"
        tabIndex={this.props.tabIndex}
        onClick={this.onClick.bind(this)}
      >

        <div className="field-wrapper">
          { this.props.prefix && (
            <div className="field-prefix">{ this.props.prefix }</div>
          ) }

          <div className="field-inner">

            { this.state.value.map((item, index) => (
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
              ref={(ref) => this.input = ref}
              className="field"
              type="text"
              disabled={this.props.disabled}
              required={this.props.required}
              placeholder={this.props.placeholder}
              value={this.state.input}
              rows={this.props.rows}
              onFocus={this.onFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              onChange={this.onInputChange.bind(this)}
              onKeyPress={this.onKeyPress.bind(this)}
              onKeyDown={this.onKeyDown.bind(this)}
            />

            { this.props.label && (
              <span className="label">{ this.props.label }</span>
            ) }
          </div>

          { this.props.suffix && (
            <div className="field-suffix">{ this.props.suffix }</div>
          ) }
        </div>

      </div>
    );
  }
}

TagsField.propTypes = propTypes;
TagsField.defaultProps = defaultProps;

export default TagsField;
