import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, Text, View } from 'react-native';

import styles from './index.styles';
import { applyStyles, colors, getIcon } from '../theme';

const Button = forwardRef(({
  children,
  testID = 'Button',
  outline = false,
  disabled = false,
  onPress = () => {},
  theme = 'default',
  size = 'default',
  customStyle = {},
  ...rest }, ref) => {

  const [active, setActive] = useState(false);
  const [color, setColor] = useState();

  useEffect(() => {
    getColor();
  }, []);

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

  const getColor = () => {
    switch (theme) {
      case 'basic':
        setColor(disabled ? colors.alabaster : colors.white);
        break;
      case 'primary':
        setColor(disabled ? colors.powderBlue : colors.easternBlue);
        break;
      case 'secondary':
        setColor(disabled ? colors.powderBlue : colors.persianGreen);
        break;
      case 'warning':
        setColor(disabled ? colors.disabledButtercup : colors.buttercup);
        break;
      case 'danger':
        setColor(disabled ? colors.disabledMonza : colors.monza);
        break;
      case 'success':
        setColor(disabled ? colors.disabledJava : colors.java);
        break;
      default:
        setColor(customStyle?.button?.backgroundColor ||
          disabled ? colors.powderBlue : colors.easternBlue);
        break;
    }
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
          size === 'big'
            ? styles.button__big
            : size === 'small'
              ? styles.button__small
              : styles.button,
          { backgroundColor: color },
          customStyle.button,
          applyStyles(outline, [
            { backgroundColor: '#fff', borderColor: color, borderWidth: 1 },
            customStyle.button__outline,
          ]),
          applyStyles(disabled, [
            customStyle?.button?.backgroundColor && { opacity: 0.7 },
            customStyle.button__disabled,
          ]),
          applyStyles(active, [
            styles.button__active,
            customStyle.button__active,
          ]),
        ]}
      >
        <Text
          style={[
            size === 'big'
              ? styles.title__big
              : size === 'small'
                ? styles.title__small
                : styles.title,
            color === '#FFF' && { color: colors.midnight },
            color === '#F8F8F8' && { color: colors.midnight },
            applyStyles(outline, [
              { color: customStyle?.button?.backgroundColor || color },
              color === '#FFF' && { color: colors.midnight },
              color === '#F8F8F8' && { color: colors.midnight },
              customStyle.title__outline,
            ]),
            customStyle.title,
          ]}
        >
          {
            React.Children.map(children, child => {
              if (child?.props?.icon) {
                const icon = getIcon(child?.props?.icon);
                return React.cloneElement(
                  child,
                  { style: styles.icon, ...child.props.style },
                  icon,
                );
              } else {
                return child;
              }
            })
          }
        </Text>
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
