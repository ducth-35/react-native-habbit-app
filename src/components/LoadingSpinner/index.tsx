import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useTheme} from '../ThemeProvider';
import TextApp from '../textApp';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = 'Loading...',
  size = 'large',
}) => {
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    text: {
      marginTop: theme.spacing.md,
      fontSize: theme.fontSize.md,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={theme.colors.primary} />
      {text && <TextApp preset="txt16Medium" style={styles.text}>{text}</TextApp>}
    </View>
  );
};
