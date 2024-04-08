import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const api = {
    url: process.env.EXPO_PUBLIC_API_URL2,
    key: process.env.EXPO_PUBLIC_API_KEY2,
    icons: process.env.EXPO_PUBLIC_ICONS_URL,
};

export default function FrontWeather(props) {
    const [frontTemp, setFrontTemp] = useState(0);
    const [feels_like, setFeelsLike] = useState(0); // Declare feels_like state here
    const [frontDescription, setFrontDescription] = useState('');
    const [frontIcon, setFrontIcon] = useState('');
    const [frontError, setFrontError] = useState(null);
    const [cityName, setCityName] = useState(''); // Declare cityName state here

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    useEffect(() => {
        const url = `${api.url}lat=${props.latitude}&lon=${props.longitude}&units=metric&appid=${api.key}&lang=fi`;

        fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error('Weather data not available');
            }
            return res.json();
        })
        .then((json) => {
            console.log(json);
            setFrontTemp(Math.round(json.main.temp)); 
            setFrontDescription(capitalizeFirstLetter(json.weather[0].description)); 
            setFrontIcon(api.icons + json.weather[0].icon + '@2x.png');
            setCityName(json.name); 
            setFeelsLike(Math.round(json.main.feels_like));
        })
        .catch((error) => {
            setFrontError(error.message); 
            console.error(error);
        });

    }, [props.latitude, props.longitude]); 

    return (
    <View style={styles.container}>
        {frontError ? (
            <Text>{frontError}</Text>
        ) : (
            <>
                <View style={styles.leftContainer}>
                    <Text style={styles.city}>{cityName}</Text> 

                    {frontIcon && <Image source={{ uri: frontIcon }} style={{ width: 100, height: 100 }} />}
                    <Text style={styles.desc}>{frontDescription}</Text>
                </View>
                <View style={styles.rightContainer}>
                    <Text style={styles.temp}>Lämpötila: {`${frontTemp}°C`}</Text>
                    <Text style={styles.temp}>Tuntuu kuin: {`${feels_like}°C`}</Text>
                </View>
            </>
        )}
    </View>
);
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Set the main container's direction to row
        justifyContent: 'space-between', // Align children with space between them
        paddingHorizontal: 20, // Add horizontal padding for spacing
        marginTop: 10, // Add top margin for spacing
    },
    leftContainer: {
        flexDirection: 'column', // Set the left container's direction to column
    },
    rightContainer: {
        flexDirection: 'column', // Set the right container's direction to column
        marginLeft: 20, // Add left margin for spacing
        marginTop: 50
    },
    city: {
        fontSize: 20,
        marginBottom: 0,
        textAlign: 'center',
    },
    desc: {
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    temp: {
        fontSize: 20,
        marginBottom: 15,
    },
    weatherIcon: {
        marginBottom: 0,
        alignItems: 'center',
    },
});
