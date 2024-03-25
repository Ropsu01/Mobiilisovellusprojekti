import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const JokesAndFacts = () => {
  const [joke, setJoke] = useState('');
  const [funFact, setFunFact] = useState('');

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
    "Kilpikonnat voivat hengittää peräaukostaan.",
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


    
    // Add more facts here
  ];

  // Function to pick random joke and fact
  const updateContent = () => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setJoke(randomJoke);
    setFunFact(randomFact);
  };

  // Call the update function initially when the component mounts
  React.useEffect(() => {
    updateContent();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: '#E7FDDF', width: 350, height: 120, padding: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Päivän Vitsi:</Text>
        <Text style={{ marginTop: 10 }}>{joke}</Text>
      </View>
      <View style={{ backgroundColor: '#E7FDDF', width: 350, height: 120, padding: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>Hauska Fakta:</Text>
        <Text style={{ marginTop: 10 }}>{funFact}</Text>
      </View>
      <Button title="Päivitä" onPress={updateContent} />
    </View>
  );
};

export default JokesAndFacts;
