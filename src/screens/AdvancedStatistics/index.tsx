import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../components/ThemeProvider';
import { TextApp } from '../../components';
import { goBack } from '../../navigators/navigation-services';
import { useHabitStore } from '../../store/useHabitStore';
import { usePremiumFeatureStore } from '../../store/usePremiumThemeStore';
import { usePremiumStore } from '../../store/usePremiumStore';

const { width } = Dimensions.get('window');

export const AdvancedStatisticsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { habits, actions } = useHabitStore();
  const { isAdvancedStatsActive } = usePremiumFeatureStore();
  const { coins, actions: coinActions } = usePremiumStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [hasAccess, setHasAccess] = useState(false);

  // Check and charge coins when screen loads
  useEffect(() => {
    const checkAccess = () => {
      if (coins.amount >= 2) {
        Alert.alert(
          'View Advanced Statistics',
          'Viewing Advanced Statistics costs 2 coins. Continue?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => goBack(),
            },
            {
              text: 'Pay 2 Coins',
              onPress: () => {
                const success = coinActions.spendCoins(2);
                if (success) {
                  setHasAccess(true);
                } else {
                  Alert.alert('Error', 'Failed to process payment');
                  goBack();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Insufficient Coins',
          `You need 2 coins to view Advanced Statistics. You have ${coins.amount} coins.`,
          [
            {
              text: 'OK',
              onPress: () => goBack(),
            },
          ]
        );
      }
    };

    checkAccess();
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    if (!habits || habits.length === 0) {
      return [];
    }

    const now = new Date();
    const daysToCheck = selectedPeriod === 'week' ? 7 : 30;

    const stats = habits.map(habit => {
      let completedDays = 0;
      let totalDays = daysToCheck;

      for (let i = 0; i < daysToCheck; i++) {
        const checkDate = new Date(now);
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];

        // Check if habit was completed on this date using habit store
        const completion = actions.getHabitCompletionForDate(habit.id, dateStr);
        if (completion && completion.completed) {
          completedDays++;
        }
      }

      // Get completed dates for streak calculation
      const completions = actions.getHabitCompletions(habit.id);
      const completedDates = completions
        .filter(c => c.completed)
        .map(c => c.date);

      return {
        name: habit.title,
        completedDays,
        totalDays,
        percentage: Math.round((completedDays / totalDays) * 100),
        streak: calculateStreak(completedDates),
      };
    });
    
    return stats;
  };

  const calculateStreak = (completedDates: string[]) => {
    if (!completedDates || completedDates.length === 0) return 0;

    const sortedDates = completedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Check if today or yesterday is completed
    if (!sortedDates.includes(today) && !sortedDates.includes(yesterdayStr)) {
      return 0;
    }

    let streak = 0;
    const currentDate = new Date();

    for (let i = 0; i < 365; i++) { // Max 365 days check
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (sortedDates.includes(dateStr)) {
        streak++;
      } else if (i === 0 && dateStr === today) {
        // Today not completed, check yesterday
        continue;
      } else {
        break;
      }
    }

    return streak;
  };

  const stats = calculateStats();
  const totalHabits = habits ? habits.length : 0;
  const avgCompletion = totalHabits > 0 && stats.length > 0 ? Math.round(stats.reduce((sum, stat) => sum + stat.percentage, 0) / totalHabits) : 0;
  const bestHabit = stats.length > 0 ? stats.reduce((best, current) => current.percentage > best.percentage ? current : best, stats[0]) : { name: 'None', percentage: 0 };
  const longestStreak = stats.length > 0 ? Math.max(...stats.map(s => s.streak), 0) : 0;

  const renderProgressBar = (percentage: number, color: string = theme.colors.primary) => (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${percentage}%`, 
              backgroundColor: color 
            }
          ]} 
        />
      </View>
      <TextApp style={styles.percentageText}>{percentage}%</TextApp>
    </View>
  );

  const renderHabitCard = (stat: any, index: number) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336'];
    const color = colors[index % colors.length];
    
    return (
      <View key={stat.name} style={styles.habitCard}>
        <View style={styles.habitHeader}>
          <TextApp preset="txt16Bold" style={styles.habitName}>{stat.name}</TextApp>
          <View style={styles.streakBadge}>
            <Icon name="local-fire-department" size={16} color="#FF5722" />
            <TextApp style={styles.streakText}>{stat.streak}</TextApp>
          </View>
        </View>
        
        {renderProgressBar(stat.percentage, color)}
        
        <View style={styles.habitStats}>
          <TextApp style={styles.statText}>
            {stat.completedDays}/{stat.totalDays} days completed
          </TextApp>
          <TextApp style={styles.statText}>
            {selectedPeriod === 'week' ? 'This week' : 'This month'}
          </TextApp>
        </View>
      </View>
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
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      color: theme.colors.text,
      marginLeft: 16,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 4,
      marginBottom: 20,
    },
    periodButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      borderRadius: 8,
    },
    activePeriodButton: {
      backgroundColor: theme.colors.primary,
    },
    periodButtonText: {
      color: theme.colors.text,
    },
    activePeriodButtonText: {
      color: '#FFFFFF',
    },
    overviewCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    overviewTitle: {
      color: theme.colors.text,
      marginBottom: 16,
    },
    overviewGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    overviewItem: {
      width: '48%',
      marginBottom: 12,
    },
    overviewValue: {
      color: theme.colors.primary,
      marginBottom: 4,
    },
    overviewLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    sectionTitle: {
      color: theme.colors.text,
      marginBottom: 16,
    },
    habitCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    habitHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    habitName: {
      color: theme.colors.text,
      flex: 1,
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    streakText: {
      color: '#FF5722',
      marginLeft: 4,
      fontSize: 12,
      fontWeight: '600',
    },
    progressBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    progressBar: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    percentageText: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: '600',
      minWidth: 35,
    },
    habitStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    statText: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    lockedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    lockedIcon: {
      marginBottom: 16,
    },
    lockedTitle: {
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    lockedDescription: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    emptyState: {
      alignItems: 'center',
      padding: 40,
    },
    emptyTitle: {
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyDescription: {
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  if (!hasAccess) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
            <TextApp preset="txt18Bold" style={styles.headerTitle}>
              Advanced Statistics
            </TextApp>
          </TouchableOpacity>
        </View>

        <View style={styles.lockedContainer}>
          <Icon name="payment" size={64} color={theme.colors.primary} style={styles.lockedIcon} />
          <TextApp preset="txt18Bold" style={styles.lockedTitle}>
            Processing Payment...
          </TextApp>
          <TextApp style={styles.lockedDescription}>
            Please confirm your payment to view Advanced Statistics.
          </TextApp>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
          <TextApp preset="txt18Bold" style={styles.headerTitle}>
            Advanced Statistics
          </TextApp>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'week' && styles.activePeriodButton]}
            onPress={() => setSelectedPeriod('week')}
          >
            <TextApp style={[styles.periodButtonText, selectedPeriod === 'week' && styles.activePeriodButtonText]}>
              This Week
            </TextApp>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === 'month' && styles.activePeriodButton]}
            onPress={() => setSelectedPeriod('month')}
          >
            <TextApp style={[styles.periodButtonText, selectedPeriod === 'month' && styles.activePeriodButtonText]}>
              This Month
            </TextApp>
          </TouchableOpacity>
        </View>

        {/* Overview */}
        <View style={styles.overviewCard}>
          <TextApp preset="txt16Bold" style={styles.overviewTitle}>
            Overview
          </TextApp>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <TextApp preset="txt18Bold" style={styles.overviewValue}>
                {avgCompletion}%
              </TextApp>
              <TextApp style={styles.overviewLabel}>Average Completion</TextApp>
            </View>
            <View style={styles.overviewItem}>
              <TextApp preset="txt18Bold" style={styles.overviewValue}>
                {totalHabits}
              </TextApp>
              <TextApp style={styles.overviewLabel}>Total Habits</TextApp>
            </View>
            <View style={styles.overviewItem}>
              <TextApp preset="txt18Bold" style={styles.overviewValue}>
                {bestHabit.name}
              </TextApp>
              <TextApp style={styles.overviewLabel}>Best Performing</TextApp>
            </View>
            <View style={styles.overviewItem}>
              <TextApp preset="txt18Bold" style={styles.overviewValue}>
                {longestStreak}
              </TextApp>
              <TextApp style={styles.overviewLabel}>Longest Streak</TextApp>
            </View>
          </View>
        </View>

        {/* Habit Details */}
        <TextApp preset="txt16Bold" style={styles.sectionTitle}>
          Habit Performance
        </TextApp>
        {stats.length > 0 ? (
          stats.map((stat, index) => renderHabitCard(stat, index))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="analytics" size={64} color={theme.colors.textSecondary} />
            <TextApp preset="txt16Bold" style={styles.emptyTitle}>
              No Habit Data
            </TextApp>
            <TextApp style={styles.emptyDescription}>
              Start tracking habits to see your analytics here.
            </TextApp>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
