import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Habit} from '../../types/habit';
import {useTheme} from '../ThemeProvider';
import {useHabitStore} from '../../store/useHabitStore';
import {DateHelpers} from '../../utils/dateHelpers';
import TextApp from '../textApp';

interface HabitCardProps {
  habit: Habit | undefined;
  date?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  showStats?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  date = DateHelpers.getTodayString(),
  onPress,
  onLongPress,
  showStats = false,
}) => {
  const {theme} = useTheme();
  const {actions} = useHabitStore();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const completion = actions.getHabitCompletionForDate(habit?.id ||'', date);
  const isCompleted = completion?.completed || false;
  const stats = showStats ? actions.getHabitStats(habit?.id || '') : null;

  const handleToggleCompletion = () => {
    // Animate the press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    actions.toggleHabitCompletion(habit?.id || '', date);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.xs,
      marginHorizontal: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      borderLeftWidth: 4,
      borderLeftColor: habit?.color,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: habit?.color + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
    },
    titleContainer: {
      flex: 1,
      marginRight: 5
    },
    title: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    description: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    checkButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: habit?.color,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkButtonCompleted: {
      backgroundColor: habit?.color,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
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
    frequencyBadge: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      marginTop: theme.spacing.xs,
      alignSelf:'flex-start'
    },
    frequencyText: {
      fontSize: theme.fontSize.xs,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
  });

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name={habit?.icon || 'help'} size={20} color={habit?.color} />
          </View>

          <View style={styles.titleContainer}>
            <TextApp preset="txt16SemiBold" style={styles.title}>{habit?.title}</TextApp>
            {habit?.description && (
              <TextApp preset="txt14SemiBold" style={styles.description} numberOfLines={1}>
                {habit?.description}
              </TextApp>
            )}
            <View style={styles.frequencyBadge}>
              <TextApp preset="txt12Regular" style={styles.frequencyText}>{habit?.frequency}</TextApp>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.checkButton,
              isCompleted && styles.checkButtonCompleted,
            ]}
            onPress={handleToggleCompletion}
            activeOpacity={0.7}>
            {isCompleted && (
              <Icon name="check" size={20} color={theme.colors.card} />
            )}
          </TouchableOpacity>
        </View>

        {showStats && stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <TextApp preset="txt16SemiBold" style={styles.statValue}>{stats.currentStreak}</TextApp>
              <TextApp preset="txt12Regular" style={styles.statLabel}>Current Streak</TextApp>
            </View>
            <View style={styles.statItem}>
              <TextApp preset="txt16SemiBold" style={styles.statValue}>{stats.longestStreak}</TextApp>
              <TextApp preset="txt12Regular" style={styles.statLabel}>Best Streak</TextApp>
            </View>
            <View style={styles.statItem}>
              <TextApp preset="txt16SemiBold" style={styles.statValue}>
                {Math.round(stats.completionRate)}%
              </TextApp>
              <TextApp preset="txt12Regular" style={styles.statLabel}>Success Rate</TextApp>
            </View>
            <View style={styles.statItem}>
              <TextApp preset="txt16SemiBold" style={styles.statValue}>
                {stats.completedDays}/{stats.totalDays}
              </TextApp>
              <TextApp preset="txt12Regular" style={styles.statLabel}>Completed</TextApp>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
