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
import {faLaughBeam} from '@fortawesome/free-regular-svg-icons';
import { faHouse, faTasks, faCalendarDays, faCloudSun} from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();

export default function NavBar() {
    return (
        <NavigationContainer >
            <Tab.Navigator 
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Koti') {
                            iconName = faHouse;
                        } else if (route.name === 'Tehtävät') {
                            iconName = faTasks;
                        } else if (route.name === 'Kalenteri') {
                            iconName = faCalendarDays;
                        } else if (route.name === 'Säätiedot') {
                            iconName = faCloudSun;
                        } else if (route.name === 'Viihde') {
                            iconName = faLaughBeam;
                        }

                        return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
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
            
                <Tab.Screen name="Koti" component={Home} />
                <Tab.Screen name="Tehtävät" component={Tasks} />
                <Tab.Screen name="Kalenteri" component={Calendar} />
                <Tab.Screen name="Säätiedot" component={Weather} />
                <Tab.Screen name="Viihde" component={Jokes} />
            
            </Tab.Navigator>
        </NavigationContainer>
    );
}

