import React, {
  useReducer,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { mockState } from '@poool/junipero-utils';
import { TouchableWithoutFeedback, Text, View } from 'react-native';

import { applyStyles } from '../theme';
import styles from './index.styles.js';

const SelectField = forwardRef(({
  autoFocus = false,
  testID = 'SelectField',
  label,
  noSearchResults = 'No result found :(',
  placeholder,
  disabled = false,
  defaultOption = '',
  onChange = () => {},
  options = [],
  parseTitle = val => val?.toString?.(),
  parseValue,
  customStyle = {},
  ...rest }, ref) => {

  const innerRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    active: autoFocus,
    selectedOption: defaultOption,
  });

  useImperativeHandle(ref, () => ({
    active: state.active,
    selectedOption: state.selectedOption,
  }));

  const onPress_ = () => {
    if (disabled) {
      return;
    }
    dispatch({ active: true });
  };

  const isEmpty = () => {
    return !state.selectedOption;
  };

  const onOptionPress_ = option => {
    const value = option.value ? parseValue(option) : parseTitle(option);
    dispatch({ active: false });
    dispatch({ selectedOption: option });
    onChange(value);
  };

  return (
    <View
      pointerEvents={disabled ? 'none' : 'auto'}
      ref={innerRef}
      style={[
        styles.wrapper,
        applyStyles(disabled, [
          styles.wrapper__disabled,
          customStyle.wrapper__disabled,
        ]),
      ]}
      testID="SelectField/Main"
    >
      <TouchableWithoutFeedback
        {...rest}
        testID={testID}
        onPress={onPress_}
      >
        <View>
          <View
            testID="SelectField/Field"
            style={[
              styles.fieldBackground,
              customStyle.fieldBackground,
              applyStyles(state.active, [
                styles.fieldBackground__active,
                customStyle.fieldBackground__active,
              ]),
            ]}>
          </View>
          <View
            pointerEvents="none"
            style={[
              styles.baseField,
              customStyle.baseField,
              applyStyles(state.active, [
                styles.baseField__active,
                customStyle.baseField__active,
              ]),
              applyStyles(!!label, [
                styles.baseField__labeled,
                customStyle.baseField__labeled,
              ]),
            ]}>
            <View>
              <Text
                testID="SelectField/Label"
                style={[
                  styles.label,
                  customStyle.label,
                  applyStyles(!isEmpty(), [
                    styles.label__notEmpty,
                    customStyle.label__notEmpty,
                  ]),
                ]}
              >
                {label}
              </Text>
              <Text
                testID="SelectField/Value"
                style={[
                  styles.value,
                  applyStyles(isEmpty(), [
                    styles.placeholder,
                    customStyle.placeholder,
                  ]),
                  // applyStyles(forceLabel, [
                  //   styles.placeholder__labelEnforced,
                  //   customStyle.placeholder__labelEnforced,
                  // ]),
                ]}
              >
                {parseTitle(state.selectedOption) || placeholder}
              </Text>
            </View>
            <Text
              style={[
                styles.icon,
                customStyle.icon,
                applyStyles(state.active, [
                  styles.icon__active,
                  customStyle.icon__active,
                ]),
              ]}
            >
              code
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      { state.active &&
        <View style={styles.dropdownMenu} testID="SelectField/Dropdown">
          { options.length
            ? options.map(option =>
              <Text
                key={parseTitle(option)}
                testID={parseTitle(option)}
                style={styles.dropdownItem}
                onPress={onOptionPress_.bind(null, option)}>
                {parseTitle(option)}
              </Text>
            )
            : <Text style={styles.noResults} testID="SelectField/NoResults" >
              {noSearchResults}
            </Text>

          }
        </View>
      }
    </View>
  );
});

SelectField.propTypes = {
  autoFocus: PropTypes.bool,
  customStyle: PropTypes.object,
  placeholder: PropTypes.string,
  noSearchResults: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  defaultOption: PropTypes.object,
  options: PropTypes.array,
  onChange: PropTypes.func,
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
  testID: PropTypes.string,
};

SelectField.displayName = 'SelectField';

export default SelectField;
