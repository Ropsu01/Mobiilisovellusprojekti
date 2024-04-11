import React from 'react'
import { useState, useEffect } from 'react';
import TaskListScreen from '../screens/TaskListScreen';
import { View, Text, Button, StyleSheet, TextInput, Modal, FlatList } from 'react-native';
import { addDoc, collection, onSnapshot, doc, getDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'; // Tuodaan Firestore-tietokannan toiminnot
import { firestore } from '../firebase/Config'; // Tuodaan Firestore-yhteys
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { set } from 'firebase/database';
import { Alert } from 'react-native';
import IconIonicons from 'react-native-vector-icons/Ionicons';

export default function Tasks() {
    const [isNewListModalVisible, setIsNewListModalVisible] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [lists, setLists] = useState([]);
    const navigation = useNavigation();
    const [selectedListId, setSelectedListId] = useState(null); // Uusi tila valitulle listalle

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, 'lists'), (snapshot) => {
            const listsData = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
            setLists(listsData);
        });
        return () => {
            unsubscribe();
        };
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
                        } catch (error) {
                            console.error('Error deleting list:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            {/*<Text style={[styles.tasks,  { fontWeight: 'normal', textAlign: 'center', fontSize: 24 }]}>Minun listani</Text>*/}
            <View style={[styles.listContainer, { maxHeight: lists.length > 8 ? 570 : null }]}>
                <FlatList
                    data={lists}
                    renderItem={({ item }) => (
                        <View style={styles.listContainer}>
                            <TouchableOpacity onPress={() => handleListPress(item.id)}>
                                <Text style={styles.listItem}>{item.name}</Text>
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
                <Button color={'white'} title="+" onPress={openNewListModal} />
            </View>

            <Modal
                visible={isNewListModalVisible}
                animationType='slide'
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
        bottom: 30,
        right: 35,
        backgroundColor: '#436850',
        borderRadius: 50,
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
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
});
