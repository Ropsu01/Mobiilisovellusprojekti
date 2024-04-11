import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useFonts, Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import NavBar from './components/NavBar'; // Assuming NavBar includes the NavigationContainer

export default function App() {
  let [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />;
  }

  // Directly return NavBar without wrapping it in another NavigationContainer
  return <NavBar />;
}
