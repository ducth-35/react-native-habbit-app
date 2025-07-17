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
  PREMIUM_STORE = 'PREMIUM_STORE_SCREEN',
  PREMIUM_FEATURES = 'PREMIUM_FEATURES_SCREEN',
  PRIVACY_POLICY = 'PRIVACY_POLICY_SCREEN',
  ADVANCED_STATISTICS = 'ADVANCED_STATISTICS_SCREEN',
}

export type RootStackParamList = {
  [APP_SCREEN.MAIN_TABS]: undefined;
  [APP_SCREEN.HABIT_LIST]: undefined;
  [APP_SCREEN.CALENDAR]: undefined;
  [APP_SCREEN.ADD_EDIT_HABIT]: {habit?: Habit} | undefined;
  [APP_SCREEN.HABIT_DETAIL]: {habitId: string};
  [APP_SCREEN.ALL_HABITS]: undefined;
  [APP_SCREEN.PREMIUM_STORE]: undefined;
  [APP_SCREEN.PREMIUM_FEATURES]: undefined;
  [APP_SCREEN.PRIVACY_POLICY]: undefined;
  [APP_SCREEN.ADVANCED_STATISTICS]: undefined;
};

export type StackScreenProps<T extends keyof RootStackParamList> =
  RNStackScreenProps<RootStackParamList, T>;
