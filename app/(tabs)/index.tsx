import { StyleSheet, Alert, Image } from 'react-native'; // Added Image to the import
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import axios from 'axios';
import * as Location from 'expo-location';
import EditScreenInfo from '@/components/EditScreenInfo';
import weatherAnimal from '@/assets/images/duck.jpg';


export default function TabOneScreen() {
  const [weather, setWeather] = useState({
    temperature: null,
    feelsLike: null,
    windSpeed: null,
    description: '',
    humidity: null,
  });
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Unable to access location');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      const API_KEY = '0d1b58088896a5dac95def1747209be8';
      const { latitude, longitude } = location;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=no`;

      axios
        .get(url)
        .then((response) => {
          const data = response.data;
          setWeather({
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            windSpeed: data.wind.speed,
            description: data.weather[0].description,
            humidity: data.main.humidity,
          });
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [location]);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <>
          <Text style={styles.title}>Current Weather</Text>
          {/* Add the Image component here */}
          <Image
            source={weatherAnimal} // Replace with your desired image URL
            style={styles.image}
          />
          {weather.temperature !== null ? (
            <>
              <Text>Temperature: {weather.temperature} °C</Text>
              <Text>Feels like: {weather.feelsLike} °C</Text>
              <Text>Wind Speed: {weather.windSpeed} m/s</Text>
              <Text>Condition: {weather.description}</Text>
              <Text>Humidity: {weather.humidity}%</Text>
            </>
          ) : (
            <Text>Fetching weather data...</Text>
          )}
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <EditScreenInfo path="app/(tabs)/index.tsx" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 300, // Set the width of the image
    height: 300, // Set the height of the image
    marginVertical: 10, // Add some spacing around the image
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
