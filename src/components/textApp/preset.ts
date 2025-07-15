import { StyleSheet } from 'react-native';

export const fontDefault = {
  regular: 'SVN-GilroyRegular',
  semiBold: 'SVN-GilroySemiBold',
  medium: 'SVN-GilroyMedium',
  bold: 'SVN-GilroyBold',
};

export const textPresets = StyleSheet.create({
  default: {
    fontFamily: fontDefault.regular,
    color: 'black',
    fontSize: 14,
  },
  txt12Bold: {
    fontFamily: fontDefault.bold,
    color: 'white',
    fontSize: 12,
  },
  txt12Regular: {
    fontFamily: fontDefault.regular,
    color: 'white',
    fontSize: 12,
  },
  txt14SemiBold: {
    fontFamily: fontDefault.semiBold,
    color: 'black',
    fontSize: 14,
  },
  txt16Regular: {
    fontFamily: fontDefault.regular,
    color: 'black',
    fontSize: 16,
  },
  txt16SemiBold: {
    fontFamily: fontDefault.semiBold,
    color: 'black',
    fontSize: 16,
  },
  txt16Medium: {
    fontFamily: fontDefault.medium,
    color: 'black',
    fontSize: 16,
  },
    txt16Bold: {
    fontFamily: fontDefault.bold,
    color: 'black',
    fontSize: 16,
  },
  txt18Bold: {
    fontFamily: fontDefault.bold,
    color: 'black',
    fontSize: 18,
  },
  txt24Bold: {
    fontFamily: fontDefault.bold,
    color: 'white',
    fontSize: 24,
  },
  txt32Bold: {
    fontFamily: fontDefault.bold,
    color: 'black',
    fontSize: 32,
  }
});

export type TextPresetNames = keyof typeof textPresets;
