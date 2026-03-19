import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  isSidebarOpen: boolean;
  isDarkMode: boolean;
}

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return true; // Default to dark mode
  }
  return true;
};

const initialState: UiState = {
  isSidebarOpen: true,
  isDarkMode: getInitialTheme(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
       if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  },
});

export const { toggleSidebar, toggleTheme, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
