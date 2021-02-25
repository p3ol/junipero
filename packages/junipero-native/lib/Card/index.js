import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import styles from './index.styles';

const Card = ({ children, customStyles, testID = 'Card', ...rest }) => (
  <View
    {...rest}
    testID={testID}
    style={[styles.card, customStyles?.card]}
  >
    { [children] }
  </View>
);

Card.propTypes = {
  testID: PropTypes.string,
  customStyles: PropTypes.object,
};

export default Card;
