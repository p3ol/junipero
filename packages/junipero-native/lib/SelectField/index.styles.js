import { StyleSheet } from 'react-native';

import { colors, commons } from '../theme';

export default StyleSheet.create({
  fieldBackground: {
    position: 'absolute',
    left: -2,
    right: -2,
    top: -2,
    bottom: -2,
    backgroundColor: colors.easternBlueAlpha(0.5),
    zIndex: -10,
    borderRadius: 4,
    opacity: 0,
  },
  fieldBackground__active: {
    opacity: 1,
  },
  baseField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
    minHeight: 40,
    flex: 1,
    padding: 9,
    borderRadius: 2,
    backgroundColor: colors.blackSqueeze,
  },
  placeholder: {
    ...commons.defaultFont,
    color: colors.shuttleGray,
  },
  label: {
    ...commons.defaultFont,
    position: 'absolute',
    top: 4,
    left: 9,
    fontSize: 11,
    color: colors.easternBlue,
    zIndex: 4,
    opacity: 0,
  },
  label__notEmpty: {
    opacity: 1,
  },
  value: {
    ...commons.defaultFont,
  },
  icon: {
    ...commons.iconFont,
    color: colors.shuttleGray,
    transform: [{ rotate: '90deg' }],
  },
  dropdownMenu: {
    backgroundColor: colors.white,
    minWidth: 250,
    borderRadius: 2,
    shadowColor: colors.easternBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
  },
  dropdownItem: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    ...commons.defaultFont,
  },
});
