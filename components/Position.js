import * as Location from 'expo-location';
import Weather from './Weather';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Position() {
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const [message, setMessage] = useState('Haetaan paikkatietoja...')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            console.log(status)
            try {
                if (status !== 'granted') {
                    setMessage('Paikkatietoja ei saatu')
                } else {
                    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
                    setLatitude(position.coords.latitude)
                    setLongitude(position.coords.longitude)
                    setMessage('Paikkatiedot saatu')
                }
                } catch (error) {
                    setMessage('Error retrieving location')
                    console.error(error)
                }
                setIsLoading(false)
            })()
    }, [])

    return (
        <View>
            {isLoading === false &&
                <Weather latitude={latitude} longitude={longitude} />
            }
        </View>
    )
}

const styles = {
    coords: {
        fontSize: 20,
        marginBottom: 10,
    },
}