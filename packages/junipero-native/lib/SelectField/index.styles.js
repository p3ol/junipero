import { Platform, StyleSheet } from 'react-native';

import { colors, commons } from '../theme';

export default StyleSheet.create({
  baseField: {
    minHeight: 40,
    flex: 1,
    padding: 9,
    borderRadius: 2,
    backgroundColor: colors.blackSqueeze,
  },
  baseField__active: {
    borderColor: colors.easternBlueAlpha(0.5),
    borderWidth: 2,
    borderRadius: 2,
  },
  placeholder: {
    fontSize: 16,
  },
  dropdownMenu: {
    background: colors.white,
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
    colors: colors.midnight,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
});
