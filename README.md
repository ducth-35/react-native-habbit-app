# Habit Tracker - React Native App

A modern, beautiful habit tracking application built with React Native. Track your daily habits, view progress on a calendar, and build better routines with a clean, intuitive interface.

## Features

- ✅ **Add/Edit/Delete Habits** - Create custom habits with colors, icons, and frequencies
- 📅 **Calendar View** - Visual calendar showing habit completions with colored dots
- 🎯 **Daily Tracking** - Mark habits as complete/incomplete for each day
- 📊 **Statistics** - View streaks, completion rates, and progress analytics
- 🌙 **Dark/Light Theme** - Toggle between light and dark modes
- 💾 **Local Storage** - All data stored locally using MMKV (no backend required)
- 🎨 **Modern UI** - Clean, modern interface with smooth animations

## Technologies Used

- **React Native 0.77** - Mobile app framework
- **TypeScript** - Type safety and better development experience
- **Zustand** - Lightweight state management
- **MMKV** - Fast, efficient local storage
- **React Navigation** - Navigation with bottom tabs and stack navigation
- **React Native Vector Icons** - Beautiful icons throughout the app
- **React Native Calendars** - Calendar component for date selection
- **Moment.js** - Date manipulation and formatting

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-native-app-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

## App Structure

```
src/
├── components/           # Reusable UI components
│   ├── ThemeProvider/   # Theme context and provider
│   ├── ThemeToggle/     # Dark/light mode toggle
│   ├── HabitCard/       # Individual habit display card
│   ├── HabitForm/       # Form for creating/editing habits
│   ├── CalendarView/    # Calendar component with habit dots
│   ├── EmptyState/      # Empty state component
│   └── LoadingSpinner/  # Loading indicator
│
├── screens/             # App screens
│   ├── HabitList/       # Main habits list screen
│   ├── Calendar/        # Calendar view screen
│   ├── AddEditHabit/    # Add/edit habit modal
│   └── HabitDetail/     # Individual habit details
│
├── store/               # Zustand state management
│   ├── useHabitStore.ts # Habits and completions state
│   └── useThemeStore.ts # Theme state
│
├── types/               # TypeScript type definitions
│   ├── habit.ts         # Habit-related types
│   └── theme.ts         # Theme-related types
│
├── utils/               # Utility functions
│   ├── storage.ts       # MMKV storage wrapper
│   ├── dateHelpers.ts   # Date manipulation helpers
│   └── sampleData.ts    # Sample habit data
│
├── navigators/          # Navigation configuration
│   ├── index.tsx        # Main navigation setup
│   └── screen-type.ts   # Navigation type definitions
│
└── assets/              # Static assets
    ├── fonts/
    ├── icons/
    └── images/
```

## Key Features Explained

### Habit Management
- Create habits with custom titles, descriptions, colors, and icons
- Set frequency (Daily, Weekly, Custom days)
- Edit or delete existing habits
- Activate/deactivate habits without losing data

### Progress Tracking
- Mark habits as complete/incomplete for any date
- View completion status on calendar with colored dots
- Track streaks and completion rates
- Historical data preserved locally

### Calendar Integration
- Interactive calendar showing habit completions
- Navigate between months
- Tap dates to see habits for that day
- Visual indicators for habit completion status

### Statistics & Analytics
- Current streak tracking
- Longest streak records
- Overall completion percentage
- Total days completed vs. total days

### Theme Support
- Light and dark mode themes
- Consistent color scheme throughout app
- Theme preference saved locally
- Smooth theme transitions

## Data Storage

All data is stored locally using MMKV for optimal performance:
- **Habits**: Stored as JSON array with all habit configurations
- **Completions**: Stored as JSON array tracking daily completions
- **Theme**: User's theme preference
- **No Backend Required**: Completely offline functionality

## Sample Data

The app automatically creates sample habits on first launch:
- Drink Water (Daily)
- Morning Exercise (Daily)
- Read Books (Daily)
- Meditation (Weekly: Mon, Wed, Fri)
- Learn Guitar (Weekly: Tue, Thu, Sat)
- Healthy Eating (Daily)

## Customization

### Adding New Icons
Edit `src/types/habit.ts` and add MaterialIcons icon names to the `HABIT_ICONS` array.

### Adding New Colors
Edit `src/types/habit.ts` and add hex color codes to the `HABIT_COLORS` array.

### Modifying Themes
Edit `src/types/theme.ts` to customize the light and dark theme colors and spacing.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
