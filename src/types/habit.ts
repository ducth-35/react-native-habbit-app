export interface Habit {
  id: string;
  title: string;
  description?: string;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  targetDays: number[]; // Days of week (0-6, Sunday-Saturday) for weekly habits
  createdAt: string;
  isActive: boolean;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  completedAt?: string; // ISO string
}

export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export interface HabitStats {
  habitId: string;
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number; // percentage
}

export interface CreateHabitData {
  title: string;
  description?: string;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  targetDays: number[];
}

export interface UpdateHabitData extends Partial<CreateHabitData> {
  id: string;
  isActive?: boolean;
}

// Predefined colors for habits
export const HABIT_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Light Yellow
  '#BB8FCE', // Light Purple
  '#85C1E9', // Light Blue
];

// Predefined icons for habits (MaterialIcons names)
export const HABIT_ICONS = [
  'fitness-center',
  'menu-book',
  'local-drink',
  'self-improvement',
  'music-note',
  'camera-alt',
  'favorite',
  'star',
  'eco',
  'wb-sunny',
  'nightlight-round',
  'local-cafe',
  'apple',
  'directions-bike',
  'directions-run',
];
