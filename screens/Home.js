import { View, StyleSheet } from 'react-native'
import React from 'react'
import FrontWeather from '../components/WeatherFrontPage'
import FrontPageWeather from '../components/PositionFront'

export default function Home() {
  return (
    <View style={styles.container}>
      <FrontPageWeather />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});