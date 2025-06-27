import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '../ThemeProvider';
import {useThemeStore} from '../../store/useThemeStore';

interface ThemeToggleProps {
  size?: number;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({size = 24}) => {
  const {theme} = useTheme();
  const {mode, actions} = useThemeStore();

  const handleToggle = () => {
    actions.toggleTheme();
  };

  return (
    <TouchableOpacity
      style={[styles.container, {backgroundColor: theme.colors.surface}]}
      onPress={handleToggle}
      activeOpacity={0.7}>
      <Icon
        name={mode === 'light' ? 'moon' : 'sunny'}
        size={size}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
