import { View, Text } from 'react-native'
import React from 'react'
import TaskList from '../components/TaskList'

export default function Tasks() {
//   return (
//     <NavigationContainer>
//       <StackActions.Navigator>
//         <StackActions.Screen name="Tehtäväni" component={TaskList} />
//       </StackActions.Navigator>
//     </NavigationContainer>
//   )
// }
return (
    <View>
        <TaskList />
    </View>
)
}
