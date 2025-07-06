import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../components/ThemeProvider';
import { HabitCard } from '../../components/HabitCard';
import { CalendarView } from '../../components/CalendarView';
import { HabitStats } from '../../components/HabitStats';
import { HabitStreak } from '../../components/HabitStreak';
import { TextApp } from '../../components';
import { useHabitStore } from '../../store/useHabitStore';
import { DateHelpers } from '../../utils/dateHelpers';
import { goBack, navigate } from '../../navigators/navigation-services';
import { StackScreenProps } from '../../navigators/screen-type';
import { APP_SCREEN } from '../../navigators/screen-type';

type Props = StackScreenProps<APP_SCREEN.HABIT_DETAIL>;

export const HabitDetailScreen: React.FC<Props> = ({ route }) => {
  const { theme } = useTheme();
  const { actions } = useHabitStore();
  const [selectedDate, setSelectedDate] = useState(DateHelpers.getTodayString());

  const habitId = route?.params?.habitId;
  const habit = habitId ? actions.getHabitById(habitId) : undefined;
  const stats = habitId ? actions.getHabitStats(habitId) : undefined;

  useEffect(() => {
    actions.loadData();
  }, [actions]);

  const handleEdit = () => {
    navigate(APP_SCREEN.ADD_EDIT_HABIT, { habit });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit?.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            actions.deleteHabit(habit?.id || '');
            goBack();
          },
        },
      ]
    );
  };

  const handleToggleActive = () => {
    actions.toggleHabitActive(habit?.id || '');
  };

  const getRecentCompletions = () => {
    const completions = actions.getHabitCompletions(habit?.id || '');
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = DateHelpers.subtractDays(DateHelpers.getTodayString(), i);
      const completion = completions.find(c => c.date === date);
      return {
        date,
        completed: completion?.completed || false,
        dayName: DateHelpers.getDisplayDate(date),
      };
    }).reverse();
    return last7Days;
  };

  const recentCompletions = getRecentCompletions();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    errorContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
    },
    errorText: {
      fontSize: theme.fontSize.lg,
      color: theme.colors.error,
      marginVertical: theme.spacing.lg,
      textAlign: 'center',
    },
    errorButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    errorButtonText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.md,
      fontWeight: '600',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
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
    headerActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.sm,

    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
      marginHorizontal: theme.spacing.md,
      marginBottom: theme.spacing.md,

    },


    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      backgroundColor: habit?.isActive ? theme.colors.success + '20' : theme.colors.error + '20',
      marginHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    statusText: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
      color: habit?.isActive ? theme.colors.success : theme.colors.error,
    },
    toggleButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: habit?.isActive ? theme.colors.error : theme.colors.success,
      borderRadius: theme.borderRadius.md,
    },
    toggleButtonText: {
      color: '#FFFFFF',
      fontSize: theme.fontSize.sm,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TextApp preset="txt24Bold" style={styles.headerTitle}>Habit Details</TextApp>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Icon name="edit" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Icon name="delete" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Habit Card */}
        <HabitCard habit={habit} showStats={false} />

        {/* Status */}
        <View style={styles.section}>
          <View style={styles.statusContainer}>
            <TextApp preset="txt16SemiBold" style={styles.statusText}>
              Status: {habit?.isActive ? 'Active' : 'Inactive'}
            </TextApp>
            <TouchableOpacity style={styles.toggleButton} onPress={handleToggleActive}>
              <TextApp preset="txt14SemiBold" style={styles.toggleButtonText}>
                {habit?.isActive ? 'Deactivate' : 'Activate'}
              </TextApp>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        {stats && (
          <View style={styles.section}>
            <TextApp preset="txt18Bold" style={styles.sectionTitle}>Statistics</TextApp>
            <HabitStats stats={stats} layout="grid" />
          </View>
        )}

        {/* Recent Activity */}
        <View style={[styles.section, { marginHorizontal: theme.spacing.md }]}>
          <HabitStreak habit={habit} days={7} />
        </View>

        {/* Calendar */}
        <View style={styles.section}>
          <TextApp preset="txt18Bold" style={styles.sectionTitle}>Calendar View</TextApp>
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            showHabitDots={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};
