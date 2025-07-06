import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../components/ThemeProvider';
import { HabitCard } from '../../components/HabitCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { BottomSheet } from '../../components/BottomSheet';
import { HabitQuickActions } from '../../components/HabitQuickActions';
import { HabitFilter, HabitFilterType } from '../../components/HabitFilter';
import { HabitStats } from '../../components/HabitStats';
import { TextApp } from '../../components';
import { useHabitStore } from '../../store/useHabitStore';
import { Habit } from '../../types/habit';
import { navigate, goBack } from '../../navigators/navigation-services';
import { APP_SCREEN } from '../../navigators/screen-type';

export const AllHabitsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { habits, isLoading, actions } = useHabitStore();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [filter, setFilter] = useState<HabitFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    actions.loadData();
  }, [actions]);

  // Filter and search habits
  const filteredHabits = habits.filter(habit => {
    // Apply filter
    let matchesFilter = true;
    switch (filter) {
      case 'all':
        matchesFilter = true;
        break;
      case 'active':
        matchesFilter = habit.isActive;
        break;
      case 'inactive':
        matchesFilter = !habit.isActive;
        break;
      default:
        matchesFilter = habit.frequency === filter;
        break;
    }

    // Apply search
    const matchesSearch = searchQuery === '' ||
      habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

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

  const renderHabitCard = ({ item }: { item: Habit }) => (
    <HabitCard
      habit={item}
      onPress={() => handleHabitPress(item)}
      onLongPress={() => handleHabitLongPress(item)}
      showStats={true}
    />
  );

  const renderEmptyState = () => {
    if (searchQuery || filter !== 'all') {
      return (
        <EmptyState
          icon="search-off"
          title="No habits found"
          subtitle="Try adjusting your search or filter criteria"
        />
      );
    }

    return (
      <EmptyState
        icon="track-changes"
        title="No Habits Yet"
        subtitle="Start building better habits by creating your first one!"
        buttonText="Create Your First Habit"
        onButtonPress={handleAddHabit}
      />
    );
  };

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
      flex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchIcon: {
      marginRight: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
    },
    clearButton: {
      padding: theme.spacing.xs,
    },
    statsOverview: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    },
    statsTitle: {
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    listContainer: {
      flex: 1,
    },
  });

  // Calculate overall stats
  const activeHabits = habits.filter(h => h.isActive);
  const totalStats = activeHabits.reduce(
    (acc, habit) => {
      const stats = actions.getHabitStats(habit.id);
      return {
        totalDays: acc.totalDays + stats.totalDays,
        completedDays: acc.completedDays + stats.completedDays,
        currentStreak: Math.max(acc.currentStreak, stats.currentStreak),
        longestStreak: Math.max(acc.longestStreak, stats.longestStreak),
        completionRate: acc.completionRate + stats.completionRate,
      };
    },
    { totalDays: 0, completedDays: 0, currentStreak: 0, longestStreak: 0, completionRate: 0 }
  );

  const overallStats = {
    habitId: 'overall',
    ...totalStats,
    completionRate: activeHabits.length > 0 ? totalStats.completionRate / activeHabits.length : 0,
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading your habits..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <TextApp preset="txt24Bold">All Habits</TextApp>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={20}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search habits..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}>
            <Icon name="clear" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter */}
      <HabitFilter selectedFilter={filter} onFilterChange={setFilter} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Overall Stats */}
        {activeHabits.length > 0 && (
          <View style={styles.statsOverview}>
            <TextApp preset="txt18Bold" style={styles.statsTitle}>
              Overall Statistics
            </TextApp>
            <HabitStats stats={overallStats} layout="grid" />
          </View>
        )}

        {/* Habit List */}
        <View style={styles.listContainer}>
          {filteredHabits.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredHabits}
              renderItem={renderHabitCard}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <FloatingActionButton onPress={handleAddHabit} />

      {/* Quick Actions Bottom Sheet */}
      <BottomSheet
        visible={showQuickActions}
        onClose={handleCloseQuickActions}>
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
