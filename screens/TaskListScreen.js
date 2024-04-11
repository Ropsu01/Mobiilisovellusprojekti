import { View, Text } from 'react-native'
import React from 'react'
import TaskList from '../components/TaskList'


export default function TaskListScreen({ route }) {
    const { listId } = route.params;


    return (
        <View>
            <TaskList listId={listId} />
        </View>
    )
}