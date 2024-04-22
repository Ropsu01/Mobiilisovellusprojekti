import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import TaskList from '../components/TaskList'
import { useTheme } from '../contexts/ThemeContext'; // Import the theme context


export default function TaskListScreen({ route }) {
    const { listId } = route.params;

    const { theme } = useTheme(); // Use the theme context
    const isDarkMode = theme === 'dark'; // Determine if the theme is dark

    const styles = getDynamicStyles(isDarkMode);


    return (
        <View style={styles.container}>
            <TaskList listId={listId} />
        </View>
    )
}

// Define your styles using StyleSheet.create
function getDynamicStyles(isDarkMode) {
    return StyleSheet.create({
            container: {
        flex: 1, // Takes full height of the screen
        backgroundColor: isDarkMode ? '#1C1C1C' : '#F7F7F7'    }
});
}
