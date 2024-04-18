import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext'; // Import the theme context

const api = {
    urlOneCall: process.env.EXPO_PUBLIC_API_URL, // should be the One Call API endpoint
    urlWeather: process.env.EXPO_PUBLIC_API_URL2, // should be the Weather API endpoint for city name
    key: process.env.EXPO_PUBLIC_API_KEY,
    icons: process.env.EXPO_PUBLIC_ICONS_URL,
};

export default function Weather(props) {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [hourlyForecast, setHourlyForecast] = useState([]);
    const [cityName, setCityName] = useState('');
    const [error, setError] = useState(null);

    const { theme } = useTheme(); // Use the theme context
    const isDarkMode = theme === 'dark'; // Determine if the theme is dark

    useEffect(() => {
        // Fetch city name from the Weather API 2.5
        const cityUrl = `${api.urlWeather}lat=${props.latitude}&lon=${props.longitude}&units=metric&appid=${api.key}`;
        fetch(cityUrl)
            .then(res => res.json())
            .then(data => {
                if (data && data.name) {
                    setCityName(data.name);
                } else {
                    throw new Error('City data could not be fetched');
                }
            })
            .catch(error => {
                console.error("Failed to fetch city name:", error);
                setError(error.message);
            });

        // Fetch weather data from the One Call API
        const weatherUrl = `${api.urlOneCall}lat=${props.latitude}&lon=${props.longitude}&exclude=minutely&units=metric&appid=${api.key}&lang=fi`;
        fetch(weatherUrl)
            .then(res => res.json())
            .then(json => {
                setCurrentWeather({
                    temp: Math.round(json.current.temp),
                    feelsLike: Math.round(json.current.feels_like),
                    windSpeed: json.current.wind_speed,
                    humidity: json.current.humidity,
                    description: capitalizeFirstLetter(json.current.weather[0].description),
                    iconUrl: `${api.icons}${json.current.weather[0].icon}@2x.png`,
                });
                setForecast(json.daily.slice(1, 7)); // Adjust slicing as needed
                setHourlyForecast(json.hourly.slice(0, 24));
            })
            .catch(error => {
                console.error("Failed to fetch weather data:", error);
                setError(error.message);
            });
    }, [props.latitude, props.longitude]);
    

    const styles = getDynamicStyles(isDarkMode);


    const renderHourlyHeader = () => (
        <View style={styles.forecastHeaderTextContainer}>
            <Text style={styles.forecastHeaderText}>Tunnittaiset Säätiedot</Text>
        </View>
    );

    const renderDailyHeader = () => (
        <View style={styles.forecastHeaderTextContainer}>
            <Text style={styles.forecastHeaderText}>Päivittäiset Säätiedot</Text>
        </View>
    );

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };



    const renderHourlyItem = ({ item }) => (
        <View style={styles.hourlyForecastItem}>
            <Text style={styles.text}>{capitalizeFirstLetter(new Date(item.dt * 1000).toLocaleTimeString('fi-FI', { weekday: 'long', hour: '2-digit', minute: '2-digit' }))}</Text>
            <Image
                source={{ uri: `${api.icons}${item.weather[0].icon}@2x.png` }}
                style={{ width: 50, height: 50 }}
            />
            <Text style={styles.text}>{capitalizeFirstLetter(item.weather[0].description)}</Text>
            <Text style={styles.text}>{`Lämpötila: ${Math.round(item.temp)}°C`}</Text>
            <Text style={styles.text}>{`Tuntuu kuin: ${Math.round(item.feels_like)}°C`}</Text>

        </View>
    );

    const renderDailyItem = ({ item }) => {
        const date = new Date(item.dt * 1000);
        const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('fi-FI', options);

        return (
            <View style={styles.dailyForecastItem}>
                <Text style={styles.text}>{capitalizeFirstLetter(formattedDate)}</Text>
                <Image
                    source={{ uri: `${api.icons}${item.weather[0].icon}@2x.png` }}
                    style={{ width: 50, height: 50 }}
                />
                <Text style={styles.text}>{capitalizeFirstLetter(item.weather[0].description)}</Text>
                <Text style={styles.text}>{`Lämpötila: ${Math.round(item.temp.day)}°C`}</Text>
                <Text style={styles.text}>{`Tuntuu kuin: ${Math.round(item.feels_like.day)}°C`}</Text>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            {currentWeather && (
                <View style={styles.currentWeatherContainer}>
                    <View style={styles.leftWeatherContainer}>
                    <Text style={[styles.cityName, { textAlign: 'center' }]}>{cityName}</Text>  
                        <Image
                            source={{ uri: currentWeather.iconUrl }}
                            style={styles.weatherIcon}
                        />
                                                <Text style={[styles.smallInfoText, { textAlign: 'center' }]}>{currentWeather.description}</Text>

                    </View>
                    <View style={styles.rightWeatherContainer}>
                        <Text style={styles.temperatureText}>{`${currentWeather.temp}°C`}</Text>
                        <Text style={styles.weatherText}>Tuntuu kuin: {`${currentWeather.feelsLike}°C`}</Text>
                        <Text style={styles.weatherText}>Tuuli: {`${currentWeather.windSpeed} m/s`}</Text>
                        <Text style={styles.weatherText}>Ilmankosteus: {`${currentWeather.humidity}%`}</Text>
                    </View>
                </View>
            )}
      
    
    


            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyForecastContainer}>
                {hourlyForecast.map((item) => renderHourlyItem({ item, key: item.dt }))}
            </ScrollView>

            <FlatList
                data={forecast}
                renderItem={renderDailyItem}
                keyExtractor={(item) => item.dt.toString()}
                contentContainerStyle={styles.dailyForecastContainer}

            />
        </View>
    );
}



function getDynamicStyles(isDarkMode) {
    return StyleSheet.create({
        container: {
            width: 360,
        },
        currentWeatherContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            padding: 10,
            paddingHorizontal: 25,
            borderRadius: 10,
            backgroundColor: isDarkMode ? '#000' : '#fff', // Ensure visibility
            marginBottom: 10,
        },
        leftWeatherContainer: {
            flexDirection: 'column',
            alignItems: 'center',
        },
        rightWeatherContainer: {
            flexDirection: 'column',
            marginLeft: 30,
        },
        weatherText: {
            fontSize: 18,
            marginTop: 5,
            color: isDarkMode ? '#FFF' : '#000', // Ensure visibility
        },
        temperatureText: {
            fontSize: 40,
            fontWeight: 'bold',
            marginBottom: 9,
            color: isDarkMode ? '#FFF' : '#000', // Ensure visibility
        },
        smallInfoText: {
            fontSize: 18,
            color: isDarkMode ? '#FFF' : '#000', // Ensure visibility

        },
        weatherIcon: {
            width: 80,
            height: 80,
            margin: 10,
        },
        
        hourlyForecastContainer: {
            height: 150, // Set minimum height to ensure scrollability
            backgroundColor: isDarkMode ? '#000' : '#FFF',
            borderRadius: 10,
            minWidth: 360,
            marginBottom: 10,
        },
        dailyForecastContainer: {
            maxHeight: 300, // Limit the height of the daily forecast container
            backgroundColor: isDarkMode ? '#000' : '#FFF',
            borderRadius: 10,
        },
        hourlyForecastItem: {
            alignItems: 'center', // Center items horizontally
            borderRadius: 10,
            paddingVertical: 10, // Add padding to separate items
            paddingHorizontal: 5, // Add padding to separate items
        },
        dailyForecastItem: {
            alignItems: 'center', // Center items horizontally
            borderBottomWidth: 1, // Add a border at the bottom of each daily forecast item
            paddingVertical: 10, // Vertical padding to separate items
            paddingHorizontal: 5, // Horizontal padding to separate items
        },
        headertext: {
            fontSize: 18,
            marginTop: 10,
            color: isDarkMode ? '#FFF' : '#000',
            fontWeight: 'bold',
        },
        text: {
            color: isDarkMode ? '#FFF' : '#000',  // White text in dark mode, black text in light mode
        },
        cityName: {
            fontSize: 24, // Example style, adjust accordingly
            fontWeight: 'bold',
            color: isDarkMode ? '#FFF' : '#000', // Ensure visibility
            textAlign: 'center', // Ensure alignment is visible
        },
        
    });
}