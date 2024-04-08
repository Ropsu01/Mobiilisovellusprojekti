import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const api = {
    url: process.env.EXPO_PUBLIC_API_URL2,
    key: process.env.EXPO_PUBLIC_API_KEY2,
    icons: process.env.EXPO_PUBLIC_ICONS_URL,
};

export default function FrontWeather(props) {
    const [frontTemp, setFrontTemp] = useState(0);
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
            setFrontTemp(Math.round(json.main.temp)); // Round temperature to nearest whole number
            setFrontDescription(capitalizeFirstLetter(json.weather[0].description)); // Capitalize first letter
            setFrontIcon(api.icons + json.weather[0].icon + '@2x.png');
            setCityName(json.name); // Set the city name
        })
        .catch((error) => {
            setFrontError(error.message); // Set error message in case of fetch failure
            console.error(error);
        });
    }, [props.latitude, props.longitude]); // Include props in the dependency array if they could change

    return (
        <View>
            {frontError ? (
                <Text>{frontError}</Text>
            ) : (
                <>
                    <Text style={styles.temp}>{cityName}</Text> 
                    <Text style={styles.temp}>{`${frontTemp}°C`}</Text>
                    {frontIcon && <Image source={{ uri: frontIcon }} style={{ width: 100, height: 100 }} />}
                    <Text>{frontDescription}</Text>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    temp: {
        fontSize: 24,
        marginBottom: 10,
    },
});
