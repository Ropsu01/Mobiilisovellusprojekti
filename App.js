import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Weather from './screens/Weather';
import NavBar from './components/NavBar';

export default function App() {
  return (
      <NavBar />
  );
}

styles = StyleSheet.create({
  NavBar: {
      backgroundColor: 'lightgrey',
      color: 'black',
  }
})
