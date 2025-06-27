import React, {createContext, useContext, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {Theme} from '../../types/theme';
import {useThemeStore} from '../../store/useThemeStore';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const {theme, actions} = useThemeStore();

  useEffect(() => {
    // Initialize theme from storage
    actions.initializeTheme();
  }, [actions]);

  return (
    <ThemeContext.Provider value={{theme}}>
      <StatusBar
        barStyle={theme.mode === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.colors.background}
      />
      {children}
    </ThemeContext.Provider>
  );
};
