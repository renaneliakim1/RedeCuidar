import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const savedMode = localStorage.getItem('themeMode');
  const [mode, setMode] = useState(savedMode || 'light');

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', newMode);
    setMode(newMode);
  };

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        ...(mode === 'light'
          ? {
              primary: { main: '#1976d2', contrastText: '#fff' },
              background: { default: '#f5f5f5', paper: '#fff' },
              text: { primary: '#000' },
            }
          : {
              primary: { main: '#1565c0', contrastText: '#fff' },
              background: { default: '#121212', paper: '#1e1e1e' },
              text: { primary: '#fff' },
            }),
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: { textTransform: 'none' },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? '#888' : undefined,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? '#90caf9' : undefined,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'dark' ? '#90caf9' : undefined,
              },
              '& input': {
                color: mode === 'dark' ? '#fff' : undefined,
              },
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              color: mode === 'dark' ? '#bbb' : undefined,
              '&.Mui-focused': {
                color: mode === 'dark' ? '#90caf9' : undefined,
              },
            },
          },
        },
      },
    }), [mode]
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
