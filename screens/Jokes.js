import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase/app';
import '../firebase/Config';
import { AppRegistry } from 'react-native';
import App from '../App';
AppRegistry.registerComponent('MyApp', () => App);

// Alusta Firebase-app
const firebaseConfig = {
  // Lisää Firebase-projektisi konfiguraatio tähän
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

const JokesAndFacts = () => {
  const [joke, setJoke] = useState('');
  const [funFact, setFunFact] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Haetaan vitsit ja faktat Firebasesta
  useEffect(() => {
    const fetchData = () => {
      const jokesRef = db.ref('jokes');
      const factsRef = db.ref('facts');

      jokesRef.once('value', snapshot => {
        const jokesData = snapshot.val();
        const randomJokeIndex = Math.floor(Math.random() * jokesData.length);
        setJoke(jokesData[randomJokeIndex]);
      });

      factsRef.once('value', snapshot => {
        const factsData = snapshot.val();
        const randomFactIndex = Math.floor(Math.random() * factsData.length);
        setFunFact(factsData[randomFactIndex]);
      });
    };

    fetchData();
  }, []);

  // Tallenna suosikkilista Firebaseen
  const saveFavoritesToFirebase = () => {
    db.ref('favorites').set(favorites);
  };

  // Lataa suosikkilista Firebasesta
  useEffect(() => {
    const fetchFavorites = () => {
      db.ref('favorites').once('value', snapshot => {
        const favoritesData = snapshot.val() || [];
        setFavorites(favoritesData);
      });
    };

    fetchFavorites();
  }, []);

  // Lisää tai poista suosikkilistalta
  const toggleFavorite = (content) => {
    if (favorites.includes(content)) {
      const updatedFavorites = favorites.filter((item) => item !== content);
      setFavorites(updatedFavorites);
    } else {
      setFavorites([...favorites, content]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Päivän vitsi */}
      <TouchableOpacity onPress={() => {}} style={styles.card}>
        <Text style={styles.title}>Päivän Vitsi:</Text>
        <Text style={styles.content}>{joke}</Text>
      </TouchableOpacity>

      {/* Päivän fakta */}
      <TouchableOpacity onPress={() => {}} style={styles.card}>
        <Text style={styles.title}>Hauska Fakta:</Text>
        <Text style={styles.content}>{funFact}</Text>
      </TouchableOpacity>

      {/* Suosikkilista */}
      <ScrollView style={styles.favoriteList}>
        <Text style={styles.favoriteTitle}>Suosikit:</Text>
        {favorites.map((item, index) => (
          <TouchableOpacity key={index} style={styles.favoriteItemContainer} onPress={() => toggleFavorite(item)}>
            <Text style={styles.favoriteItem}>{item}</Text>
            <MaterialIcons name="clear" size={24} color="red" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tallenna suosikkilista */}
      <TouchableOpacity onPress={saveFavoritesToFirebase} style={styles.saveFavoritesButton}>
        <Text style={styles.saveFavoritesButtonText}>Tallenna suosikit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ABD7AA',
    width: '100%',
    padding: 20,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
  },
  favoriteList: {
    marginTop: 10,
    width: '100%',
    maxHeight: 200,
  },
  favoriteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  favoriteItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  favoriteItem: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  saveFavoritesButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  saveFavoritesButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JokesAndFacts;
