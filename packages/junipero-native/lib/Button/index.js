import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, Text, View } from 'react-native';

import styles, {
  primary,
} from './index.styles';
import { applyStyles, getIcon } from '../theme';

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

  // const getColor = () => {
  //   switch (theme) {
  //     case 'basic':
  //       setColor(disabled ? colors.alabaster : colors.white);
  //       break;
  //     case 'primary':
  //       setColor(disabled ? colors.powderBlue : colors.easternBlue);
  //       break;
  //     case 'secondary':
  //       setColor(disabled ? colors.powderBlue : colors.persianGreen);
  //       break;
  //     case 'warning':
  //       setColor(disabled ? colors.disabledButtercup : colors.buttercup);
  //       break;
  //     case 'danger':
  //       setColor(disabled ? colors.disabledMonza : colors.monza);
  //       break;
  //     case 'success':
  //       setColor(disabled ? colors.disabledJava : colors.java);
  //       break;
  //     default:
  //       setColor(customStyle?.button?.backgroundColor ||
  //         disabled ? colors.powderBlue : colors.easternBlue);
  //       break;
  //   }
  // };

  const getStyles = () => {
    switch (theme) {
      case 'primary':
        return primary;
      default:
        return primary;
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
              styles.title,
              themeStyles.title,
              customStyle.title,
              applyStyles(size === 'small', [
                styles.title__small,
                customStyle.title__small,
              ]),
              applyStyles(size === 'big', [
                styles.title__big,
                customStyle.title__big,
              ]),
              applyStyles(outline, [
                themeStyles.title__outline,
                customStyle.title__outline,
              ]),
            ]}
          >
            { children }
            {/* {
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
            } */}
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
