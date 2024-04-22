import React from 'react'
import { useState, useEffect } from 'react';
import TaskListScreen from '../screens/TaskListScreen';
import { View, Text, Button, StyleSheet, TextInput, Modal, FlatList } from 'react-native';
import { addDoc, collection, onSnapshot, doc, getDoc, query, where, getDocs, deleteDoc, setDoc, runTransaction } from 'firebase/firestore'; // Tuodaan Firestore-tietokannan toiminnot
import { firestore } from '../firebase/Config'; // Tuodaan Firestore-yhteys
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import IconIonicons from 'react-native-vector-icons/Ionicons';



export default function Tasks() {
    const [isNewListModalVisible, setIsNewListModalVisible] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [lists, setLists] = useState([]);
    const navigation = useNavigation();
    const [selectedList, setSelectedList] = useState(null);
   

    useEffect(() => {
        navigation.setOptions({ title: 'Tehtävälistat' });
        const unsubscribe = onSnapshot(collection(firestore, 'lists'), (snapshot) => {
            const listsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLists(listsData);
            const selected = listsData.find(list => list.isOnHomePage);
            setSelectedList(selected || null);
        });
        return () => unsubscribe();
    }, []);


    const openNewListModal = () => {
        setIsNewListModalVisible(true);
    };

    const closeNewListModal = () => {
        setIsNewListModalVisible(false);
    };

    const createNewList = async () => {
        if (newListName.trim() === '') {
            // Tarkista, että uuden listan nimi ei ole tyhjä
            return;
        }

        try {
            // Lisää uusi lista Firestoreen
            const newListRef = await addDoc(collection(firestore, 'lists'), {
                name: newListName,

                // Lisää muita tarvittavia kenttiä tarvittaessa
            });
            console.log('Uusi lista lisätty Firestoreen:', newListRef.id);
            setNewListName(''); // Tyhjennä uuden listan nimi input-kenttä
            closeNewListModal(); // Sulje modaalinen 
            setLists([...lists, { id: newListRef.id, name: newListName }]); // Päivitä listatila
        } catch (error) {
            console.error('Virhe uuden listan luomisessa:', error);
        }
    };

    const handleListPress = async (listId) => {
        try {
            // Haetaan listan nimi getListName-funktiolla
            const listName = await getListName(listId);
            // Tarkistetaan, että listan nimi on saatu
            const tasks = await getTasksForList(listId);
            if (listName && tasks) {
                // Navigoidaan TaskListScreeniin ja välitetään listan ID ja nimi parametreina
                navigation.navigate('TaskListScreen', { listId, title: listName, tasks });
            } else {
                console.log('List name not found!');
            }
        } catch (error) {
            console.error('Error navigating to TaskListScreen:', error);
        }
    };

    const getListName = async (listId) => {
        try {
            const docRef = doc(firestore, 'lists', listId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data().name; // Palautetaan listan nimi
            } else {
                console.log('List not found!');
                return null;
            }
        } catch (error) {
            console.error('Error fetching list name:', error);
            return null;
        }
    };

    const getTasksForList = async (listId) => {
        try {
            // Luodaan kysely, joka hakee tehtävät annetun listan ID:n perusteella
            const q = query(collection(firestore, 'tasks'), where('listId', '==', listId));
            const querySnapshot = await getDocs(q);

            // Muunnetaan kyselyn tulos taulukoksi tehtäväobjekteja ja palautetaan se
            const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return tasks;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    };

    const deleteList = async (listId, listName) => {
        Alert.alert(
            'Poista lista',
            `Haluatko varmasti poistaa listan "${listName}"? Kaikki listan tehtävät poistetaan pysyvästi.`,
            [
                {
                    text: 'Peruuta',
                    style: 'cancel',
                },
                {
                    text: 'Poista',
                    onPress: async () => {
                        try {
                            // Poista lista Firestoresta
                            await deleteDoc(doc(firestore, 'lists', listId));
                            console.log('List deleted:', listId);
                            // Päivitä listatila poistamalla poistettu lista
                            setLists(lists.filter(list => list.id !== listId));
                            // Poista valittu lista, jos se poistettiin
                            if (selectedList && selectedList.id === listId) {
                                setSelectedList(null);
                            }
                        } catch (error) {
                            console.error('Error deleting list:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };



    const toggleListSelection = async (selectedListId) => {
        console.log(`Attempting to toggle visibility for list ID: ${selectedListId}`);
        try {
            await runTransaction(firestore, async (transaction) => {
                const listsSnapshot = await getDocs(collection(firestore, 'lists'));
                listsSnapshot.docs.forEach(doc => {
                    // Set isOnHomePage to true only for the selected list and false for others
                    const isOnHomePage = doc.id === selectedListId;
                    transaction.update(doc.ref, { isOnHomePage });
                });
            });

            console.log("Transaction successfully committed!");
            fetchLists(); // Refresh lists to reflect changes
            Alert.alert('Listan lisääminen etusivulle', `Lista" ${selectedList.name}" lisätty etusivulle.`);
        } catch (error) {
            console.error('Transaction failed: ', error);
        }
    };



    const fetchLists = async () => {
        const snapshot = await getDocs(collection(firestore, 'lists'));
        const fetchedLists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLists(fetchedLists);
        const selected = fetchedLists.find(list => list.isOnHomePage);
        setSelectedList(selected || null);
    };





    const updateSelectedListsInFirestore = async (updatedSelectedLists) => {
        try {
            // Päivitä valittujen listojen tiedot Firestoreen
            await setDoc(doc(firestore, 'users', 'currentUserUid'), {
                selectedLists: updatedSelectedLists
            }, { merge: true });
            console.log('Selected lists updated in Firestore:', updatedSelectedLists);
        } catch (error) {
            throw new Error('Error updating selected lists in Firestore:', error);
        }
    };


    const updateListForHomePage = async (listId, selected) => {
        try {
            // Päivitä kenttä, joka osoittaa, onko lista valittu etusivulla vai ei
            await setDoc(doc(firestore, 'lists', listId), {
                isOnHomePage: selected
            }, { merge: true });
            console.log(`List ${listId} updated for home page: ${selected}`);
        } catch (error) {
            console.error('Error updating list for home page:', error);
        }
    };

    return (
        <View style={styles.container}>

            <View style={[styles.listContainer, { maxHeight: lists.length > 8 ? 570 : null }]}>
                <FlatList
                    data={lists}
                    renderItem={({ item }) => (
                        <View style={styles.listContainer}>
                            <TouchableOpacity onPress={() => handleListPress(item.id)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => toggleListSelection(item.id)} style={{ marginRight: 10 }}>
                                        {item.isOnHomePage ? (
                                            <IconIonicons name='home' size={25} color='#00AF00' />
                                        ) : (
                                            <IconIonicons name='home-outline' size={25} color='#79747E' />
                                        )}
                                    </TouchableOpacity>

                                    <Text style={styles.listItem}>{item.name}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteList(item.id, item.name)}>
                                <IconIonicons name='trash-outline' size={25} color='#79747E' />
                            </TouchableOpacity>
                        </View>

                    )}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={lists.length > 8} // Lisätty scrollEnabled ominaisuus
                />

            </View>


            <View style={styles.addButtonContainer}>
                <Button color={'#FFF'} title="+" onPress={openNewListModal} />
            </View>

            <Modal
                visible={isNewListModalVisible}
                animationType='fade'
                transparent={true}
                onRequestClose={closeNewListModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Uuden listan luominen</Text>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Anna uuden listan nimi"
                            onChangeText={text => setNewListName(text)}
                            value={newListName}
                        />
                        <View style={styles.buttonContainer}>
                            <Button onPress={closeNewListModal} title="Peruuta" />
                            <Button onPress={createNewList} title="Luo" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addButtonContainer: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#00AF00', // Medium Green for add button
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        width: '80%',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputText: {
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tasks: {
        fontSize: 20,
        fontWeight: '',
        margin: 20,
    },
    listItem: {
        fontSize: 18,
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    deleteButton: {
        backgroundColor: '#FF6347', // Punainen väri
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
    },
    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        marginVertical: 6,
        borderRadius: 10,
    },
    todoText: {
        flex: 1,
        paddingHorizontal: 4,
        marginLeft: 10,
    },
    todo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    ListAboveText: {
        fontSize: 20,
        margin: 10,
    }
});
