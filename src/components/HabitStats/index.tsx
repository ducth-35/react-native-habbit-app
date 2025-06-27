import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../ThemeProvider';
import {HabitStats as HabitStatsType} from '../../types/habit';
import TextApp from '../textApp';

interface HabitStatsProps {
  stats: HabitStatsType;
  layout?: 'grid' | 'row';
}

export const HabitStats: React.FC<HabitStatsProps> = ({
  stats,
  layout = 'grid',
}) => {
  const {theme} = useTheme();

  const statsData = [
    {
      label: 'Current Streak',
      value: stats.currentStreak.toString(),
      icon: '🔥',
    },
    {
      label: 'Best Streak',
      value: stats.longestStreak.toString(),
      icon: '🏆',
    },
    {
      label: 'Success Rate',
      value: `${Math.round(stats.completionRate)}%`,
      icon: '📊',
    },
    {
      label: 'Completed',
      value: `${stats.completedDays}/${stats.totalDays}`,
      icon: '✅',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flexDirection: layout === 'row' ? 'row' : 'column',
      gap: theme.spacing.sm,
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    statCard: {
      flex: layout === 'row' ? 1 : undefined,
      minWidth: layout === 'grid' ? '45%' : undefined,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconContainer: {
      marginBottom: theme.spacing.xs,
    },
    icon: {
      fontSize: 24,
    },
    value: {
      marginBottom: theme.spacing.xs,
    },
    label: {
      textAlign: 'center',
    },
  });

  const renderStatCard = (stat: typeof statsData[0], index: number) => (
    <View key={index} style={styles.statCard}>
      <View style={styles.iconContainer}>
        <TextApp style={styles.icon}>{stat.icon}</TextApp>
      </View>
      <TextApp preset="txt18Bold" style={styles.value}>
        {stat.value}
      </TextApp>
      <TextApp preset="txt12Regular" style={styles.label}>
        {stat.label}
      </TextApp>
    </View>
  );

  if (layout === 'grid') {
    return (
      <View style={styles.gridContainer}>
        {statsData.map(renderStatCard)}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {statsData.map(renderStatCard)}
    </View>
  );
};
