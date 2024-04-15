import React from 'react';
import { Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext'; // Ensure the import path is correct

const ThemeToggleSwitch = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <Switch
    trackColor={{ false: "#DDD", true: "#979797" }} // Light grey for "off", darker grey for "on"
    thumbColor={isDarkMode ? "#FFF" : "#333"} // Darker thumb for dark mode, white for light mode
      onValueChange={toggleTheme}
      value={isDarkMode}
    />
  );
}

export { ThemeToggleSwitch };
