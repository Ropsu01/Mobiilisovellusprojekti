import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { firestore } from '../firebase/Config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { useTheme } from '../contexts/ThemeContext';

const CalendarWidget = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [today, setToday] = useState(new Date());
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const todayStr = format(today, 'yyyy-MM-dd');
      const q = query(
        collection(firestore, 'events'),
        where('date', '>=', todayStr),
        orderBy('date', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const events = [];
      querySnapshot.forEach((doc) => {
        events.push(doc.data());
      });

      setUpcomingEvents(events);
    };

    fetchEvents();
  }, [today]);

  return (
    <View style={styles.container}>
      <View style={[styles.dateAndEventsContainer, {backgroundColor: isDarkMode ? 'black' : 'white'}]}>
        <View style={[styles.dateBox, {
          backgroundColor: isDarkMode ? '#000' : '#FFF',
          shadowColor: isDarkMode ? '#FFF' : '#000',  // Consider using a more contrasting color in dark mode
        }]}>
          <Text style={{ color: isDarkMode ? 'white' : 'black', fontSize: 24 }}>
            {format(today, 'EEEE', { locale: fi })}
          </Text>
          <Text style={{ color: isDarkMode ? 'white' : 'black', fontSize: 48, fontWeight: 'bold' }}>
            {format(today, 'd', { locale: fi })}
          </Text>
        </View>
        <View style={[styles.eventsList, {
          backgroundColor: isDarkMode ? 'black' : 'white',
          shadowColor: isDarkMode ? '#fff' : '#000'
        }]}>
          <Text style={[styles.header, { color: isDarkMode ? 'white' : 'black' }]}>Tulevat tapahtumat:</Text>
          {upcomingEvents.slice(0, 3).map((event, index) => (
            <Text key={index} style={[styles.eventText, { color: isDarkMode ? 'white' : 'black' }]}>
              {format(new Date(event.date), 'PP', { locale: fi })} - {event.text}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
  dateAndEventsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 10,
  },
  dateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  eventsList: {
    marginLeft: 20,
    padding: 15,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  day: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  weekday: {
    fontSize: 24,
  },
  header: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventText: {
    marginTop: 5,
  },
});

export default CalendarWidget;
