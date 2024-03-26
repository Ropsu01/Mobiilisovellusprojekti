import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Modal, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocaleConfig } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'




// Locale configuration for Finnish
LocaleConfig.locales['fi'] = {
  monthNames: [
    'Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu',
    'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu',
    'Marraskuu', 'Joulukuu'
  ],
  monthNamesShort: [
    'Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko',
    'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka',
    'Marras', 'Joulu'
  ],
  dayNames: [
    'Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko',
    'Torstai', 'Perjantai', 'Lauantai'
  ],
  dayNamesShort: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
};
LocaleConfig.defaultLocale = 'fi';

const NoteContainer = ({ note, onOpen }) => {
  return (
    <TouchableOpacity onPress={onOpen} style={styles.noteContainer}>
      <Text style={styles.noteText}>{note}</Text>
    </TouchableOpacity>
  );
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState('');
  const [notes, setNotes] = useState({});
  const [noteText, setNoteText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [activeNote, setActiveNote] = useState({ date: '', index: -1, text: '' });
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const savedNotes = await AsyncStorage.getItem('notes');
        if (savedNotes !== null) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error("Failed to load the notes from AsyncStorage", error);
      }
    };
    loadNotes();
  }, []);

  const onDayPress = day => {
    setSelectedDate(day.dateString);
    setNoteText('');
  };

  const saveNote = async () => {
    const updatedNotes = { ...notes, [selectedDate]: [...(notes[selectedDate] || []), noteText] };
    try {
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to save the note to AsyncStorage", error);
    }
  };

  const deleteNote = async (date, noteIndex) => {
    const updatedNotesForDate = notes[date].filter((_, index) => index !== noteIndex);
    const updatedNotes = { ...notes, [date]: updatedNotesForDate };

    try {
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setDetailsModalVisible(false); // Close details modal after deletion
    } catch (error) {
      console.error("Failed to delete the note from AsyncStorage", error);
    }
  };

  const getMarkedDates = () => {
    const marked = Object.keys(notes).reduce((acc, date) => {
      if (notes[date] && notes[date].length > 0) {
        acc[date] = { marked: true, dotColor: '#ABD7AA' };
      }
      return acc;
    }, {});

    if (selectedDate) {
      marked[selectedDate] = { ...marked[selectedDate], selected: true, selectedColor: '#1a8f3f' };
    }
    return marked;
  };

  const openNoteDetails = (date, index, note) => {
    setActiveNote({ date, index, text: note });
    setDetailsModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <RNCalendar
              onDayPress={onDayPress}
              markedDates={getMarkedDates()}
              theme={{
                arrowColor: '#1a8f3f',
                selectedDayBackgroundColor: '#1a8f3f',
                todayTextColor: '#1a8f3f',
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16,
              }}
            />
            {selectedDate && Array.isArray(notes[selectedDate]) && (
              <View style={styles.notesSection}>
                {notes[selectedDate].map((note, index) => (
                  <NoteContainer 
                    key={index} 
                    note={note}
                    onOpen={() => openNoteDetails(selectedDate, index, note)} 
                  />
                ))}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
  
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={24} color="#FFF" />
      </TouchableOpacity>
  
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.noteInput}
              placeholder="Lisää muistiinpano..."
              placeholderTextColor="#DDDCDC"
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
            />
            <Button title="Tallenna muistiinpano" onPress={saveNote} color="#1a8f3f" />
            <Button title="Sulje" onPress={() => setModalVisible(false)} color="#1a8f3f" />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
  
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.noteInput}
              value={activeNote.text}
              onChangeText={(text) => setActiveNote(prev => ({ ...prev, text }))}
              multiline
              numberOfLines={4}
            />
            <Button title="Save Changes" onPress={() => saveNote()} color="#1a8f3f" />
            <Button title="Delete Note" onPress={() => deleteNote(activeNote.date, activeNote.index)} color="#ff6347" />
            <Button title="Close" onPress={() => setDetailsModalVisible(false)} color="#a1a1a1" />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
                }  

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
    marginBottom: '30%',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a8f3f',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  noteInput: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  notesSection: {
    padding: 10,
    marginTop: 10,
  },
  noteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ABD7AA',
  },
  noteText: {
    flex: 1,
    fontSize: 16,
  },
});
