import { StyleSheet } from 'react-native';

import { commons, colors } from '../theme';

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 2,
  },
  button__small: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 2,
  },
  button__big: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 2,
  },
  button__disabled: {
    opacity: 0.4,
  },
  button__active: {
    opacity: 0.7,
  },
  title: {
    ...commons.defaultFont,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',

  },
  title__big: {
    ...commons.defaultFont,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title__small: {
    ...commons.defaultFont,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  icon: {
    ...commons.iconFont,
    marginHorizontal: 10,
  },
});

export const primary = {
  button: {
    backgroundColor: colors.easternBlue,
  },
  button__active: {
    backgroundColor: colors.persianGreen,
  },
  button__disabled: {
    backgroundColor: colors.powderBlue,
  },
  button__outline: {
    backgroundColor: 'transparent',
    borderColor: colors.easternBlue,
    borderWidth: 1,
  },
  title: {
    color: colors.white,
  },
  title__outline: {
    color: colors.easternBlue,
  },
};
