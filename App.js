import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Weather from './screens/Weather';
import NavBar from './components/NavBar';
import { ThemeProvider } from './contexts/ThemeContext'; // Adjust this path according to where you've placed your context


export default function App() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
      <NavBar />
      </View>
      </ThemeProvider >
  );
}
