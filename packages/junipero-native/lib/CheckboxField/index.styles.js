import { StyleSheet } from 'react-native';

import { colors, commons } from '../theme';

export default StyleSheet.create({
  wrapper: {
    cursor: 'pointer',
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'start',
  },
  check: {
    flex: -1,
    width: 20,
    height: 20,
    marginRight: 8,
    marginTop: 1,
    borderRadius: 4,
    backgroundColor: colors.white,
    position: 'relative',
  },
  check__active: {
    transform: [{ scale: 0.95 }],
  },
  check__focused: {
    backgroundColor: colors.easternBlueAlpha(0.7),
  },
  checkBackground: {
    width: 16,
    height: 16,
    position: 'absolute',
    backgroundColor: colors.blackSqueeze,
    borderRadius: 2,
    zIndex: 1,
    left: 2,
    top: 2,
  },
  checkBackground__checked: {
    backgroundColor: colors.easternBlue,
  },
  tick: {
    width: 5,
    height: 9,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.white,
    borderRightWidth: 2,
    borderRightStyle: 'solid',
    borderRightColor: colors.white,
    transform: [
      { translateX: '-50%' },
      { translateY: '-50%' },
      { rotate: '45deg' },
    ],
    left: 10,
    top: 9,
    opacity: 0,
    zIndex: 2,
    position: 'absolute',
  },
  tick__checked: {
    opacity: 1,
  },
  content: {
    flex: 1,
  },
  text: {
    ...commons.defaultFont,
  },
});
