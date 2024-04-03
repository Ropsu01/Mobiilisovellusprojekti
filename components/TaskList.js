
import { View, Text, Button, StyleSheet, TextInput, FlatList, Touchable, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { firestore } from '../firebase/Config'
import { AppRegistry } from 'react-native';
import App from '../App'; // olettaen että pääkomponenttisi on App.js 
AppRegistry.registerComponent('MyApp', () => App);
import IconIonicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import DraggableFlatList from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NestableScrollContainer, NestableDraggableFlatList } from "react-native-draggable-flatlist"





export default function TaskList() {
    const [todos, setTodos] = useState([])  // Muuta tämä
    const [todo, setTodo] = useState('')
    const [draggingTaskId, setDraggingTaskId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const q = query(collection(firestore, 'todos'))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempTodos = []  // Muuta tämä

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


    const renderTodo = ({ item, index, drag }) => {
        const ref = doc(firestore, `todos/${item.id}`)
        const [isEditing, setIsEditing] = useState(false);
        const [editedText, setEditedText] = useState(item.text);

        const toggleDone = async () => {
            updateDoc(ref, { done: !item.done })
        }
        const deleteItem = async () => {
            deleteDoc(ref)
        }

        const saveEditedText = async () => {
            if (editedText.trim() !== "") {
                await updateDoc(ref, { text: editedText });
                setIsEditing(false);
            }
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
                    onLongPress={drag}
                    onPress={toggleDone}
                    style={styles.todo}
                    
                >
                    {item.done && <IconIonicons name='checkbox' size={30} color={'#1a8f3f'} />}
                    {!item.done && <IconIonicons name='square-outline' size={30} color={'#79747E'} />}
                    <Text style={styles.todoText}>{item.text}</Text>
                </TouchableOpacity>
                <IconIonicons name='trash-outline' size={21} color='#79747E' onPress={deleteItem} />
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
                <ScrollView style={styles.scrollContainer}>
                    <DraggableFlatList
                        data={todos}
                        renderItem={renderTodo}
                        keyExtractor={(item) => item.id}
                        onDragBegin={(index) => {
                            setDraggingTaskId(todos[index].id);
                            setIsDragging(true);
                        }}
                        onDragEnd={({ data }) => {
                            setTodos(data);
                            setIsDragging(false);
                        }}
                    />
                </ScrollView>
            )}
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
})