import { StyleSheet } from 'react-native';

import { colors, commons } from '../theme';

export default StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: 'auto',
    minWidth: 250,
  },
  wrapper__disabled: {
    opacity: 0.5,
  },
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
    height: 'auto',
    padding: 9,
    borderRadius: 2,
    backgroundColor: colors.blackSqueeze,
  },
  baseField__labeled: {
    paddingVertical: 12,
    paddingHorizontal: 9,
  },
  placeholder: {
    ...commons.defaultFont,
    position: 'absolute',
    left: 9,
    minWidth: 200,
    // top: '50%',
    // transform: [
    //   { translateY: '-50%' },
    // ],
    color: colors.shuttleGray,
    zIndex: 3,
  },
  placeholder__labelEnforced: {
    top: 19,
    transform: [
      { translateY: 0 },
    ],
  },
  label: {
    ...commons.defaultFont,
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
    fontWeight: 'bold',
    color: colors.shuttleGray,
    right: 10,
    transform: [{ rotate: '90deg' }, { scaleX: 0.8 }, { scaleY: 1.5 }],
  },
  icon__active: {
    color: colors.easternBlue,
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
    ...commons.defaultFont,
    paddingVertical: 5,
    paddingHorizontal: 20,
    opacity: 1,
  },
  dropdownItem__searching: {
    opacity: 0.5,
  },
  noResults: {
    ...commons.defaultFont,
    color: colors.shuttleGray,
    padding: 10,
    textAlign: 'center',
  },
  search: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
