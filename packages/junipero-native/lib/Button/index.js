import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';

import styles from './index.styles';
import { applyStyles } from '../theme';

const Button = ({
  children,
  testID = 'Button',
  disabled = false,
  onClick = () => {},
  customStyle = {},
  ...rest
}) => {
  const onPress_ = e => {
    if (disabled) {
      return;
    }

    onClick(e);
  };

  return (
    <TouchableOpacity
      { ...rest }
      style={[
        styles.button,
        customStyle,
        applyStyles(disabled, styles.disabledButton),
      ]}
      disabled={ disabled }
    >
      <Text
        onPress={ onPress_ }
        style={styles.title}
        testID={ testID }>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  customStyle: PropTypes.object,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  testID: PropTypes.string,
};

Button.displayName = 'Button';

export default Button;
