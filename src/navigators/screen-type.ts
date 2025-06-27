import {NativeStackScreenProps as RNStackScreenProps} from '@react-navigation/native-stack';
import {Habit} from '../types/habit';

export enum APP_SCREEN {
  // Main navigation
  MAIN_TABS = 'MainTabs',

  // Main tabs
  HABIT_LIST = 'HABIT_LIST_SCREEN',
  CALENDAR = 'CALENDAR_SCREEN',

  // Modal screens
  ADD_EDIT_HABIT = 'ADD_EDIT_HABIT_SCREEN',
  HABIT_DETAIL = 'HABIT_DETAIL_SCREEN',
  ALL_HABITS = 'ALL_HABITS_SCREEN',
}

export type RootStackParamList = {
  [APP_SCREEN.MAIN_TABS]: undefined;
  [APP_SCREEN.HABIT_LIST]: undefined;
  [APP_SCREEN.CALENDAR]: undefined;
  [APP_SCREEN.ADD_EDIT_HABIT]: {habit?: Habit} | undefined;
  [APP_SCREEN.HABIT_DETAIL]: {habitId: string};
  [APP_SCREEN.ALL_HABITS]: undefined;
};

export type StackScreenProps<T extends keyof RootStackParamList> =
  RNStackScreenProps<RootStackParamList, T>;
