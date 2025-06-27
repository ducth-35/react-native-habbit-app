import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../ThemeProvider';
import TextApp from '../textApp';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  buttonText,
  onButtonPress,
}) => {
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    icon: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      lineHeight: theme.fontSize.md * 1.5,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    buttonText: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <Icon 
        name={icon} 
        size={80} 
        color={theme.colors.disabled} 
        style={styles.icon}
      />
      <TextApp preset="txt18Bold" style={styles.title}>{title}</TextApp>
      <TextApp preset="txt16Medium" style={styles.subtitle}>{subtitle}</TextApp>
      {buttonText && onButtonPress && (
        <TouchableOpacity style={styles.button} onPress={onButtonPress}>
          <TextApp preset="txt16SemiBold" style={styles.buttonText}>{buttonText}</TextApp>
        </TouchableOpacity>
      )}
    </View>
  );
};
