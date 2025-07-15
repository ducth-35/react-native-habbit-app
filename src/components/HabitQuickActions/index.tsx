import React from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../ThemeProvider';
import {Habit} from '../../types/habit';
import {useHabitStore} from '../../store/useHabitStore';
import {navigate} from '../../navigators/navigation-services';
import {APP_SCREEN} from '../../navigators/screen-type';
import TextApp from '../textApp';

interface HabitQuickActionsProps {
  habit: Habit;
  onClose?: () => void;
}

export const HabitQuickActions: React.FC<HabitQuickActionsProps> = ({
  habit,
  onClose,
}) => {
  const {theme} = useTheme();
  const {actions} = useHabitStore();

  const handleEdit = () => {
    navigate(APP_SCREEN.ADD_EDIT_HABIT, {habit});
    onClose?.();
  };

  const handleViewDetails = () => {
    navigate(APP_SCREEN.HABIT_DETAIL, {habitId: habit.id});
    onClose?.();
  };

  const handleToggleActive = () => {
    actions.toggleHabitActive(habit.id);
    onClose?.();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.title}"? This action cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            actions.deleteHabit(habit.id);
            onClose?.();
          },
        },
      ]
    );
  };

  const actionItems = [
    {
      icon: 'visibility',
      label: 'View Details',
      onPress: handleViewDetails,
      color: theme.colors.primary,
    },
    {
      icon: 'edit',
      label: 'Edit',
      onPress: handleEdit,
      color: theme.colors.primary,
    },
    {
      icon: habit.isActive ? 'pause' : 'play-arrow',
      label: habit.isActive ? 'Deactivate' : 'Activate',
      onPress: handleToggleActive,
      color: habit.isActive ? theme.colors.warning : theme.colors.success,
    },
    {
      icon: 'delete',
      label: 'Delete',
      onPress: handleDelete,
      color: theme.colors.error,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      margin: theme.spacing.md,
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
      alignItems: 'center',
      marginBottom: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    habitIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: habit.color + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.sm,
    },
    habitInfo: {
      flex: 1,
    },
    habitTitle: {
      marginBottom: 2,
    },
    habitDescription: {
      opacity: 0.7,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    actionItem: {
      flex: 1,
      minWidth: '45%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    actionIcon: {
      marginRight: theme.spacing.sm,
    },
    actionLabel: {
      flex: 1,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.habitIcon}>
          <Icon name={habit.icon} size={20} color={habit.color} />
        </View>
        <View style={styles.habitInfo}>
          <TextApp preset="txt16SemiBold" style={styles.habitTitle}>
            {habit.title}
          </TextApp>
          {habit.description && (
            <TextApp preset="txt16Regular" style={styles.habitDescription}>
              {habit.description}
            </TextApp>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsGrid}>
        {actionItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={item.onPress}
            activeOpacity={0.7}>
            <Icon
              name={item.icon}
              size={20}
              color={item.color}
              style={styles.actionIcon}
            />
            <TextApp preset="txt14SemiBold" style={styles.actionLabel}>
              {item.label}
            </TextApp>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
