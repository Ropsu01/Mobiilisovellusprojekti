import { View, StyleSheet } from 'react-native'
import React from 'react'
import FrontWeather from '../components/WeatherFrontPage'
import FrontPageWeather from '../components/PositionFront'
import CalendarWidget from '../components/CalendarWidget';


export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.HomeWeather}>
      <FrontPageWeather/>
      </View> 
      <View>
      <CalendarWidget />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightgrey',
  },
  HomeWeather: {
    marginTop: 10,
    backgroundColor: 'white',
    color: '#ABDCAA',
    borderRadius: 10,
  },
});