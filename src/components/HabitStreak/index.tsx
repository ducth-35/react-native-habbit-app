import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../ThemeProvider';
import {useHabitStore} from '../../store/useHabitStore';
import {DateHelpers} from '../../utils/dateHelpers';
import {Habit} from '../../types/habit';
import TextApp from '../textApp';

interface HabitStreakProps {
  habit: Habit | undefined;
  days?: number;
}

export const HabitStreak: React.FC<HabitStreakProps> = ({
  habit,
  days = 7,
}) => {
  const {theme} = useTheme();
  const {actions} = useHabitStore();

  const getStreakData = () => {
    const today = DateHelpers.getTodayString();
    const streakDays = Array.from({length: days}, (_, i) => {
      const date = DateHelpers.subtractDays(today, days - 1 - i);
      const completion = actions.getHabitCompletionForDate(habit?.id || '', date);
      const isToday = DateHelpers.isToday(date);
      const dayName = DateHelpers.parseDate(date).toLocaleDateString('en', {
        weekday: 'short',
      });
      
      return {
        date,
        completed: completion?.completed || false,
        isToday,
        dayName,
      };
    });
    
    return streakDays;
  };

  const streakData = getStreakData();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    title: {
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    streakContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.xs,
    },
    dayContainer: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
    },
    dayContainerCompleted: {
      backgroundColor: habit?.color + '20',
    },
    dayContainerToday: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    dayName: {
      marginBottom: theme.spacing.xs,
    },
    dayIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: habit?.color,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayIndicatorCompleted: {
      backgroundColor: habit?.color,
    },
    checkIcon: {
      color: '#FFFFFF',
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <TextApp preset="txt16SemiBold" style={styles.title}>
        Last {days} Days
      </TextApp>
      <View style={styles.streakContainer}>
        {streakData.map((day, index) => (
          <View
            key={index}
            style={[
              styles.dayContainer,
              day.completed && styles.dayContainerCompleted,
              day.isToday && styles.dayContainerToday,
            ]}>
            <TextApp preset="txt12Regular" style={styles.dayName}>
              {day.dayName}
            </TextApp>
            <View
              style={[
                styles.dayIndicator,
                day.completed && styles.dayIndicatorCompleted,
              ]}>
              {day.completed && (
                <TextApp style={styles.checkIcon}>✓</TextApp>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
