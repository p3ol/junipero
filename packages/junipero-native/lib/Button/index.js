import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, Text, View } from 'react-native';

import styles from './index.styles';
import { applyStyles } from '../theme';

const Button = forwardRef(({
  children,
  testID = 'Button',
  disabled = false,
  onPress = () => {},
  customStyle = {},
  ...rest }, ref) => {

  const [active, setActive] = useState(false);

  useImperativeHandle(ref, () => ({
    active,
  }));

  const onPress_ = e => {
    if (disabled) {
      return;
    }
    onPress(e);
  };

  const onPressIn_ = () => {
    if (disabled) {
      return;
    }
    setActive(true);
  };

  const onPressOut_ = () => {
    if (disabled) {
      return;
    }
    setActive(false);
  };

  return (
    <TouchableWithoutFeedback
      testID={testID}
      onPress={onPress_}
      onPressIn={onPressIn_}
      onPressOut={onPressOut_}
    >
      <View
        { ...rest }
        style={[
          styles.button,
          customStyle.button,
          applyStyles(disabled, styles.button__disabled),
          applyStyles(active, styles.button__active),
        ]}
      >
        { typeof children === 'string' ? (
          <Text
            style={[styles.title, customStyle.title]}
          >
            { children }
          </Text>
        ) : children }
      </View>
    </TouchableWithoutFeedback>
  );
});

Button.propTypes = {
  customStyle: PropTypes.object,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  testID: PropTypes.string,
};

Button.displayName = 'Button';

export default Button;
