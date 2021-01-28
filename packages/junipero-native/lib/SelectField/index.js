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
  testID = 'SelectField',
  label,
  forceLabel,
  placeholder,
  disabled = false,
  defaultOption = null,
  onPress = () => {},
  options = [],
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

  const isEmpty = () => {
    !state.selectedOption;
  };

  const onOptionPress_ = option => {
    dispatch({ active: false });
    dispatch({ selectedOption: option });
  };

  return (
    <React.Fragment>
      <TouchableWithoutFeedback
        {...rest}
        testID={testID}
        onPress={onPress_}
      >
        <View>
          <View style={[
            styles.fieldBackground,
            customStyle.fieldBackground,
            applyStyles(state.active, [
              styles.fieldBackground__active,
              customStyle.fieldBackground__active,
            ]),
          ]}>
          </View>
          <View style={[
            styles.baseField,
            customStyle.baseField,
            applyStyles(state.active, [
              styles.baseField__active,
              customStyle.baseField__active,
            ]),
          ]}>
            <View>
              <Text
                pointerEvents="none"
                style={[
                  styles.label,
                  customStyle.label,
                  applyStyles(!isEmpty() || forceLabel, [
                    styles.label__notEmpty,
                    customStyle.label__notEmpty,
                  ]),
                ]}
              >
                {label}
              </Text>
              <Text
                pointerEvents="none"
                style={[
                  styles.value,
                  applyStyles(isEmpty(), [
                    styles.placeholder,
                    customStyle.placeholder,
                  ]),
                ]}
              >
                {state.selectedOption?.title || placeholder}
              </Text>
            </View>
            <Text style={styles.icon}>code</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      { state.active &&
        <View style={styles.dropdownMenu}>
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
    </React.Fragment>
  );
});

SelectField.propTypes = {
  customStyle: PropTypes.object,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  forceLabel: PropTypes.bool,
  disabled: PropTypes.bool,
  defaultOption: PropTypes.object,
  options: PropTypes.array,
  onPress: PropTypes.func,
  testID: PropTypes.string,
};

SelectField.displayName = 'SelectField';

export default SelectField;
