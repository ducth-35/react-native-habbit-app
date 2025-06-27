import React from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../ThemeProvider';
import {DateHelpers} from '../../utils/dateHelpers';
import TextApp from '../textApp';

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onCalendarPress?: () => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  onCalendarPress,
}) => {
  const {theme} = useTheme();

  // Generate 7 days around selected date
  const getDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = DateHelpers.addDays(selectedDate, i);
      dates.push({
        date,
        dayName: DateHelpers.parseDate(date).toLocaleDateString('en', {
          weekday: 'short',
        }),
        dayNumber: DateHelpers.parseDate(date).getDate(),
        isToday: DateHelpers.isToday(date),
        isSelected: date === selectedDate,
      });
    }
    return dates;
  };

  const dates = getDates();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    monthText: {
      color: theme.colors.text,
    },
    calendarButton: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    datesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dateItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      marginHorizontal: 2,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: 'transparent',
    },
    dateItemSelected: {
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    dateItemToday: {
      backgroundColor: theme.colors.secondary + '20',
      borderWidth: 2,
      borderColor: theme.colors.secondary,
    },
    dayName: {
      marginBottom: theme.spacing.xs,
      opacity: 0.8,
    },
    dayNameSelected: {
      color: '#FFFFFF',
      opacity: 1,
    },
    dayNumber: {
      fontWeight: '600',
    },
    dayNumberSelected: {
      color: '#FFFFFF',
    },
    dayNumberToday: {
      color: theme.colors.secondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextApp preset="txt16SemiBold" style={styles.monthText}>
          {DateHelpers.parseDate(selectedDate).toLocaleDateString('en', {
            month: 'long',
            year: 'numeric',
          })}
        </TextApp>
        
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={onCalendarPress}
          activeOpacity={0.7}>
          <Icon name="calendar-today" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.datesContainer}>
        {dates.map(dateInfo => (
          <TouchableOpacity
            key={dateInfo.date}
            style={[
              styles.dateItem,
              dateInfo.isSelected && styles.dateItemSelected,
              dateInfo.isToday && !dateInfo.isSelected && styles.dateItemToday,
            ]}
            onPress={() => onDateSelect(dateInfo.date)}
            activeOpacity={0.7}>
            <TextApp
              preset="txt12Regular"
              style={[
                styles.dayName,
                dateInfo.isSelected && styles.dayNameSelected,
              ]}>
              {dateInfo.dayName}
            </TextApp>
            <TextApp
              preset="txt16SemiBold"
              style={[
                styles.dayNumber,
                dateInfo.isSelected && styles.dayNumberSelected,
                dateInfo.isToday && !dateInfo.isSelected && styles.dayNumberToday,
              ]}>
              {dateInfo.dayNumber}
            </TextApp>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
