import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../ThemeProvider';
import TextApp from '../textApp';

interface StatsCardProps {
  title: string;
  stats: Array<{
    label: string;
    value: string | number;
    color?: string;
    icon?: string;
  }>;
  variant?: 'default' | 'gradient' | 'minimal';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  stats,
  variant = 'default',
}) => {
  const {theme} = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'gradient':
        return {
          backgroundColor: theme.colors.primary + '08',
          borderWidth: 1,
          borderColor: theme.colors.primary + '20',
        };
      case 'minimal':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
    }
  };

  const styles = StyleSheet.create({
    container: {
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      shadowColor: theme.mode === 'light' ? '#000' : '#FFF',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: theme.mode === 'light' ? 0.06 : 0.2,
      shadowRadius: 12,
      elevation: 6,
      ...getVariantStyle(),
    },
    title: {
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
      opacity: 0.9,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    statItem: {
      flex: 1,
      minWidth: '45%',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.card + '50',
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border + '50',
    },
    statValue: {
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      textAlign: 'center',
      opacity: 0.8,
    },
  });

  return (
    <View style={styles.container}>
      <TextApp preset="txt18Bold" style={styles.title}>
        {title}
      </TextApp>
      
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <TextApp 
              preset="txt18Bold" 
              style={[styles.statValue, {color: stat.color || theme.colors.text}]}>
              {stat.value}
            </TextApp>
            <TextApp preset="txt12Regular" style={styles.statLabel}>
              {stat.label}
            </TextApp>
          </View>
        ))}
      </View>
    </View>
  );
};
