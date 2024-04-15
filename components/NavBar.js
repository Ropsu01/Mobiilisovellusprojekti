import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import Home from '../screens/Home';
import Tasks from '../screens/Tasks';
import TaskListScreen from '../screens/TaskListScreen';
import Calendar from '../screens/Calendar';
import Weather from '../screens/Weather';
import Jokes from '../screens/Jokes';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import IconOcticons from 'react-native-vector-icons/Octicons'; // Import Octicons
import IconFontisto from 'react-native-vector-icons/Fontisto'; // Import Fontisto
import IconIonicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function TabNavigator() {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let IconComponent = IconOcticons; // Default icon component

          if (route.name === 'Koti') {
            iconName = 'home';
          } else if (route.name === 'Tehtävät') {
            iconName = 'checklist';
          } else if (route.name === 'Kalenteri') {
            iconName = 'calendar-month-outline';
            IconComponent = MaterialCommunityIcons; // Use MaterialCommunityIcons for this
            size = 29; // Adjust size for MaterialCommunityIcons
          } else if (route.name === 'Säätiedot') {
            iconName = 'sun';
            IconComponent = IconOcticons; // Use Fontisto for this
          } else if (route.name === 'Viihde') {
            iconName = 'laughing';
            IconComponent = IconFontisto; // Use Fontisto for this
          }

          // Return the customized icon wrapped in a View to adjust its position
          return (
            <View style={{ marginTop: 0 }}>
              <IconComponent name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarStyle: {
          backgroundColor: '#436850', // Navbar color
          paddingBottom: 0, // You may need to adjust this for proper alignment
          height: 80, // Adjust as needed for label text
        },
        tabBarLabelStyle: {
          color: '#FBFADA', // Set text color for both active and inactive tabs

          fontSize: 10, // Adjust the size of the label text as needed
          marginBottom: 30, // Adjust for spacing between the icon and text
        },
        // tabBarOptions is deprecated in v6, so make sure to move these into screenOptions
        tabBarActiveTintColor: '#ADBC9F',
        tabBarInactiveTintColor: '#FBFADA',
        tabBarActiveBackgroundColor: '#436850',
        tabBarInactiveBackgroundColor: '#436850',
        headerStyle: {
          backgroundColor: '#436850', // Set your desired background color here
        },
        headerTitleStyle: {
          color: '#FBFADA' // This sets the header title text color
        },

      })}
    >
      <Tab.Screen name="Koti" component={Home} options={{ tabBarLabel: 'Koti' }} />
      <Tab.Screen name="Tehtävät" component={Tasks} options={{ tabBarLabel: 'Tehtävät' }} />
      <Tab.Screen name="Kalenteri" component={Calendar} options={{ tabBarLabel: 'Kalenteri' }} />
      <Tab.Screen name="Säätiedot" component={Weather} options={{ tabBarLabel: 'Säätiedot' }} />
      <Tab.Screen name="Viihde" component={Jokes} options={{ tabBarLabel: 'Viihde' }} />
    </Tab.Navigator>
  );
}

export default function NavBar() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#436850' }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // This hides headers for all screens in this navigator
          }}
        >
          <Stack.Screen
            name="takaisin"
            component={TabNavigator}
          />
          <Stack.Screen
            name="TaskListScreen"
            component={TaskListScreen}
            options={({ route }) => ({
              headerShown: true,
              title: route.params?.title ?? '',
              headerStyle: {
                backgroundColor: '#436850',
              },
              headerTitleStyle: {
                color: '#FBFADA',
              },
              headerTintColor: '#FBFADA', // This sets the back button color
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}