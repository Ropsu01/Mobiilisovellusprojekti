import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext'; // Adjust the path if necessary


const api = {
    url: process.env.EXPO_PUBLIC_API_URL2,
    key: process.env.EXPO_PUBLIC_API_KEY2,
    icons: process.env.EXPO_PUBLIC_ICONS_URL,
};

export default function FrontWeather(props) {
    const { theme } = useTheme(); // Use the theme context
    const isDarkMode = theme === 'dark';

    const [frontTemp, setFrontTemp] = useState(0);
    const [feelsLike, setFeelsLike] = useState(0);
    const [frontDescription, setFrontDescription] = useState('');
    const [frontIcon, setFrontIcon] = useState('');
    const [frontError, setFrontError] = useState(null);
    const [cityName, setCityName] = useState('');
    const [windSpeed, setWindSpeed] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [currentTime, setCurrentTime] = useState('');

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const getCurrentTime = () => {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`; // Fixed minutes formatting
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
                setFrontTemp(Math.round(json.main.temp)); 
                setFrontDescription(capitalizeFirstLetter(json.weather[0].description)); 
                setFrontIcon(api.icons + json.weather[0].icon + '@2x.png');
                setCityName(json.name); 
                setFeelsLike(Math.round(json.main.feels_like));
                setWindSpeed(json.wind.speed);
                setHumidity(json.main.humidity);
                setCurrentTime(getCurrentTime());
            })
            .catch((error) => {
                setFrontError(error.message); 
                console.error(error);
            });

    }, [props.latitude, props.longitude]); 

    // Dynamic styles based on theme
    const containerStyle = {
        ...styles.container,
        backgroundColor: isDarkMode ? 'black' : 'white'
    };
    const textStyle = {
        color: isDarkMode ? 'white' : 'black'
    };

    return (
        <View style={containerStyle}>
            {frontError ? (
                <Text style={textStyle}>{frontError}</Text>
            ) : (
                <>
                    <View style={styles.leftContainer}>
                        <Text style={[styles.city, textStyle]}>{cityName}</Text>
                        <Text style={[styles.currentTime, textStyle]}>{currentTime}</Text>

                        {frontIcon && <Image source={{ uri: frontIcon }} style={{ width: 80, height: 80 }} />}
                        <Text style={[styles.desc, textStyle]}>{frontDescription}</Text>
                    </View>
                    <View style={styles.rightContainer}>
                        <Text style={[styles.temp1, textStyle]}>{`${frontTemp}°C`}</Text>
                        <Text style={[styles.temp, textStyle]}>Tuntuu kuin: {`${feelsLike}°C`}</Text>
                        <Text style={[styles.temp, textStyle]}>Tuuli: {`${windSpeed} m/s`}</Text>
                        <Text style={[styles.temp, textStyle]}>Ilmankosteus: {`${humidity}%`}</Text>
                    </View>
                </>
            )}
        </View>
    );
}
// Adjust your existing styles here
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        padding: 10,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    leftContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    rightContainer: {
        flexDirection: 'column',
        marginLeft: 30,
    },
    city: {
        fontSize: 20,
        marginBottom: 7,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    desc: {
        fontSize: 18,
        textAlign: 'center',
    },
    temp: {
        fontSize: 18,
        marginTop: 5,
    },
    temp1: {
        marginTop: 9,
        fontSize: 40,
        marginBottom: 9,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: 'green', // Setting the color to green

    },
    currentTime: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    weatherIcon: {
        marginTop: 10,
    },
});
