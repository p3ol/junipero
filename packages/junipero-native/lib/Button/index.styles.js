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
    fontSize: 16,
    fontWeight: 'bold',

  },
  title__big: {
    ...commons.defaultFont,
    fontSize: 20,
    fontWeight: 'bold',
  },
  title__small: {
    ...commons.defaultFont,
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

export const secondary = {
  button: {
    backgroundColor: colors.persianGreen,
  },
  button__active: {
    backgroundColor: '#0e6176',
  },
  button__disabled: {
    backgroundColor: colors.powderBlue,
  },
  button__outline: {
    backgroundColor: 'transparent',
    borderColor: colors.persianGreen,
    borderWidth: 1,
  },
  title: {
    color: colors.white,
  },
  title__outline: {
    color: colors.persianGreen,
  },
};

export const warning = {
  button: {
    backgroundColor: colors.buttercup,
  },
  button__active: {
    backgroundColor: '#dc8d0a',
  },
  button__disabled: {
    backgroundColor: colors.disabledButtercup,
  },
  button__outline: {
    backgroundColor: 'transparent',
    borderColor: colors.buttercup,
    borderWidth: 1,
  },
  title: {
    color: colors.white,
  },
  title__outline: {
    color: colors.buttercup,
  },
};

export const danger = {
  button: {
    backgroundColor: colors.monza,
  },
  button__active: {
    backgroundColor: '#b70002',
  },
  button__disabled: {
    backgroundColor: colors.disabledMonza,
  },
  button__outline: {
    backgroundColor: 'transparent',
    borderColor: colors.monza,
    borderWidth: 1,
  },
  title: {
    color: colors.white,
  },
  title__outline: {
    color: colors.monza,
  },
};

export const success = {
  button: {
    backgroundColor: colors.java,
  },
  button__active: {
    backgroundColor: '#08b790',
  },
  button__disabled: {
    backgroundColor: colors.disabledJava,
  },
  button__outline: {
    backgroundColor: 'transparent',
    borderColor: colors.java,
    borderWidth: 1,
  },
  title: {
    color: colors.white,
  },
  title__outline: {
    color: colors.java,
  },
};

export const basic = {
  button: {
    backgroundColor: colors.white,
  },
  button__active: {
    backgroundColor: colors.alabaster,
  },
  button__disabled: {
    backgroundColor: colors.alabaster,
  },
  button__outline: {
    backgroundColor: 'transparent',
    borderColor: colors.alabaster,
    borderWidth: 1,
  },
  title: {
    color: colors.midnight,
  },
  title__outline: {
    color: colors.midnight,
  },
};
