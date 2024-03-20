import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Home from '../screens/Home';
import Tasks from '../screens/Tasks';
import Calendar from '../screens/Calendar';
import Weather from '../screens/Weather';
import Jokes from '../screens/Jokes';
import { NavigationContainer } from '@react-navigation/native';


const Tab = createBottomTabNavigator();

export default function NavBar() {
    return (
        <NavigationContainer >
            <Tab.Navigator > 
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Tasks" component={Tasks} />
                <Tab.Screen name="Calendar" component={Calendar} />
                <Tab.Screen name="Weather" component={Weather} />
                <Tab.Screen name="Jokes" component={Jokes} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
