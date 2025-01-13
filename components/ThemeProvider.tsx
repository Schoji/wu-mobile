import * as React from 'react';

import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';


type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = React.useState<Theme>(DefaultTheme);

  const toggleTheme = React.useCallback(() => {
    setTheme((prevTheme) => (prevTheme === DefaultTheme ? DarkTheme : DefaultTheme));
  },[])

  const themeContextValue = React.useMemo(() => ({
    theme,
    toggleTheme,
  }),
  [theme, toggleTheme])

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
