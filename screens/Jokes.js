import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AppRegistry } from 'react-native';
import App from '../App';
AppRegistry.registerComponent('MyApp', () => App);

const JokesAndFacts = () => {
  const [joke, setJoke] = useState('');
  const [funFact, setFunFact] = useState('');
  const [lastUpdatedDay, setLastUpdatedDay] = useState(0);

  const jokes = [
    "Mitä astronautti tokaisi löydettyään luurangon kuusta? - Mitä kuuluu?",
    "Mikä on Maija Mehiläisen isän nimi? - Faija Mehiläinen!",
    "Miksi hai ei voi olla taksikuski? - Koska se voi olla liikenteelle haitaksi!",
    "Kaksi lehmää oli kaurismetsällä. Hetken päästä toinen näki kauriin ja kuiskasi toiselle. - Shh... Ei ammuta",
    "Mitä kala tekee tupakkatehtaassa? - Sätkii",
    "Mikä on maailman paras vihannes? - Best Selleri",
    "Mitä laivan työntekijä pukee päälleen mennessään töihin? - Alusvaatteet.",
    "Kuka vetää lintujen AA-kerhoa? - Selvä pyy.",
    "Mistä kankaasta kummitusten vaatteet on tehty? - Buuvillasta.",
    "Mikä Postimies Patesta tuli, kun hän jäi eläkeelle? - Pate",
    "Mikä on pilates suomeksi? - Melilosvot",
    "Mitä Puolalainen teki altaassa? - Polski",
    "Mikä on maailman yksinkertaisin peli? - Simppeli",
    "Miksi Aki syö pullaa sateella? - Ei vaivannut keliakia",
    "Mikä tuli USA:n jälkeen? - USB",
    "Mitä Espanjalainen sanoi nähdessään hyvän diaesityksen? - Buenos Dias",
    "Mitä eroa on mustilla ja vihreillä oliiveilla? - Musti on koira",

    // Add more jokes here
  ];

  const facts = [
    "Suomi on maailman 'sisukkain' kansa, sillä sanalla ei ole käännöstä muille kielille.",
    "Suomen lipun sininen väri edustaa tuhansia järvemme, ja valkoinen puhtautta ja lunta.",
    "Aivastat noin 100 kertaa päivässä, jos olet allerginen.",
    "Krokotiilit itse asiassa itkevät kun he syövät.",
    "Karhut ovat oikeakätisiä.",
    "Koira on ainoa eläin, joka osaa lukea ihmisen kasvoja.",
    "Auringonpimennys tapahtuu noin joka 18 kuukauden välein ja kestää vain muutaman minuutin.",
    "Maapallon kiertorata on noin 940 miljoonaa kilometriä.",
    "Kuun painovoima on noin 1/6 maan painovoimasta.",
    "Siilillä on noin 7000 piikkiä kehossaan.",
    "Krokotiilit voivat elää jopa 100 vuotta.",
    "Muurahaiset nukkuvat 8 minuuttia päivässä, mikä tekee niistä eläinmaailman lyhimmän unen nukkujat.",
    "Eiffel-torni voi olla jopa 15 senttiä korkeampi kesällä lämpölaajenemisen vuoksi.",
    "Skotlannin kansalliseläin on yksisarvinen",
    "Mustekalalla on kolme sydäntä.",
    "Sitruuna kelluu, mutta lime ei.",
    "Eläimet voivat olla allergisia ihmisille.",
    "Australia on leveämpi kuin Kuu.",
    "Paavi ei voi toimia elinluovuttajana.",
    "Lepakot ovat ainoita lentäviä nisäkkäitä",
    "Ihmiskehon pienin luu sijaitsee korvassa.",
    "Maailman vanhin kirjoitettu resepti on yli 4000 vuotta vanha.",
    "Maailmassa on vain yksi maa, jossa ei ole hyttysiä - Islanti.",
    "Suomessa on enemmän saunoja kuin autoja.",
    "Kynnet kasvavat nopeammin kesällä kuin talvella.",
    "Venäjällä on 11 eri aikavyöhykettä.",

    // Add more facts here
  ];

  // Funktio valitsee satunnaisen vitsin tai faktan
  const getRandomContent = (contentArray) => {
    const randomIndex = Math.floor(Math.random() * contentArray.length);
    return contentArray[randomIndex];
  };

  // Funktio päivittää vitsin ja faktan päivittäin
  const updateDailyContent = () => {
    const today = new Date().getDate();
    if (today !== lastUpdatedDay) {
      const newJoke = getRandomContent(jokes);
      const newFact = getRandomContent(facts);
      setJoke(newJoke);
      setFunFact(newFact);
      setLastUpdatedDay(today);
    }
  };

  // Kutsutaan päivitysfunktiota komponentin ensimmäisellä renderöinnillä
  useEffect(() => {
    updateDailyContent();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={updateDailyContent} style={styles.card}>
        <Text style={styles.title}>Päivän Vitsi:</Text>
        <Text style={styles.content}>{joke}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={updateDailyContent} style={styles.card}>
        <Text style={styles.title}>Hauska Fakta:</Text>
        <Text style={styles.content}>{funFact}</Text>
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
});

export default JokesAndFacts;
