import React, { useState, useEffect } from 'react';
import { View, Text, Button, Touchable, TouchableOpacity, FlatList } from 'react-native';
import { doc, getDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { firestore } from '../firebase/Config';

export default function TasksFrontPage({ onSelectList }) {
    const [homeList, setHomeList] = useState([]);
    const [selectedListTasks, setSelectedListTasks] = useState([]);

    useEffect(() => {
        const fetchHomeList = async () => {
            try {
                // Haetaan tietokannasta listat, joilla isOnHomePage on true   
                const q = query(collection(firestore, 'lists'), where('isOnHomePage', '==', true));
                const querySnapshot = await getDocs(q);
                const homeListData = querySnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
                setHomeList(homeListData)
            } catch (error) {
                console.error('Error fetching home lists', error);
            }
        }

        fetchHomeList();

    }, []);

    const handleHomeListPress = async (listId) => {
        try {
            const tasks = await getTasksForList(listId);
            setSelectedListTasks(tasks);
            onSelectList(listId);
        } catch (error) {
            console.error('Error fetching tasks for selected list', error);
        }
    }

    const getTasksForList = async (listId) => {
        try {
            const q = query(collection(firestore, 'tasks'), where('listId', '==', listId));
            const querySnapshot = await getDocs(q);
            const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return tasks;
        } catch (error) {
            console.error('Error fetching tasks for list', error);
            return [];
        }
    }

    return (
        <View>
            <FlatList
                data={homeList}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleHomeListPress(item.id)}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
            />
            <FlatList 
                data={selectedListTasks}
                renderItem={({ item }) => (
                    <Text>{item.taskName}</Text>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );

}
