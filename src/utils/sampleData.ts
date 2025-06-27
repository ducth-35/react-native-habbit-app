import {Habit, HabitFrequency, HABIT_COLORS, HABIT_ICONS} from '../types/habit';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createSampleHabits = (): Habit[] => {
  const now = new Date();
  const createdAt = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days ago

  return [
    {
      id: generateId(),
      title: 'Drink Water',
      description: 'Drink at least 8 glasses of water daily',
      color: HABIT_COLORS[1], // Teal
      icon: 'local-drink',
      frequency: HabitFrequency.DAILY,
      targetDays: [0, 1, 2, 3, 4, 5, 6], // All days
      createdAt,
      isActive: true,
    },
    {
      id: generateId(),
      title: 'Morning Exercise',
      description: 'Do 30 minutes of exercise every morning',
      color: HABIT_COLORS[2], // Blue
      icon: 'fitness-center',
      frequency: HabitFrequency.DAILY,
      targetDays: [0, 1, 2, 3, 4, 5, 6], // All days
      createdAt,
      isActive: true,
    },
    {
      id: generateId(),
      title: 'Read Books',
      description: 'Read for at least 30 minutes',
      color: HABIT_COLORS[3], // Green
      icon: 'menu-book',
      frequency: HabitFrequency.DAILY,
      targetDays: [0, 1, 2, 3, 4, 5, 6], // All days
      createdAt,
      isActive: true,
    },
    {
      id: generateId(),
      title: 'Meditation',
      description: 'Practice mindfulness meditation',
      color: HABIT_COLORS[5], // Plum
      icon: 'self-improvement',
      frequency: HabitFrequency.WEEKLY,
      targetDays: [1, 3, 5], // Monday, Wednesday, Friday
      createdAt,
      isActive: true,
    },
    {
      id: generateId(),
      title: 'Learn Guitar',
      description: 'Practice guitar for 45 minutes',
      color: HABIT_COLORS[7], // Light Yellow
      icon: 'music-note',
      frequency: HabitFrequency.WEEKLY,
      targetDays: [2, 4, 6], // Tuesday, Thursday, Saturday
      createdAt,
      isActive: true,
    },
    {
      id: generateId(),
      title: 'Healthy Eating',
      description: 'Eat at least 5 servings of fruits and vegetables',
      color: HABIT_COLORS[3], // Green
      icon: 'apple',
      frequency: HabitFrequency.DAILY,
      targetDays: [0, 1, 2, 3, 4, 5, 6], // All days
      createdAt,
      isActive: true,
    },
  ];
};

export const shouldCreateSampleData = (existingHabits: Habit[]): boolean => {
  return existingHabits.length === 0;
};
