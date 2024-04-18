import React from 'react';
import { View, StyleSheet } from 'react-native';
import FrontWeather from '../components/WeatherFrontPage';
import FrontPageWeather from '../components/PositionFront';
import CalendarWidget from '../components/CalendarWidget';
import { useTheme } from '../contexts/ThemeContext'; // Ensure this is the correct path to your ThemeContext

export default function Home() {
  const { theme } = useTheme(); // Using the theme context
  const isDarkMode = theme === 'dark';

  // Apply conditional styling within the component
  const containerStyles = [
    styles.container,
    { backgroundColor: isDarkMode ? '#1C1C1C' : '#F7F7F7' } // Conditional background color
  ];


  return (
    <View style={containerStyles}>
      <View style={styles.widgetContainer}>
        <FrontPageWeather/>
        <CalendarWidget/>
        <TasksFrontPage/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Ensure the container centers its children both vertically and horizontally
  },
  widgetContainer: {
    flexDirection: 'column', // Align children horizontally
    flex: 1, // Take up all available space
  }
});