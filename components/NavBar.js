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

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <NavigationContainer>
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
            fontSize: 10, // Adjust the size of the label text as needed
            marginBottom: 30, // Adjust for spacing between the icon and text
          },
          tabBarActiveTintColor: '#ADBC9F',
          tabBarInactiveTintColor: '#FFFEE2',
          tabBarActiveBackgroundColor: '#436850',
          tabBarInactiveBackgroundColor: '#436850',
          headerStyle: {
            backgroundColor: '#436850', // Set your desired background color here
          },
          headerTitleStyle: {
            color: '#FFFEE2' // This sets the header title text color
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
