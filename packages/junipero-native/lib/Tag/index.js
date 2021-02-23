import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import styles, {
  primary,
  secondary,
  ternary,
  warning,
  danger,
  success,
  basic,
} from './index.styles';

const Tag = ({ theme = 'default', customStyle = {}, ...rest }) => {

  const getStyles = () => {
    switch (theme) {
      case 'primary':
        return primary;
      case 'secondary':
        return secondary;
      case 'ternary':
        return ternary;
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
    <Text
      {...rest }
      testID={theme}
      style={[styles.tag, customStyle, themeStyles]}
    />
  );
};

Tag.propTypes = {
  theme: PropTypes.string,
  customStyle: PropTypes.object,
};

export default Tag;
