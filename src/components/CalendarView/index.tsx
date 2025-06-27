import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../ThemeProvider';
import {useHabitStore} from '../../store/useHabitStore';
import {DateHelpers} from '../../utils/dateHelpers';
import TextApp from '../textApp';

interface CalendarViewProps {
  selectedDate?: string;
  onDateSelect?: (date: string) => void;
  showHabitDots?: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate = DateHelpers.getTodayString(),
  onDateSelect,
  showHabitDots = true,
}) => {
  const {theme} = useTheme();
  const {habits, actions} = useHabitStore();
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const calendarData = DateHelpers.getCalendarMonth(currentMonth);
  const today = DateHelpers.getTodayString();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' 
      ? DateHelpers.subtractDays(DateHelpers.getMonthStart(currentMonth), 1)
      : DateHelpers.addDays(DateHelpers.getMonthEnd(currentMonth), 1);
    setCurrentMonth(newMonth);
  };

  const getHabitCompletionsForDate = (date: string) => {
    const habitsForDate = actions.getHabitsForDate(date);
    const completions = habitsForDate.map(habit => {
      const completion = actions.getHabitCompletionForDate(habit.id, date);
      return {
        habit,
        completed: completion?.completed || false,
      };
    });
    return completions;
  };

  const renderDay = (date: string, isCurrentMonth: boolean) => {
    const isSelected = date === selectedDate;
    const isToday = date === today;
    const dayNumber = parseInt(date.split('-')[2], 10);
    
    const completions = showHabitDots ? getHabitCompletionsForDate(date) : [];
    const completedCount = completions.filter(c => c.completed).length;
    const totalCount = completions.length;

    const styles = StyleSheet.create({
      dayContainer: {
        flex: 1,
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 1,
        borderRadius: theme.borderRadius.sm,
        backgroundColor: isSelected 
          ? theme.colors.primary 
          : isToday 
          ? theme.colors.primary + '20'
          : 'transparent',
      },
      dayText: {
        fontSize: theme.fontSize.sm,
        fontWeight: isToday ? '600' : '400',
        color: isSelected 
          ? '#FFFFFF'
          : isCurrentMonth 
          ? theme.colors.text 
          : theme.colors.disabled,
      },
      dotsContainer: {
        flexDirection: 'row',
        marginTop: 2,
        height: 4,
      },
      dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 1,
      },
    });

    return (
      <TouchableOpacity
        key={date}
        style={styles.dayContainer}
        onPress={() => onDateSelect?.(date)}
        disabled={!isCurrentMonth}>
        <TextApp preset="txt14SemiBold" style={styles.dayText}>{dayNumber}</TextApp>
        {showHabitDots && totalCount > 0 && (
          <View style={styles.dotsContainer}>
            {completions.slice(0, 3).map((completion, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: completion.completed
                      ? completion.habit.color
                      : theme.colors.disabled,
                  },
                ]}
              />
            ))}
            {totalCount > 3 && (
              <TextApp style={{
                fontSize: 8,
                color: theme.colors.textSecondary,
                marginLeft: 2,
              }}>
                +{totalCount - 3}
              </TextApp>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const containerStyles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      margin: theme.spacing.md,
      padding: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    monthText: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    weekDaysContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.sm,
    },
    weekDay: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    weekDayText: {
      fontSize: theme.fontSize.xs,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    weeksContainer: {
      gap: 2,
    },
    week: {
      flexDirection: 'row',
    },
  });

  return (
    <View style={containerStyles.container}>
      {/* Header */}
      <View style={containerStyles.header}>
        <TouchableOpacity
          style={containerStyles.navButton}
          onPress={() => navigateMonth('prev')}>
          <Icon name="chevron-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <TextApp preset="txt18Bold" style={containerStyles.monthText}>
          {calendarData.monthName}
        </TextApp>

        <TouchableOpacity
          style={containerStyles.navButton}
          onPress={() => navigateMonth('next')}>
          <Icon name="chevron-right" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Week days */}
      <View style={containerStyles.weekDaysContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <View key={day} style={containerStyles.weekDay}>
            <TextApp preset="txt12Bold" style={containerStyles.weekDayText}>{day}</TextApp>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={containerStyles.weeksContainer}>
        {calendarData.weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={containerStyles.week}>
            {week.map(date => {
              const isCurrentMonth = date >= calendarData.startOfMonth && 
                                   date <= calendarData.endOfMonth;
              return renderDay(date, isCurrentMonth);
            })}
          </View>
        ))}
      </View>
    </View>
  );
};
