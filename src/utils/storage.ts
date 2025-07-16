import {MMKV} from 'react-native-mmkv';

// Initialize MMKV storage
export const storage = new MMKV();

// Storage keys
export const STORAGE_KEYS = {
  HABITS: 'habits',
  HABIT_COMPLETIONS: 'habit_completions',
  THEME_MODE: 'theme_mode',
  USER_PREFERENCES: 'user_preferences',
} as const;

// Generic storage functions
export const StorageService = {
  // Set data
  set: <T>(key: string, value: T): void => {
    try {
      const jsonValue = JSON.stringify(value);
      storage.set(key, jsonValue);
    } catch (error) {
      console.log('Error saving data to storage:', error);
    }
  },

  // Get data
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    try {
      const jsonValue = storage.getString(key);
      if (jsonValue) {
        return JSON.parse(jsonValue) as T;
      }
      return defaultValue;
    } catch (error) {
      console.log('Error getting data from storage:', error);
      return defaultValue;
    }
  },

  // Remove data
  remove: (key: string): void => {
    try {
      storage.delete(key);
    } catch (error) {
      console.log('Error removing data from storage:', error);
    }
  },

  // Clear all data
  clear: (): void => {
    try {
      storage.clearAll();
    } catch (error) {
      console.log('Error clearing storage:', error);
    }
  },

  // Check if key exists
  has: (key: string): boolean => {
    return storage.contains(key);
  },

  // Get all keys
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },
};

// Specific storage functions for habits
export const HabitStorage = {
  saveHabits: (habits: any[]) => {
    StorageService.set(STORAGE_KEYS.HABITS, habits);
  },

  getHabits: () => {
    return StorageService.get(STORAGE_KEYS.HABITS, []);
  },

  saveHabitCompletions: (completions: any[]) => {
    StorageService.set(STORAGE_KEYS.HABIT_COMPLETIONS, completions);
  },

  getHabitCompletions: () => {
    return StorageService.get(STORAGE_KEYS.HABIT_COMPLETIONS, []);
  },
};

// Theme storage functions
export const ThemeStorage = {
  saveThemeMode: (mode: string) => {
    StorageService.set(STORAGE_KEYS.THEME_MODE, mode);
  },

  getThemeMode: () => {
    return StorageService.get(STORAGE_KEYS.THEME_MODE, 'light');
  },
};
