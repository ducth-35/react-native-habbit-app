import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../ThemeProvider';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
}) => {
  const {theme} = useTheme();

  const paddingValues = {
    none: 0,
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg,
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.card,
          shadowColor: theme.mode === 'light' ? '#000' : '#FFF',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: theme.mode === 'light' ? 0.12 : 0.3,
          shadowRadius: 24,
          elevation: 12,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.colors.border,
        };
      case 'gradient':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.primary + '20',
        };
      default:
        return {
          backgroundColor: theme.colors.card,
          shadowColor: theme.mode === 'light' ? '#000' : '#FFF',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: theme.mode === 'light' ? 0.08 : 0.2,
          shadowRadius: 12,
          elevation: 6,
        };
    }
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.xl,
      padding: paddingValues[padding],
      ...getVariantStyle(),
    },
  });

  return <View style={[styles.container, style]}>{children}</View>;
};
