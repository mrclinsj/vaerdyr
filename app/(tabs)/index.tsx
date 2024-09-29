import { StyleSheet, Alert, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import axios from 'axios';
import * as Location from 'expo-location';
import weatherAnimal from '@/assets/images/weatherChick.png';
import sunGlasses from '@/assets/images/sunGlasses.png';
import clouds from '@/assets/images/clouds.png';
import sunShine from '@/assets/images/sunShine.png';
import winterHat from '@/assets/images/winterHat.png';
import scarf from '@/assets/images/scarf.png';

export default function TabOneScreen() {
  const [weather, setWeather] = useState({
    temperature: null,
    feelsLike: null,
    windSpeed: null,
    description: '',
    humidity: null,
    main: '',
  });
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Access the API key from environment variables
  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

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
    if (location && apiKey) {
      const { latitude, longitude } = location;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=no`;

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
            main: data.weather[0].main,
          });
        })
        .catch((error) => {
          console.error('Error fetching weather data:', error);
        });
    }
  }, [location, apiKey]);

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : (
        <>
          <Text style={styles.title}>{weather.main}</Text>
          <Image source={weatherAnimal} style={styles.image} />

          {weather.main === 'Clear' && <Image source={sunShine} style={styles.glasses} />}
          {weather.main === 'Clouds' && <Image source={clouds} style={styles.glasses} />}

          {weather.temperature !== null && weather.temperature > 20 && (
            <Image source={sunGlasses} style={styles.glasses} />
          )}
          {weather.temperature !== null && weather.temperature < 10 && (
            <Image source={winterHat} style={styles.glasses} />
          )}
          {weather.temperature !== null && weather.temperature < 5 && (
            <Image source={scarf} style={styles.glasses} />
          )}

          {weather.temperature !== null ? (
            <>
              <Text style={styles.desc}>{weather.description}</Text>
              <Text style={styles.deg}>{weather.temperature} °C</Text>
              <Text>Feels like: {weather.feelsLike} °C</Text>
              <Text>Wind Speed: {weather.windSpeed} m/s</Text>
              <Text>Humidity: {weather.humidity}%</Text>
            </>
          ) : (
            <Text>Fetching weather data...</Text>
          )}

          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
    paddingTop: 200,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  deg: {
    fontSize: 30,
    fontWeight: '700',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  desc: {
    fontSize: 24,
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 10,
    position: 'absolute',
    top: 100,
  },
  glasses: {
    width: 300,
    height: 300,
    marginVertical: 10,
    position: 'absolute',
    top: 100,
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
