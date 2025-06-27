import {create} from 'zustand';
import {ThemeMode, Theme, lightTheme, darkTheme} from '../types/theme';
import {ThemeStorage} from '../utils/storage';

interface ThemeState {
  mode: ThemeMode;
  theme: Theme;
  actions: {
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
    initializeTheme: () => void;
  };
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: ThemeMode.LIGHT,
  theme: lightTheme,
  
  actions: {
    toggleTheme: () => {
      const currentMode = get().mode;
      const newMode = currentMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
      const newTheme = newMode === ThemeMode.LIGHT ? lightTheme : darkTheme;
      
      set({
        mode: newMode,
        theme: newTheme,
      });
      
      // Save to storage
      ThemeStorage.saveThemeMode(newMode);
    },

    setTheme: (mode: ThemeMode) => {
      const newTheme = mode === ThemeMode.LIGHT ? lightTheme : darkTheme;
      
      set({
        mode,
        theme: newTheme,
      });
      
      // Save to storage
      ThemeStorage.saveThemeMode(mode);
    },

    initializeTheme: () => {
      const savedMode = ThemeStorage.getThemeMode() as ThemeMode;
      const theme = savedMode === ThemeMode.LIGHT ? lightTheme : darkTheme;
      
      set({
        mode: savedMode,
        theme,
      });
    },
  },
}));
