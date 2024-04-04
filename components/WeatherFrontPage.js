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
            setFrontTemp(json.main.temp);
            setFrontDescription(json.weather[0].description);
            setFrontIcon(api.icons + json.weather[0].icon + '@2x.png');
        })
        .catch((error) => {
            setFrontError(error.message); // Set error message in case of fetch failure
            console.error(error);
        });
    }, []);

    return (
        <View>
            {frontError ? ( // Display error message if there's an error
                <Text>{frontError}</Text>
            ) : (
                <>
                    <Text style={styles.temp}>{frontTemp}</Text>
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