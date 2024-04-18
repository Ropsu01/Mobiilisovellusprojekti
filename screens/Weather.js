import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import NavBar from '../components/NavBar'
import Position from '../components/Position'
import { useTheme } from '../contexts/ThemeContext'; // Import the theme context


export default function Weather() {
  const { theme } = useTheme(); // Retrieve the current theme
  const isDarkMode = theme === 'dark'; // Determine if the theme is dark

  // Define dynamic styles based on the theme
  const styles = getDynamicStyles(isDarkMode);

  return (
    
    <View style={styles.container}>
      <View style={styles.container2}>
      <Text style={styles.heading}>
      <Position style={styles.weathers}/>
      </Text>
      </View>
    </View>
  )
}

function getDynamicStyles(isDarkMode) {
  return StyleSheet.create({
    container: {
      flex: 1,
      margin: 0,
      backgroundColor: isDarkMode ? '#1C1C1C' : '#F7F7F7', // Dark mode has darker background
    },
    container2: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1C1C1C' : '#F7F7F7', // Adjusted for theme
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      borderRadius: 10,
    },
    heading: {
      fontSize: 24,
      marginBottom: 20,
      color: isDarkMode ? '#FFF' : '#000', // Text color based on theme
    },
    weathers: {
      backgroundColor: isDarkMode ? '#555' : '#ABDCAA', // Adjusted for theme
      color: isDarkMode ? '#FFF' : '#000', // Assuming you want to change text color too
    },
  });
}