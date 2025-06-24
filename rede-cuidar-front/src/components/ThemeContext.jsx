// src/components/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext(); // ← você não tinha isso

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
     const savedTheme = localStorage.getItem('theme');
     return savedTheme === 'dark' ? 'dark' : 'light';
   });

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#1976d2' },
      background: {
        default: mode === 'dark' ? '#333232' : '#f5f5f5',
        paper: mode === 'dark' ? '#1e1e1e' : '#fff',
      },
    },
     typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// 🔁 Hook para usar contexto no App.jsx
export const useThemeContext = () => useContext(ThemeContext);
