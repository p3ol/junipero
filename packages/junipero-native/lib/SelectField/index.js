import React, {
  useReducer,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import { mockState } from '@poool/junipero-utils';
import { TouchableWithoutFeedback, Text, View } from 'react-native';

import { applyStyles } from '../theme';
import styles from './index.styles.js';

const SelectField = forwardRef(({
  children,
  testID = 'SelectField',
  disabled = false,
  defaultOption = null,
  onPress = () => {},
  options = [],
  theme = 'default',
  size = 'default',
  customStyle = {},
  ...rest }, ref) => {

  const [state, dispatch] = useReducer(mockState, {
    active: false,
    selectedOption: defaultOption,
  });

  useImperativeHandle(ref, () => ({
    active: state.active,
  }));

  const onPress_ = e => {
    if (disabled) {
      return;
    }
    dispatch({ active: true });
    onPress(e);
  };

  const onBlur_ = () => {
    if (disabled) {
      return;
    }
    dispatch({ active: false });
  };

  const onOptionPress_ = option => {
    dispatch({ active: false });
    dispatch({ selectedOption: option });
  };

  return (
    <View>
      <TouchableWithoutFeedback
        testID={testID}
        onPress={onPress_}
      >
        <View style={[
          styles.baseField,
          applyStyles(state.active, [
            styles.baseField__active,
            customStyle.baseField__active,
          ]),
        ]}>
          <Text style={styles.placeholder}>
            {state.selectedOption?.title || 'Choose one item'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      { state.active && <View style={styles.dropdownMenu}>
        {
          options.map(option =>
            <Text
              key={option.title}
              style={styles.dropdownItem}
              onPress={onOptionPress_.bind(null, option)}>
              {option.title}
            </Text>
          )
        }
      </View>
      }
    </View>
  );
});

SelectField.propTypes = {
  customStyle: PropTypes.object,
  disabled: PropTypes.bool,
  defaultOption: PropTypes.object,
  options: PropTypes.array,
  theme: PropTypes.string,
  size: PropTypes.string,
  onPress: PropTypes.func,
  testID: PropTypes.string,
};

SelectField.displayName = 'SelectField';

export default SelectField;
