import React, {
  forwardRef,
  useRef,
  useReducer,
  useEffect,
  useImperativeHandle,
} from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { mockState } from '@poool/junipero-utils';

import { applyStyles } from '../theme';
import styles from './index.styles';

const CheckboxField = forwardRef(({
  checked,
  children,
  value,
  customStyle = {},
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  ...rest
}, ref) => {
  const innerRef = useRef();
  const inputRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    checked: checked ?? false,
    focused: false,
    active: false,
  });

  useEffect(() => {
    dispatch({ checked: checked ?? false });
  }, [checked]);

  useImperativeHandle(ref, () => ({
    innerRef,
    inputRef,
    focused: state.focused,
    active: state.active,
  }));

  const onChange_ = () => {
    state.checked = !state.checked;
    state.value = state.checked ? value : null;
    dispatch({ value: state.value, checked: state.checked });
    onChange({ value: state.value, checked: state.checked });
  };

  const onFocus_ = e => {
    dispatch({ focused: true });
    onFocus(e);
  };

  const onBlur_ = e => {
    dispatch({ focused: false });
    onBlur(e);
  };

  const onPressIn_ = () => {
    dispatch({ active: true });
  };

  const onPressOut_ = () => {
    dispatch({ active: false });
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn_}
      onPressOut={onPressOut_}
      onPress={onChange_}
    >
      <View
        focusable={true}
        ref={innerRef}
        onFocus={onFocus_}
        onBlur={onBlur_}
        style={[
          styles.wrapper,
          customStyle.wrapper,
        ]}
        { ...rest }
      >
        <View
          style={[
            styles.check,
            customStyle.check,
            applyStyles(state.active, [
              styles.check__active,
              customStyle.check__active,
            ]),
            applyStyles(state.focused, [
              styles.check__focused,
              customStyle.check__focused,
            ]),
          ]}
        >
          <View
            style={[
              styles.tick,
              customStyle.tick,
              applyStyles(state.checked, [
                styles.tick__checked,
                customStyle.tick__checked,
              ]),
            ]}
          />
          <View
            style={[
              styles.checkBackground,
              customStyle.checkBackground,
              applyStyles(state.checked, [
                styles.checkBackground__checked,
                customStyle.checkBackground__checked,
              ]),
            ]}
          />
        </View>
        <View style={[styles.content, customStyle.content]}>
          { typeof children === 'string' ? (
            <Text style={[styles.text, customStyle.text]}>{ children }</Text>
          ) : children }
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

CheckboxField.propTypes = {
  checked: PropTypes.bool,
  customStyle: PropTypes.object,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.bool,
  ]),
};

export default CheckboxField;
