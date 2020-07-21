import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#000a24',
    padding: 10,
    borderRadius: 4,
  },
  button__disabled: {
    opacity: 0.4,
  },
  button__active: {
    opacity: 0.7,
  },
  title: {
    color: 'white',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
  },
});
