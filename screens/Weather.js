import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import NavBar from '../components/NavBar'
import Position from '../components/Position'

export default function Weather() {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    backgroundColor: '#F7F7F7',
  },
  container2: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    color: '#ABDCAA',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    borderRadius: 10,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  weathers: {
    backgroundColor: '#ABDCAA',
    color: '#ABDCAA',
  },
});
