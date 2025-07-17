import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeProvider, useTheme } from '../components/ThemeProvider';
import { AddEditHabitScreen } from '../screens/AddEditHabit';
import { AllHabitsScreen } from '../screens/AllHabits';
import { CalendarScreen } from '../screens/Calendar';
import { HabitDetailScreen } from '../screens/HabitDetail';
import { HabitListScreen } from '../screens/HabitList';
import { PremiumStoreScreen } from '../screens/PremiumStore';
import { PremiumFeaturesScreen } from '../screens/PremiumFeatures';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicy';
import { AdvancedStatisticsScreen } from '../screens/AdvancedStatistics';
import { navigationRef } from './navigation-services';
import { APP_SCREEN, RootStackParamList } from './screen-type';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  const {theme} = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size}) => {
          let iconName: string;

          if (route.name === 'HabitsTab') {
            iconName = 'track-changes';
          } else if (route.name === 'CalendarTab') {
            iconName = 'calendar-today';
          } else {
            iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
      })}>
      <Tab.Screen
        name="HabitsTab"
        component={HabitListScreen}
        options={{
          tabBarLabel: 'Habits',
        }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendar',
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={APP_SCREEN.MAIN_TABS} component={TabNavigator} />
      <Stack.Screen
        name={APP_SCREEN.ADD_EDIT_HABIT}
        component={AddEditHabitScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={APP_SCREEN.HABIT_DETAIL}
        component={HabitDetailScreen}
      />
      <Stack.Screen
        name={APP_SCREEN.ALL_HABITS}
        component={AllHabitsScreen}
      />
      <Stack.Screen
        name={APP_SCREEN.PREMIUM_STORE}
        component={PremiumStoreScreen}
        options={{
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name={APP_SCREEN.PREMIUM_FEATURES}
        component={PremiumFeaturesScreen}
      />
      <Stack.Screen
        name={APP_SCREEN.PRIVACY_POLICY}
        component={PrivacyPolicyScreen}
      />
      <Stack.Screen
        name={APP_SCREEN.ADVANCED_STATISTICS}
        component={AdvancedStatisticsScreen}
      />
    </Stack.Navigator>
  );
};

export const Navigations: React.FC = () => {
  return (
    <ThemeProvider>
      <NavigationContainer ref={navigationRef}>
        <MainNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
};
