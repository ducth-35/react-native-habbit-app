import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../ThemeProvider';
import {HabitFrequency} from '../../types/habit';
import TextApp from '../textApp';

export type HabitFilterType = 'all' | 'active' | 'inactive' | HabitFrequency;

interface HabitFilterProps {
  selectedFilter: HabitFilterType;
  onFilterChange: (filter: HabitFilterType) => void;
}

const filterOptions: {label: string; value: HabitFilterType}[] = [
  {label: 'All', value: 'all'},
  {label: 'Active', value: 'active'},
  {label: 'Inactive', value: 'inactive'},
  {label: 'Daily', value: HabitFrequency.DAILY},
  {label: 'Weekly', value: HabitFrequency.WEEKLY},
  {label: 'Custom', value: HabitFrequency.CUSTOM},
];

export const HabitFilter: React.FC<HabitFilterProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const {theme} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    filterOption: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterOptionSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    filterText: {
      color: theme.colors.text,
    },
    filterTextSelected: {
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      {filterOptions.map(option => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.filterOption,
            selectedFilter === option.value && styles.filterOptionSelected,
          ]}
          onPress={() => onFilterChange(option.value)}
          activeOpacity={0.7}>
          <TextApp
            preset="txt14SemiBold"
            style={[
              styles.filterText,
              selectedFilter === option.value && styles.filterTextSelected,
            ]}>
            {option.label}
          </TextApp>
        </TouchableOpacity>
      ))}
    </View>
  );
};
