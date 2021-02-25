import { StyleSheet } from 'react-native';

import { colors } from '../theme';

export default StyleSheet.create({
  card: {
    minWidth: 150,
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderRadius: 10,
    shadowColor: colors.midnight,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 30,
  },
});
