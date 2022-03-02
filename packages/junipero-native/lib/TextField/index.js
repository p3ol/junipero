import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import { View, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { mockState, exists } from '@poool/junipero-utils';

import { applyStyles } from '../theme';
import styles from './index.styles';

const TextField = forwardRef(({
  autoFocus,
  placeholder,
  label,
  testID = 'TextField/Input',
  valid,
  value,
  customStyle = {},
  disabled = false,
  forceLabel = false,
  required = false,
  textContentType = 'none',
  onBlur = () => {},
  onChange = () => {},
  onFocus = () => {},
  validate = val => !!val || !required,
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    dirty: false,
    valid: valid ?? false,
    value: value ?? '',
    focused: autoFocus ?? false,
  });

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    internalValue: state.value,
    valid: state.valid,
    dirty: state.dirty,
    focused: state.focused,
    reset,
    focus,
    blur,
    setDirty,
  }));

  useEffect(() => {
    if (exists(value)) {
      state.value = value;
      state.valid = validate(state.value, { dirty: state.dirty, required });
      dispatch({ value: state.value, valid: state.valid });
    }
  }, [value]);

  useEffect(() => {
    dispatch({ valid: valid ?? false });
  }, [valid]);

  const onChange_ = val => {
    /* istanbul ignore if: TextInput doesn't fire change event if disabled */
    if (disabled) {
      return;
    }

    state.value = val || '';
    state.dirty = true;
    state.valid = validate(state.value, { dirty: state.dirty, required });
    dispatch({ value: state.value, dirty: state.dirty });
    onChange({ value: state.value, valid: state.valid, dirty: state.dirty });
  };

  const onFocus_ = e => {
    dispatch({ focused: true });
    onFocus(e);
  };

  const onBlur_ = e => {
    dispatch({ focused: false });
    onBlur(e);
  };

  const reset = () =>
    dispatch({ value: value ?? '', valid: valid ?? false, dirty: false });

  const focus = () =>
    inputRef.current?.focus();

  const blur = () =>
    inputRef.current?.blur();

  const setDirty = dirty =>
    dispatch({ dirty });

  const isEmpty = () =>
    !state.value;

  return (
    <View
      ref={innerRef}
      style={[
        styles.wrapper,
        customStyle.wrapper,
      ]}
      testID="TextField/Main"
    >
      <TextInput
        { ...rest }
        ref={inputRef}
        autoFocus={autoFocus}
        disabled={disabled}
        required={required}
        textContentType={textContentType}
        secureTextEntry={textContentType === 'password'}
        value={state.value}
        multiline={rest.rows > 1}
        numberOfLines={rest.rows || 1}
        onBlur={onBlur_}
        onChangeText={onChange_}
        onFocus={onFocus_}
        style={[
          styles.input,
          customStyle.input,
          applyStyles(!!label && !forceLabel, [
            styles.input__labeled,
            customStyle.input__labeled,
          ]),
          applyStyles(!!label && (forceLabel || !isEmpty()), [
            styles.input__notEmpty,
            customStyle.input__notEmpty,
          ]),
          applyStyles(disabled, [
            styles.input__disabled,
            customStyle.input__disabled,
          ]),
          applyStyles(!state.valid && state.dirty, [
            styles.input__invalid,
            customStyle.input__invalid,
          ]),
        ]}
        testID={ testID }
      />
      <View
        testID="TextField/InputBackground"
        style={[
          styles.inputBackground,
          customStyle.inputBackground,
          applyStyles(state.focused, [
            styles.inputBackground__focused,
            customStyle.inputBackground__focused,
          ]),
          applyStyles(!state.valid && state.dirty, [
            styles.inputBackground__invalid,
            customStyle.inputBackground__invalid,
          ]),
        ]}
      />
      { isEmpty() && placeholder && (
        <Text
          style={[
            styles.placeholder,
            customStyle.placeholder,
            applyStyles(forceLabel, [
              styles.placeholder__labelEnforced,
              customStyle.placeholder__labelEnforced,
            ]),
            applyStyles(!state.valid && state.dirty, [
              styles.placeholder__invalid,
              customStyle.placeholder__invalid,
            ]),
          ]}
          testID="TextField/Placeholder"
        >
          { placeholder }
        </Text>
      )}
      <Text
        style={[
          styles.label,
          customStyle.label,
          applyStyles(!isEmpty() || forceLabel, [
            styles.label__notEmpty,
            customStyle.label__notEmpty,
          ]),
          applyStyles(!label, [
            styles.label__notLabeled,
            customStyle.label__notLabeled,
          ]),
          applyStyles(!state.valid && state.dirty, [
            styles.label__invalid,
            customStyle.label__invalid,
          ]),
        ]}
        testID="TextField/Label"
      >
        { label || placeholder }
      </Text>
    </View>
  );
});

TextField.propTypes = {
  autoFocus: PropTypes.bool,
  customStyle: PropTypes.object,
  disabled: PropTypes.bool,
  forceLabel: PropTypes.bool,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
    PropTypes.bool,
  ]),
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
  required: PropTypes.bool,
  textContentType: PropTypes.string,
  valid: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  validate: PropTypes.func,
  testID: PropTypes.string,
};

TextField.displayName = 'TextField';

export default TextField;
