import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../ThemeProvider';
import TextApp from '../textApp';

interface HabitProgressProps {
  completed: number;
  total: number;
  color?: string;
  size?: 'small' | 'medium' | 'large';
  showPercentage?: boolean;
  showNumbers?: boolean;
}

export const HabitProgress: React.FC<HabitProgressProps> = ({
  completed,
  total,
  color,
  size = 'medium',
  showPercentage = true,
  showNumbers = false,
}) => {
  const {theme} = useTheme();
  
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const progressColor = color || theme.colors.primary;
  
  const sizeConfig = {
    small: {
      height: 4,
      borderRadius: 2,
      fontSize: 'txt12Regular' as const,
    },
    medium: {
      height: 6,
      borderRadius: 3,
      fontSize: 'txt14SemiBold' as const,
    },
    large: {
      height: 8,
      borderRadius: 4,
      fontSize: 'txt16SemiBold' as const,
    },
  };

  const config = sizeConfig[size];

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    progressBar: {
      height: config.height,
      backgroundColor: theme.colors.surface,
      borderRadius: config.borderRadius,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    progressFill: {
      height: '100%',
      backgroundColor: progressColor,
      borderRadius: config.borderRadius,
    },
    textContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    percentageText: {
      color: progressColor,
    },
    numbersText: {
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {width: `${Math.min(percentage, 100)}%`},
          ]}
        />
      </View>
      
      {(showPercentage || showNumbers) && (
        <View style={styles.textContainer}>
          {showPercentage && (
            <TextApp preset={config.fontSize} style={styles.percentageText}>
              {Math.round(percentage)}%
            </TextApp>
          )}
          {showNumbers && (
            <TextApp preset={config.fontSize} style={styles.numbersText}>
              {completed}/{total}
            </TextApp>
          )}
        </View>
      )}
    </View>
  );
};
