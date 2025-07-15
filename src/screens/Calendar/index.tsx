import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../components/ThemeProvider';
import { CalendarView } from '../../components/CalendarView';
import { HabitCard } from '../../components/HabitCard';
import { EmptyState } from '../../components/EmptyState';
import { TextApp } from '../../components';
import { useHabitStore } from '../../store/useHabitStore';
import { DateHelpers } from '../../utils/dateHelpers';
import { goBack, navigate } from '../../navigators/navigation-services';
import { APP_SCREEN } from '../../navigators/screen-type';

export const CalendarScreen: React.FC = () => {
  const { theme } = useTheme();
  const { actions } = useHabitStore();
  const [selectedDate, setSelectedDate] = useState(DateHelpers.getTodayString());

  useEffect(() => {
    actions.loadData();
  }, [actions]);

  const habitsForDate = actions.getHabitsForDate(selectedDate);
  const isToday = DateHelpers.isToday(selectedDate);
  const displayDate = DateHelpers.getDisplayDate(selectedDate);

  const completedCount = habitsForDate.filter(habit => {
    const completion = actions.getHabitCompletionForDate(habit.id, selectedDate);
    return completion?.completed;
  }).length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.text,
    },
    selectedDateContainer: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },
    selectedDateHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    selectedDateTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
    },
    selectedDateSubtitle: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    habitsSection: {
      flex: 1,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
    },
    habitCount: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },

  });

  const renderEmptyState = () => (
    <EmptyState
      icon="event-available"
      title={isToday ? 'No habits for today' : `No habits for ${displayDate}`}
      subtitle={isToday
        ? 'Create some habits to start tracking your progress!'
        : 'Select a different date or create new habits.'
      }
    />
  );

   const handleHabitPress = (habit: any) => {
      navigate(APP_SCREEN.HABIT_DETAIL, { habitId: habit.id });
    };
  
 

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TextApp preset="txt24Bold" style={styles.headerTitle}>Calendar</TextApp>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar */}
        <CalendarView
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          showHabitDots={true}
        />

        {/* Selected Date Info */}
        <View style={styles.selectedDateContainer}>
          <View style={styles.selectedDateHeader}>
            <View>
              <TextApp preset="txt18Bold" style={styles.selectedDateTitle}>{displayDate}</TextApp>
              <TextApp preset="txt14SemiBold" style={styles.selectedDateSubtitle}>{selectedDate}</TextApp>
            </View>
          </View>

          {habitsForDate.length > 0 && (
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <TextApp preset="txt16SemiBold" style={styles.statValue}>{completedCount}</TextApp>
                <TextApp preset="txt12Regular" style={styles.statLabel}>Completed</TextApp>
              </View>
              <View style={styles.statItem}>
                <TextApp preset="txt16SemiBold" style={styles.statValue}>{habitsForDate.length}</TextApp>
                <TextApp preset="txt12Regular" style={styles.statLabel}>Total</TextApp>
              </View>
              <View style={styles.statItem}>
                <TextApp preset="txt16SemiBold" style={styles.statValue}>
                  {habitsForDate.length > 0
                    ? Math.round((completedCount / habitsForDate.length) * 100)
                    : 0}%
                </TextApp>
                <TextApp preset="txt12Regular" style={styles.statLabel}>Success Rate</TextApp>
              </View>
            </View>
          )}
        </View>

        {/* Habits for Selected Date */}
        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <TextApp preset="txt18Bold" style={styles.sectionTitle}>
              {isToday ? "Today's Habits" : 'Habits'}
            </TextApp>
            <TextApp preset="txt14SemiBold" style={styles.habitCount}>
              {habitsForDate.length} habit{habitsForDate.length !== 1 ? 's' : ''}
            </TextApp>
          </View>

          {habitsForDate.length === 0 ? (
            renderEmptyState()
          ) : (
            habitsForDate.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                date={selectedDate}
                onPress={() => handleHabitPress(habit)}
                showStats={false}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};
