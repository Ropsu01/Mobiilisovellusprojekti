import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { firestore } from '../firebase/Config'; // Adjust the import path according to your structure
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale'; // Import Finnish locale

const CalendarWidget = () => {
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
      <View style={styles.dateAndEventsContainer}>
        <View style={styles.dateBox}>
        <Text style={styles.weekday}>{format(today, 'EEEE', { locale: fi })}</Text>

          <Text style={styles.day}>{format(today, 'd', { locale: fi })}</Text>
        </View>

        <View style={styles.eventsList}>
          <Text style={styles.header}>Tulevat tapahtumat:</Text>
          {upcomingEvents.slice(0, 3).map((event, index) => (
            <Text key={index} style={styles.eventText}>
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
      marginTop: 20,
    },
    dateAndEventsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#fff', // Optional: Set the background color of the entire row if needed
      borderRadius: 10, // Optional: Round the corners of the entire row
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
      padding: 10, // Optional: Add padding around the entire row
    },
    dateBox: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    eventsList: {
      marginLeft: 20,
      padding: 15,
      backgroundColor: '#fff', // Set the background color to white
      shadowColor: '#000', // Add a shadow for depth
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
      marginBottom: 5, // Add a small margin below the header for spacing
    },
    eventText: {
      marginTop: 5,
    },
  });
  

export default CalendarWidget;
