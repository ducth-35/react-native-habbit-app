import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../components/ThemeProvider';
import { ThemeToggle } from '../../components/ThemeToggle';
import { HabitCard } from '../../components/HabitCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { BottomSheet } from '../../components/BottomSheet';
import { HabitQuickActions } from '../../components/HabitQuickActions';
import { HabitFilter, HabitFilterType } from '../../components/HabitFilter';
import { HabitProgress } from '../../components/HabitProgress';
import { CoinsDisplay } from '../../components/CoinsDisplay';
import { TextApp } from '../../components';
import { useHabitStore } from '../../store/useHabitStore';
import { DateHelpers } from '../../utils/dateHelpers';
import { Habit } from '../../types/habit';
import { navigate } from '../../navigators/navigation-services';
import { APP_SCREEN } from '../../navigators/screen-type';

export const HabitListScreen: React.FC = () => {
  const { theme } = useTheme();
  const { habits, isLoading, actions } = useHabitStore();
  const [selectedDate, setSelectedDate] = useState(
    DateHelpers.getTodayString(),
  );
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [filter, setFilter] = useState<HabitFilterType>('all');

  useEffect(() => {
    actions.loadData();
  }, [actions]);

  const allHabitsForDate = actions.getHabitsForDate(selectedDate);

  // Filter habits based on selected filter
  const filteredHabits = allHabitsForDate.filter(habit => {
    switch (filter) {
      case 'all':
        return true;
      case 'active':
        return habit.isActive;
      case 'inactive':
        return !habit.isActive;
      default:
        return habit.frequency === filter;
    }
  });

  const todayHabits = filteredHabits;

  const handleHabitPress = (habit: Habit) => {
    navigate(APP_SCREEN.HABIT_DETAIL, { habitId: habit.id });
  };

  const handleHabitLongPress = (habit: Habit) => {
    setSelectedHabit(habit);
    setShowQuickActions(true);
  };

  const handleAddHabit = () => {
    navigate(APP_SCREEN.ADD_EDIT_HABIT);
  };

  const handleCloseQuickActions = () => {
    setShowQuickActions(false);
    setSelectedHabit(null);
  };

  const renderDateSelector = () => {
    const isToday = DateHelpers.isToday(selectedDate);
    const displayDate = DateHelpers.getDisplayDate(selectedDate);

    return (
      <View style={styles.dateSelector}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() =>
            setSelectedDate(DateHelpers.subtractDays(selectedDate, 1))
          }>
          <Icon name="chevron-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <TextApp preset="txt16SemiBold" style={styles.dateText}>
            {displayDate}
          </TextApp>
          {!isToday && (
            <TextApp preset="txt12Regular" style={styles.dateSubtext}>
              {selectedDate}
            </TextApp>
          )}
        </View>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setSelectedDate(DateHelpers.addDays(selectedDate, 1))}>
          <Icon name="chevron-right" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHabitCard = ({ item }: { item: Habit }) => (
    <HabitCard
      habit={item}
      date={selectedDate}
      onPress={() => handleHabitPress(item)}
      onLongPress={() => handleHabitLongPress(item)}
      showStats={false}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="track-changes"
      title="No Habits Yet"
      subtitle="Start building better habits by creating your first one!"
      buttonText="Create Your First Habit"
      onButtonPress={handleAddHabit}
    />
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    headerTitle: {
      fontSize: theme.fontSize.xl,
      fontWeight: '700',
      color: theme.colors.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dateSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    dateButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dateContainer: {
      flex: 1,
      alignItems: 'center',
    },
    dateText: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
    },
    dateSubtext: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: theme.fontSize.lg,
      fontWeight: '700',
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    listContainer: {
      flex: 1,
    },
    progressContainer: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
  });

  const completedToday = todayHabits.filter(habit => {
    const completion = actions.getHabitCompletionForDate(
      habit.id,
      selectedDate,
    );
    return completion?.completed;
  }).length;

  if (isLoading) {
    return <LoadingSpinner text="Loading your habits..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TextApp preset="txt24Bold" style={styles.headerTitle}>
          Minhabit
        </TextApp>
        <View style={styles.headerActions}>
          <CoinsDisplay />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigate(APP_SCREEN.ALL_HABITS)}>
            <Icon name="list" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ThemeToggle />
        </View>
      </View>

      {/* Date Selector */}
      {renderDateSelector()}

      {/* Filter */}
      <HabitFilter selectedFilter={filter} onFilterChange={setFilter} />

      {/* Stats */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {todayHabits.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <TextApp preset="txt18Bold" style={styles.statValue}>
                {completedToday}
              </TextApp>
              <TextApp preset="txt12Regular" style={styles.statLabel}>
                Completed
              </TextApp>
            </View>
            <View style={styles.statItem}>
              <TextApp preset="txt18Bold" style={styles.statValue}>
                {todayHabits.length}
              </TextApp>
              <TextApp preset="txt12Regular" style={styles.statLabel}>
                Total
              </TextApp>
            </View>
            <View style={styles.statItem}>
              <TextApp preset="txt18Bold" style={styles.statValue}>
                {todayHabits.length > 0
                  ? Math.round((completedToday / todayHabits.length) * 100)
                  : 0}
                %
              </TextApp>
              <TextApp preset="txt12Regular" style={styles.statLabel}>
                Success Rate
              </TextApp>
            </View>
          </View>
        )}

        {/* Progress Bar */}
        {todayHabits.length > 0 && (
          <View style={styles.progressContainer}>
            <HabitProgress
              completed={completedToday}
              total={todayHabits.length}
              size="large"
              showPercentage={true}
              showNumbers={true}
              color={theme.colors.primary}
            />
          </View>
        )}

        {/* Habit List */}
        <View style={styles.listContainer}>
          {todayHabits.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={todayHabits}
              renderItem={renderHabitCard}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      {/* <FloatingActionButton onPress={handleAddHabit} /> */}

      {/* Quick Actions Bottom Sheet */}
      <BottomSheet visible={showQuickActions} onClose={handleCloseQuickActions}>
        {selectedHabit && (
          <HabitQuickActions
            habit={selectedHabit}
            onClose={handleCloseQuickActions}
          />
        )}
      </BottomSheet>
    </View>
  );
};
