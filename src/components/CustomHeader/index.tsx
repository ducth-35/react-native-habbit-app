import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../ThemeProvider';
import TextApp from '../textApp';

interface CustomHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showGradient?: boolean;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showGradient = false,
}) => {
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: showGradient 
        ? theme.colors.primary + '05'
        : theme.colors.background,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.md,
      borderBottomWidth: showGradient ? 0 : 1,
      borderBottomColor: theme.colors.border,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      marginBottom: subtitle ? 4 : 0,
    },
    subtitle: {
      opacity: 0.7,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    rightIconButton: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {leftIcon && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onLeftPress}
              activeOpacity={0.7}>
              <Icon name={leftIcon} size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          
          <View style={styles.titleContainer}>
            <TextApp preset="txt24Bold" style={styles.title}>
              {title}
            </TextApp>
            {subtitle && (
              <TextApp preset="txt14SemiBold" style={styles.subtitle}>
                {subtitle}
              </TextApp>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          {rightIcon && (
            <TouchableOpacity
              style={styles.rightIconButton}
              onPress={onRightPress}
              activeOpacity={0.7}>
              <Icon name={rightIcon} size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
