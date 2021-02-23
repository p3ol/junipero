import React, {
  useReducer,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { mockState } from '@poool/junipero-utils';
import { useTimeout } from '@poool/junipero-hooks';
import { TouchableWithoutFeedback, Text, View } from 'react-native';
import TextField from '../TextField';

import { applyStyles } from '../theme';
import styles from './index.styles.js';

const SelectField = forwardRef(({
  autoFocus = false,
  testID = 'SelectField',
  label,
  noItems = 'No items found :(',
  noSearchResults = 'No result found :(',
  placeholder,
  disabled = false,
  defaultOption = '',
  onChange = () => {},
  options = [],
  parseTitle = val => val?.toString?.(),
  parseValue = () => {},
  search,
  searchPlaceholder = 'Search...',
  searchMinCharacters = 2,
  searchThreshold = 400,
  customStyle = {},
  ...rest }, ref) => {

  const innerRef = useRef();
  const [state, dispatch] = useReducer(mockState, {
    active: autoFocus,
    selectedOption: defaultOption,
    searchValue: '',
    searchResults: null,
    searching: false,
  });

  useImperativeHandle(ref, () => ({
    active: state.active,
    selectedOption: state.selectedOption,
    searching: state.searching,
    searchValue: state.searchValue,
    searchResults: state.searchResults,
  }));

  useTimeout(() => {
    search_();
  }, searchThreshold, [state.searchValue]);

  const onPress_ = () => {
    if (disabled) {
      return;
    }
    dispatch({ active: !state.active });
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

  const onSearch_ = field =>
    dispatch({ searchValue: field.value, searching: true });

  const search_ = async () => {
    if (!state.searchValue) {
      if (state.searching || state.searchResults) {
        dispatch({ searching: false, searchResults: null });
      } else {
        return;
      }
    }
    if (state.searchValue?.length < searchMinCharacters) {
      return;
    }

    const results = await search(state.searchValue);
    dispatch({ searchResults: results, searching: false });
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
        <View style={styles.fieldWrapper}>
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
              applyStyles(!!label && state.selectedOption, [
                styles.baseField__labeled,
                customStyle.baseField__labeled,
              ]),
            ]}>
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
            {'< >'}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      { state.active &&
        <View style={styles.dropdownMenu} testID="SelectField/Dropdown">
          {
            search &&
            <View style={styles.search}>
              <TextField
                testID="SelectField/SearchField"
                placeholder={searchPlaceholder}
                onChange={onSearch_}
              />
            </View>
          }
          { state.searchResults
            ? state.searchResults.length
              ? state.searchResults.map(result =>
                <Text
                  key={parseTitle(result)}
                  testID={parseTitle(result)}
                  style={styles.dropdownItem}
                  onPress={onOptionPress_.bind(null, result)}>
                  {parseTitle(result)}
                </Text>
              )
              : <Text style={styles.noResults} testID="SelectField/NoResults" >
                {noSearchResults}
              </Text>
            : options.length
              ? options.map(option =>
                <Text
                  key={parseTitle(option)}
                  testID={parseTitle(option)}
                  style={[
                    styles.dropdownItem,
                    applyStyles(state.searching, [
                      styles.dropdownItem__searching,
                    ]),
                  ]}
                  onPress={onOptionPress_.bind(null, option)}>
                  {parseTitle(option)}
                </Text>
              )
              : <Text style={styles.noResults} testID="SelectField/NoItems" >
                {noItems}
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
  noItems: PropTypes.string,
  noSearchResults: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  defaultOption: PropTypes.object,
  options: PropTypes.array,
  onChange: PropTypes.func,
  parseTitle: PropTypes.func,
  parseValue: PropTypes.func,
  search: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  searchMinCharacters: PropTypes.number,
  searchThreshold: PropTypes.number,
  testID: PropTypes.string,
};

SelectField.displayName = 'SelectField';

export default SelectField;
