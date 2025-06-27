import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Habit,
  CreateHabitData,
  UpdateHabitData,
  HabitFrequency,
  HABIT_COLORS,
  HABIT_ICONS,
} from '../../types/habit';
import {useTheme} from '../ThemeProvider';
import TextApp from '../textApp';

interface HabitFormProps {
  habit?: Habit;
  onSubmit: (data: CreateHabitData | UpdateHabitData) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = [
  {label: 'Sun', value: 0},
  {label: 'Mon', value: 1},
  {label: 'Tue', value: 2},
  {label: 'Wed', value: 3},
  {label: 'Thu', value: 4},
  {label: 'Fri', value: 5},
  {label: 'Sat', value: 6},
];

export const HabitForm: React.FC<HabitFormProps> = ({
  habit,
  onSubmit,
  onCancel,
}) => {
  const {theme} = useTheme();
  const isEditing = !!habit;

  const [title, setTitle] = useState(habit?.title || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [selectedColor, setSelectedColor] = useState(
    habit?.color || HABIT_COLORS[0]
  );
  const [selectedIcon, setSelectedIcon] = useState(
    habit?.icon || HABIT_ICONS[0]
  );
  const [frequency, setFrequency] = useState(
    habit?.frequency || HabitFrequency.DAILY
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    habit?.targetDays || []
  );

  useEffect(() => {
    if (frequency === HabitFrequency.DAILY) {
      setSelectedDays([0, 1, 2, 3, 4, 5, 6]); // All days
    } else if (frequency === HabitFrequency.WEEKLY && selectedDays.length === 0) {
      setSelectedDays([1]); // Default to Monday
    }
  }, [frequency]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a habit title');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    const data = {
      title: title.trim(),
      description: description.trim(),
      color: selectedColor,
      icon: selectedIcon,
      frequency,
      targetDays: selectedDays,
    };

    if (isEditing) {
      onSubmit({...data, id: habit.id});
    } else {
      onSubmit(data);
    }
  };

  const toggleDay = (day: number) => {
    if (frequency === HabitFrequency.DAILY) return; // Can't change days for daily habits

    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day].sort();
      }
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: theme.fontSize.md,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    colorGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorOptionSelected: {
      borderColor: theme.colors.text,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    iconOption: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    iconOptionSelected: {
      borderColor: selectedColor,
      backgroundColor: selectedColor + '20',
    },
    frequencyOptions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    frequencyOption: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    frequencyOptionSelected: {
      borderColor: selectedColor,
      backgroundColor: selectedColor + '20',
    },
    frequencyText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
      textTransform: 'capitalize',
    },
    daysContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.xs,
    },
    dayOption: {
      flex: 1,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    dayOptionSelected: {
      borderColor: selectedColor,
      backgroundColor: selectedColor + '20',
    },
    dayOptionDisabled: {
      opacity: 0.5,
    },
    dayText: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    button: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    submitButton: {
      backgroundColor: selectedColor,
    },
    buttonText: {
      fontSize: theme.fontSize.md,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    submitButtonText: {
      color: '#FFFFFF',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.section}>
          <TextApp preset="txt18Bold" style={styles.sectionTitle}>Title</TextApp>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter habit title"
            placeholderTextColor={theme.colors.placeholder}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <TextApp preset="txt18Bold" style={styles.sectionTitle}>Description (Optional)</TextApp>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter habit description"
            placeholderTextColor={theme.colors.placeholder}
            multiline
          />
        </View>

        {/* Color */}
        <View style={styles.section}>
          <TextApp preset="txt18Bold" style={styles.sectionTitle}>Color</TextApp>
          <View style={styles.colorGrid}>
            {HABIT_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  {backgroundColor: color},
                  selectedColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        {/* Icon */}
        <View style={styles.section}>
          <TextApp preset="txt18Bold" style={styles.sectionTitle}>Icon</TextApp>
          <View style={styles.iconGrid}>
            {HABIT_ICONS.map(icon => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconOption,
                  selectedIcon === icon && styles.iconOptionSelected,
                ]}
                onPress={() => setSelectedIcon(icon)}>
                <Icon name={icon} size={24} color={selectedColor} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Frequency */}
        <View style={styles.section}>
          <TextApp preset="txt18Bold" style={styles.sectionTitle}>Frequency</TextApp>
          <View style={styles.frequencyOptions}>
            {Object.values(HabitFrequency).map(freq => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.frequencyOption,
                  frequency === freq && styles.frequencyOptionSelected,
                ]}
                onPress={() => setFrequency(freq)}>
                <TextApp preset="txt14SemiBold" style={styles.frequencyText}>{freq}</TextApp>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Days */}
        {frequency !== HabitFrequency.DAILY && (
          <View style={styles.section}>
            <TextApp preset="txt18Bold" style={styles.sectionTitle}>Days</TextApp>
            <View style={styles.daysContainer}>
              {DAYS_OF_WEEK.map(day => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayOption,
                    selectedDays.includes(day.value) && styles.dayOptionSelected,
                  ]}
                  onPress={() => toggleDay(day.value)}>
                  <TextApp preset="txt14SemiBold" style={styles.dayText}>{day.label}</TextApp>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
          <TextApp preset="txt16SemiBold" style={[styles.buttonText, styles.cancelButtonText]}>Cancel</TextApp>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
          <TextApp preset="txt16SemiBold" style={[styles.buttonText, styles.submitButtonText]}>
            {isEditing ? 'Update' : 'Create'}
          </TextApp>
        </TouchableOpacity>
      </View>
    </View>
  );
};
