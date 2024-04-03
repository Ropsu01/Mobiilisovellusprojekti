import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Home from '../screens/Home';
import Tasks from '../screens/Tasks';
import Calendar from '../screens/Calendar';
import Weather from '../screens/Weather';
import Jokes from '../screens/Jokes';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
//import {faLaughBeam} from '@fortawesome/free-regular-svg-icons';
//import { faHouse, faTasks, faCalendarDays, faCloudSun} from '@fortawesome/free-solid-svg-icons';
import IconOcticons from 'react-native-vector-icons/Octicons'; // Import Octicons
import IconFontisto from 'react-native-vector-icons/Fontisto'; // Import Fontisto
import IconIonicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons
const Tab = createBottomTabNavigator();

export default function NavBar() {
    return (
        <NavigationContainer >
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Koti') {
                            iconName = 'home';
                        } else if (route.name === 'Tehtävät') {
                            iconName = 'checklist';
                        } else if (route.name === 'Kalenteri') {
                            iconName = 'calendar-month-outline';
                        } else if (route.name === 'Säätiedot') {
                            iconName = 'sun';
                        } else if (route.name === 'Viihde') {
                            iconName = 'laughing';
                        }

                        if (iconName === 'laughing') {
                            return <IconFontisto name={iconName} size={size} color={color} />;
                        } else if (iconName === 'calendar-month-outline') {
                            return <MaterialCommunityIcons name={iconName} size={29} color={color} style={{ marginTop: -2 }} />;
                        } else {
                            return <IconOcticons name={iconName} size={size} color={color} />;
                        }
                    },
                })}
                tabBarOptions={{
                    activeTintColor: '#1a8f3f',
                    inactiveTintColor: 'black',
                    inactiveBackgroundColor: '#ABD7AA',
                    activeBackgroundColor: '#ABD7AA',
                    labelStyle: {
                    display: 'none', 
                    },

                }}>

                <Tab.Screen name="Koti" component={Home}/>
                <Tab.Screen name="Tehtävät" component={Tasks} />
                <Tab.Screen name="Kalenteri" component={Calendar} />
                <Tab.Screen name="Säätiedot" component={Weather} />
                <Tab.Screen name="Viihde" component={Jokes} />

            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
})