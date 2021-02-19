import { StyleSheet } from 'react-native';

import { commons, colors } from '../theme';

export default StyleSheet.create({
  tag: {
    ...commons.defaultFont,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 16,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
});

export const basic = {
  backgroundColor: colors.alto,
};

export const primary = {
  color: colors.white,
  backgroundColor: colors.easternBlue,
};

export const secondary = {
  color: colors.white,
  backgroundColor: colors.persianGreen,
};

export const ternary = {
  color: colors.white,
  backgroundColor: colors.portage,
};

export const warning = {
  color: colors.white,
  backgroundColor: colors.buttercup,
};

export const danger = {
  color: colors.white,
  backgroundColor: colors.monza,
};

export const success = {
  color: colors.white,
  backgroundColor: colors.java,
};
