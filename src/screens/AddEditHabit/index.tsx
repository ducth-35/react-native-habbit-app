import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../components/ThemeProvider';
import {HabitForm} from '../../components/HabitForm';
import {TextApp} from '../../components';
import {useHabitStore} from '../../store/useHabitStore';
import {CreateHabitData, UpdateHabitData, Habit} from '../../types/habit';
import {goBack} from '../../navigators/navigation-services';
import {StackScreenProps} from '../../navigators/screen-type';
import {APP_SCREEN} from '../../navigators/screen-type';

type Props = StackScreenProps<APP_SCREEN.ADD_EDIT_HABIT>;

export const AddEditHabitScreen: React.FC<Props> = ({route}) => {
  const {theme} = useTheme();
  const {actions} = useHabitStore();
  const habit = route?.params?.habit;
  const isEditing = !!habit;

  const handleSubmit = (data: CreateHabitData | UpdateHabitData) => {
    if (isEditing) {
      actions.updateHabit(data as UpdateHabitData);
    } else {
      actions.addHabit(data as CreateHabitData);
    }
    goBack();
  };

  const handleCancel = () => {
    goBack();
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
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
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
    content: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Icon name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TextApp preset="txt24Bold" style={styles.headerTitle}>
          {isEditing ? 'Edit Habit' : 'Create Habit'}
        </TextApp>
      </View>

      {/* Form */}
      <View style={styles.content}>
        <HabitForm
          habit={habit}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </View>
    </View>
  );
};
