import { View, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import FrontWeather from '../components/WeatherFrontPage'
import FrontPageWeather from '../components/PositionFront'
import CalendarWidget from '../components/CalendarWidget';
import TasksFrontPage from '../components/TasksFrontPage';

export default function Home() {

  return (
    <View style={styles.container}>
      <View style={styles.widgetContainer}>
        <FrontPageWeather/>
        <CalendarWidget/>
        <TasksFrontPage/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Ensure the container centers its children both vertically and horizontally
    backgroundColor: '#F7F7F7',
  },
  widgetContainer: {
    flexDirection: 'column', // Align children horizontally
    flex: 1, // Take up all available space
  }
});
