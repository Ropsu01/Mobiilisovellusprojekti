import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home';
import Tasks from '../screens/Tasks';
import Calendar from '../screens/Calendar';
import Weather from '../screens/Weather';
import Jokes from '../screens/Jokes';
import IconOcticons from 'react-native-vector-icons/Octicons';
import IconFontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleSwitch } from './ToggleButton'; // Adjust the path as necessary
import { useTheme } from '../contexts/ThemeContext'; // Ensure this is the correct path to your ThemeContext



const Tab = createBottomTabNavigator();

function TabNavigator() {

  const { theme } = useTheme(); // Using the theme context
  const isDarkMode = theme === 'dark';

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerRight: () => <ThemeToggleSwitch />,

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
            backgroundColor: isDarkMode ? '#333' : '#436850', // Dynamic background color based on theme
            paddingBottom: 0,
            height: 80,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 30,
          },
          tabBarActiveTintColor:  'green', // Dynamic active tint color
          tabBarInactiveTintColor: 'grey', // Dynamic inactive tint color
          tabBarActiveBackgroundColor: isDarkMode ? 'black' : 'white',
          tabBarInactiveBackgroundColor: isDarkMode ? 'black' : 'white',
          headerStyle: {
            backgroundColor: isDarkMode ? '#222' : '#FFFFFF', // Dynamic header background color
          },
          headerTitleStyle: {
            color: isDarkMode ? 'white' : 'black', // Dynamic header title color
          },
        })}
      >
        <Tab.Screen name="Koti" component={Home} options={{ tabBarLabel: 'Koti' }} />
        <Tab.Screen name="Tehtävät" component={Tasks} options={{ tabBarLabel: 'Tehtävät' }} />
        <Tab.Screen name="Kalenteri" component={Calendar} options={{ tabBarLabel: 'Kalenteri' }} />
        <Tab.Screen name="Säätiedot" component={Weather} options={{ tabBarLabel: 'Säätiedot' }} />
        <Tab.Screen name="Viihde" component={Jokes} options={{ tabBarLabel: 'Viihde' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default TabNavigator;
