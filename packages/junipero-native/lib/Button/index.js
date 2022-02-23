import {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, Text, View } from 'react-native';

import styles, {
  primary,
  secondary,
  warning,
  danger,
  success,
  basic,
} from './index.styles';
import { applyStyles } from '../theme';

const Button = forwardRef(({
  children,
  testID,
  outline = false,
  disabled = false,
  onPress = () => {},
  theme = 'default',
  size = 'default',
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

  const getStyles = () => {
    switch (theme) {
      case 'primary':
        return primary;
      case 'secondary':
        return secondary;
      case 'warning':
        return warning;
      case 'danger':
        return danger;
      case 'success':
        return success;
      default:
        return basic;
    }
  };

  const themeStyles = getStyles();

  return (
    <TouchableWithoutFeedback
      testID={testID}
      onPress={onPress_}
      onPressIn={onPressIn_}
      onPressOut={onPressOut_}
    >
      <View
        { ...rest }
        testID={testID + '/Inner'}
        style={[
          styles.button,
          themeStyles.button,
          customStyle.button,
          applyStyles(size === 'small', [
            styles.button__small,
            customStyle.button__small,
          ]),
          applyStyles(size === 'big', [
            styles.button__big,
            customStyle.button__big,
          ]),
          applyStyles(outline, [
            themeStyles.button__outline,
            customStyle.button__outline,
          ]),
          applyStyles(disabled, [
            themeStyles.button__disabled,
            customStyle.button__disabled,
          ]),
          applyStyles(active, [
            styles.button__active,
            customStyle.button__active,
          ]),
        ]}
      >
        { typeof children === 'string' ? (
          <Text
            style={[
              applyStyles(size === 'small', [
                styles.title__small,
                customStyle.title__small,
              ]),
              applyStyles(size === 'big', [
                styles.title__big,
                customStyle.title__big,
              ]),
              styles.title,
              themeStyles.title,
              customStyle.title,
              applyStyles(outline, [
                themeStyles.title__outline,
                customStyle.title__outline,
              ]),
            ]}
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
  outline: PropTypes.bool,
  theme: PropTypes.string,
  size: PropTypes.string,
  onPress: PropTypes.func,
  testID: PropTypes.string,
};

Button.displayName = 'Button';

export default Button;
