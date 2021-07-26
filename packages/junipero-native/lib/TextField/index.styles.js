import { StyleSheet } from 'react-native';

import { colors, commons } from '../theme';

export default StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: 'auto',
    minWidth: 250,
  },
  input: {
    padding: 9,
    borderRadius: 2,
    width: '100%',
    backgroundColor: colors.blackSqueeze,
    ...commons.defaultFont,
    zIndex: 2,
  },
  input__labeled: {
    paddingVertical: 12,
    paddingHorizontal: 9,
  },
  input__notEmpty: {
    paddingTop: 19,
    paddingBottom: 5,
  },
  input__disabled: {
    opacity: 0.5,
  },
  input__invalid: {
    backgroundColor: colors.lavenderBlush,
  },
  inputBackground: {
    position: 'absolute',
    opacity: 0,
    left: -2,
    right: -2,
    top: -2,
    bottom: -2,
    backgroundColor: colors.easternBlueAlpha(0.5),
    zIndex: 1,
    borderRadius: 4,
  },
  inputBackground__focused: {
    opacity: 1,
  },
  inputBackground__invalid: {
    backgroundColor: colors.monzaAlpha(0.5),
  },
  placeholder: {
    ...commons.defaultFont,
    position: 'absolute',
    left: 9,
    top: '50%',
    transform: [
      { translateY: '-50%' },
    ],
    color: colors.shuttleGray,
    zIndex: 3,
  },
  placeholder__labelEnforced: {
    top: 19,
    transform: [
      { translateY: 0 },
    ],
  },
  placeholder__invalid: {
    color: colors.monza,
  },
  label: {
    ...commons.defaultFont,
    position: 'absolute',
    opacity: 0,
    top: 4,
    left: 9,
    fontSize: 11,
    color: colors.easternBlue,
    zIndex: 4,
  },
  label__notEmpty: {
    opacity: 1,
  },
  label__notLabeled: {
    opacity: 0,
  },
  label__invalid: {
    color: colors.monza,
  },
});
