import { View, Text, Button, StyleSheet, TextInput, FlatList, Touchable, TouchableOpacity, ScrollView, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore } from '../firebase/Config'
import { AppRegistry } from 'react-native';
import App from '../App';
AppRegistry.registerComponent('MyApp', () => App);
import IconIonicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';




export default function TaskList() {
    const [todos, setTodos] = useState([]) 
    const [todo, setTodo] = useState('')
    const [editedTodo, setEditedTodo] = useState({ id: '', text: '' });
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);


    useEffect(() => {
        const q = query(collection(firestore, 'todos'))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempTodos = []  

            querySnapshot.forEach((doc) => {
                const todoObject = {
                    id: doc.id,
                    text: doc.data().text,
                    done: doc.data().done,
                    //created: convertFirebaseTimeStampToJS(doc.data().created)
                }
                tempTodos.push(todoObject)  // Muuta tämä
            })
            console.log("Fetched todos", tempTodos); // Debugging line
            setTodos(tempTodos.reverse())  // Muuta tämä
        })

        return () => {
            unsubscribe()
        }
    }, [])

    const addTodo = async () => {
        const doc = await addDoc(collection(firestore, 'todos'), { text: todo, done: false });
        setTodo('')
    }

    const editTodo = async (id) => {
        const ref = doc(firestore, `todos/${editedTodo.id}`);
        await updateDoc(ref, { text: editedTodo.text });
        setIsEditModalVisible(false);  
    }



    const openEditModal = (id, text) => {
        setEditedTodo({ id, text });
        setIsEditModalVisible(true);
    }

    const closeEditModal = () => {
        setIsEditModalVisible(false);
    }


    const renderTodo = ({ item, index }) => {
        const ref = doc(firestore, `todos/${item.id}`)

        const toggleDone = async () => {
            updateDoc(ref, { done: !item.done })
        }
        const deleteItem = async () => {
            Alert.alert(
        'Poista tehtävä',
        'Haluatko varmasti poistaa tämän tehtävän?',
        [
            {
                text: 'Peruuta',
                style: 'cancel',
            },
            {
                text: 'Poista',
                onPress: async () => {
                    await deleteDoc(ref);
                },
            },
        ],
        { cancelable: false }
    );
}

        return (
            // <View style={styles.todoContainer}>
            //     {/* <TouchableOpacity onPress={toggleDone} style={styles.todo}> */}
            //     {/* <View style={[styles.checkbox, { backgroundColor: '#ABD7AA' }]}>
            //             {item.done && <IconIonicons name="checkmark" size={20} color="black"/>}
            //         </View> */}
            //     <TouchableOpacity
            //         onLongPress={drag}
            //         onPress={toggleDone}
            //         style={styles.todo}
            // >
            <View style={[styles.todoContainer]}>
                <TouchableOpacity
                    onPress={toggleDone}
                    style={styles.todo}
                >
                    {item.done && <IconIonicons name='checkbox' size={30} color={'#1a8f3f'} />}
                    {!item.done && <IconIonicons name='square-outline' size={30} color={'#79747E'} />}
                    <Text style={styles.todoText}>{item.text}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginRight: 15}} onPress={() => openEditModal(item.id, item.text)}>
                    <IconIonicons name='create-outline' size={25} color='#79747E' />
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteItem}>
                    <IconIonicons name='trash-outline' size={25} color='#79747E' />
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput style={styles.inputText} placeholder="Lisää tehtävä" onChangeText={text => setTodo(text)} value={todo} />
                <Button style={styles.addButton} onPress={addTodo} title="Lisää" disabled={todo === ''} color={'#1a8f3f'}></Button>
            </View>

            {todos.length > 0 && (
                <FlatList
                    style={[styles.scrollContainer, { maxHeight: todos.length > 9 ? 570 : null }]}
                    data={todos}
                    renderItem={renderTodo}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={todos.length > 9}
                />
            )}
            <Modal
                visible={isEditModalVisible}
                animationType='fade'
                transparent={true}
                onRequestClose={closeEditModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.editTextInput}
                            onChangeText={(text) => setEditedTodo({ ...editedTodo, text })}
                            value={editedTodo.text}
                        />
                        <Button onPress={editTodo} title="Tallenna" />
                        <Button onPress={closeEditModal} title="Peruuta" />
                    </View>
                </View>
            </Modal>
        </GestureHandlerRootView>
    )
}


const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    inputContainer: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputText: {
        flex: 1,
        height: 45,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#79747E',
        padding: 10,
        backgroundColor: '#fff',
        marginEnd: 10,
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
    checkbox: {
        width: 27,
        height: 27,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkmark: {
        fontSize: 20,
        color: 'black', // Vaihda tämä haluamaksesi valintamerkin väriksi
    },
    addButton: {
        borderRadius: 10,
    },
    scrollContainer: {
        maxHeight: 570,
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
    editTextInput: {
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
})