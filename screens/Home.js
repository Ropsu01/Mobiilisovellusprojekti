
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FrontWeather from '../components/WeatherFrontPage';
import FrontPageWeather from '../components/PositionFront';
import CalendarWidget from '../components/CalendarWidget';
import TasksWidget from '../components/TasksFrontPage';
import { useTheme } from '../contexts/ThemeContext';
import { firestore } from '../firebase/Config';
import { collection, query, where,onSnapshot, getDocs } from 'firebase/firestore';

export default function Home() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [homeListId, setHomeListId] = useState(null);

  useEffect(() => {
    const q = query(collection(firestore, 'lists'), where('isOnHomePage', '==', true));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (lists.length > 0) {
        setHomeListId(lists[0].id);  // Update whenever the data changes
      } else {
        setHomeListId(null); // No list is marked to be shown on the homepage
      }
    });
  
    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []);
  

  const containerStyles = [
    styles.container,
    { backgroundColor: isDarkMode ? '#1C1C1C' : '#F7F7F7' }
  ];

  return (
    <View style={containerStyles}>
      <View style={styles.widgetContainer}>
        <FrontPageWeather />
        <CalendarWidget />
        {homeListId && <TasksWidget listId={homeListId} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetContainer: {
    flexDirection: 'column',
    flex: 1,
  }
});
