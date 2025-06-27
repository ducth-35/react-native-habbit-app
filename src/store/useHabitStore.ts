import {create} from 'zustand';
import {
  Habit,
  HabitCompletion,
  HabitStats,
  CreateHabitData,
  UpdateHabitData,
  HabitFrequency,
} from '../types/habit';
import {HabitStorage} from '../utils/storage';
import {DateHelpers} from '../utils/dateHelpers';
import {createSampleHabits, shouldCreateSampleData} from '../utils/sampleData';

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  isLoading: boolean;
  actions: {
    // Habit CRUD operations
    addHabit: (data: CreateHabitData) => void;
    updateHabit: (data: UpdateHabitData) => void;
    deleteHabit: (habitId: string) => void;
    toggleHabitActive: (habitId: string) => void;
    
    // Completion operations
    toggleHabitCompletion: (habitId: string, date: string) => void;
    markHabitCompleted: (habitId: string, date: string) => void;
    markHabitIncomplete: (habitId: string, date: string) => void;
    
    // Data operations
    loadData: () => void;
    saveData: () => void;
    
    // Utility functions
    getHabitById: (habitId: string) => Habit | undefined;
    getHabitCompletions: (habitId: string) => HabitCompletion[];
    getHabitCompletionForDate: (habitId: string, date: string) => HabitCompletion | undefined;
    getHabitStats: (habitId: string) => HabitStats;
    getTodayHabits: () => Habit[];
    getHabitsForDate: (date: string) => Habit[];
  };
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  completions: [],
  isLoading: false,

  actions: {
    addHabit: (data: CreateHabitData) => {
      const newHabit: Habit = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        isActive: true,
      };

      set(state => ({
        habits: [...state.habits, newHabit],
      }));

      get().actions.saveData();
    },

    updateHabit: (data: UpdateHabitData) => {
      set(state => ({
        habits: state.habits.map(habit =>
          habit.id === data.id ? {...habit, ...data} : habit
        ),
      }));

      get().actions.saveData();
    },

    deleteHabit: (habitId: string) => {
      set(state => ({
        habits: state.habits.filter(habit => habit.id !== habitId),
        completions: state.completions.filter(completion => completion.habitId !== habitId),
      }));

      get().actions.saveData();
    },

    toggleHabitActive: (habitId: string) => {
      set(state => ({
        habits: state.habits.map(habit =>
          habit.id === habitId ? {...habit, isActive: !habit.isActive} : habit
        ),
      }));

      get().actions.saveData();
    },

    toggleHabitCompletion: (habitId: string, date: string) => {
      const existingCompletion = get().actions.getHabitCompletionForDate(habitId, date);
      
      if (existingCompletion) {
        if (existingCompletion.completed) {
          get().actions.markHabitIncomplete(habitId, date);
        } else {
          get().actions.markHabitCompleted(habitId, date);
        }
      } else {
        get().actions.markHabitCompleted(habitId, date);
      }
    },

    markHabitCompleted: (habitId: string, date: string) => {
      const existingCompletion = get().actions.getHabitCompletionForDate(habitId, date);
      
      if (existingCompletion) {
        set(state => ({
          completions: state.completions.map(completion =>
            completion.habitId === habitId && completion.date === date
              ? {...completion, completed: true, completedAt: new Date().toISOString()}
              : completion
          ),
        }));
      } else {
        const newCompletion: HabitCompletion = {
          habitId,
          date,
          completed: true,
          completedAt: new Date().toISOString(),
        };

        set(state => ({
          completions: [...state.completions, newCompletion],
        }));
      }

      get().actions.saveData();
    },

    markHabitIncomplete: (habitId: string, date: string) => {
      set(state => ({
        completions: state.completions.map(completion =>
          completion.habitId === habitId && completion.date === date
            ? {...completion, completed: false, completedAt: undefined}
            : completion
        ),
      }));

      get().actions.saveData();
    },

    loadData: () => {
      set({isLoading: true});

      try {
        let habits = HabitStorage.getHabits() || [];
        const completions = HabitStorage.getHabitCompletions() || [];

        // Create sample data if no habits exist
        if (shouldCreateSampleData(habits)) {
          habits = createSampleHabits();
          HabitStorage.saveHabits(habits);
        }

        set({
          habits,
          completions,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading habit data:', error);
        set({isLoading: false});
      }
    },

    saveData: () => {
      const {habits, completions} = get();
      HabitStorage.saveHabits(habits);
      HabitStorage.saveHabitCompletions(completions);
    },

    getHabitById: (habitId: string) => {
      return get().habits.find(habit => habit.id === habitId);
    },

    getHabitCompletions: (habitId: string) => {
      return get().completions.filter(completion => completion.habitId === habitId);
    },

    getHabitCompletionForDate: (habitId: string, date: string) => {
      return get().completions.find(
        completion => completion.habitId === habitId && completion.date === date
      );
    },

    getHabitStats: (habitId: string): HabitStats => {
      const habit = get().actions.getHabitById(habitId);
      const completions = get().actions.getHabitCompletions(habitId);
      
      if (!habit) {
        return {
          habitId,
          totalDays: 0,
          completedDays: 0,
          currentStreak: 0,
          longestStreak: 0,
          completionRate: 0,
        };
      }

      const createdDate = DateHelpers.getDateString(new Date(habit.createdAt));
      const today = DateHelpers.getTodayString();
      const totalDays = DateHelpers.getDaysBetween(createdDate, today) + 1;
      
      const completedDays = completions.filter(c => c.completed).length;
      const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const sortedCompletions = completions
        .filter(c => c.completed)
        .sort((a, b) => a.date.localeCompare(b.date));

      for (let i = 0; i < sortedCompletions.length; i++) {
        const current = sortedCompletions[i];
        const previous = sortedCompletions[i - 1];
        
        if (i === 0 || DateHelpers.getDaysBetween(previous.date, current.date) === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      
      // Calculate current streak (from today backwards)
      let checkDate = today;
      while (true) {
        const completion = get().actions.getHabitCompletionForDate(habitId, checkDate);
        if (completion && completion.completed) {
          currentStreak++;
          checkDate = DateHelpers.subtractDays(checkDate, 1);
        } else {
          break;
        }
      }

      return {
        habitId,
        totalDays,
        completedDays,
        currentStreak,
        longestStreak,
        completionRate,
      };
    },

    getTodayHabits: () => {
      const today = DateHelpers.getTodayString();
      return get().actions.getHabitsForDate(today);
    },

    getHabitsForDate: (date: string) => {
      const dayOfWeek = DateHelpers.getDayOfWeek(date);
      
      return get().habits.filter(habit => {
        if (!habit.isActive) return false;
        
        switch (habit.frequency) {
          case HabitFrequency.DAILY:
            return true;
          case HabitFrequency.WEEKLY:
            return habit.targetDays.includes(dayOfWeek);
          case HabitFrequency.CUSTOM:
            return habit.targetDays.includes(dayOfWeek);
          default:
            return false;
        }
      });
    },
  },
}));
