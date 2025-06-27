import React from 'react';
import {Text} from 'react-native';
import {TextProperties} from './type';
import {textPresets} from './preset';
import {useTheme} from '../ThemeProvider';

const TextApp = ({
  style: styleOverride = {},
  children,
  preset = 'default',
  onPress,
  color,
  ...props
}: TextProperties) => {
  const {theme} = useTheme();

  let newStyle;
  const baseStyle = {
    ...textPresets[preset],
    color: color || theme.colors.text, // Use theme color if no color specified
  };

  if (Array.isArray(styleOverride)) {
    newStyle = [baseStyle, ...styleOverride];
  } else {
    newStyle = [baseStyle, styleOverride];
  }

  return (
    <Text
      {...props}
      style={newStyle}
      onPress={onPress}
      allowFontScaling={false}>
      {children}
    </Text>
  );
};

export default TextApp;
