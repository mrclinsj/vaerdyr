import { StyleSheet, Alert, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import axios from 'axios';
import * as Location from 'expo-location';

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

// Head
import winterHat from '@/assets/images/fox/head/winterHat.png';
import cap from '@/assets/images/fox/head/cap.png';
import scarf from '@/assets/images/fox/head/scarf.png';
import sunGlasses from '@/assets/images/fox/head/sunGlasses.png';
import blankHead from '@/assets/images/fox/head/blankHeadwear.png';

// Background
import defaultFrame from '@/assets/images/fox/body.png';
import greenGround from '@/assets/images/fox/background/greenGround.png';
import drowningWater from '@/assets/images/fox/background/drowningWater.png';
import sunShine from '@/assets/images/fox/background/lilSunshine.png';
import water from '@/assets/images/fox/background/water.png';
import snow from '@/assets/images/fox/background/snow.png';
import fallingSnow from '@/assets/images/fox/background/fallingSnow.png';
import clouds from '@/assets/images/clouds.png';
import rain from '@/assets/images/fox/background/rain.png'
import drizzle from '@/assets/images/fox/background/drizzle.png'
import defaultGRound from '@/assets/images/fox/background/defaultGround.png'
import blueGround from '@/assets/images/fox/background/blueGround.png'
import smoke from '@/assets/images/fox/background/smoke.png'
import sand from '@/assets/images/fox/background/sand.png'
import sandCloud from '@/assets/images/fox/background/sandCloud.png'
import ashCloud from '@/assets/images/fox/background/ashCloud.png'
import volcanicGround from '@/assets/images/fox/background/volcanicGround.png'




// Accessories
import waterBottle from '@/assets/images/fox/accessories/waterBottle.png';

// Chest
import puffer from '@/assets/images/fox/chest/puffer.png';
import rainCoat from '@/assets/images/fox/chest/rainCoat.png';
import singlet from '@/assets/images/fox/chest/singlet.png';
import tShirt from '@/assets/images/fox/chest/tShirt.png';
import windBreaker from '@/assets/images/fox/chest/windBreaker.png';

// Feet
import boots from '@/assets/images/fox/feet/Boots.png';
import rubberBoots from '@/assets/images/fox/feet/rubberBoots.png';
import sandals from '@/assets/images/fox/feet/sandals.png';

// Leggings
import jeans from '@/assets/images/fox/leggings/jeans.png';
import joggers from '@/assets/images/fox/leggings/joggers.png';
import rainPants from '@/assets/images/fox/leggings/rainPants.png';
import shorts from '@/assets/images/fox/leggings/shorts.png';

export default function TabOneScreen() {
  const [weather, setWeather] = useState({
    temperature: null,
    feelsLike: null,
    windSpeed: null,
    description: '',
    humidity: null,
    main: '',
    sunrise: null,
    sunset: null,
  });
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const apiKey = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

  const fetchWeatherData = async () => {
    if (location && apiKey) {
      const { latitude, longitude } = location;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=en`;
      try {
        const response = await axios.get(url);
        const data = response.data;
        setWeather({
          temperature: data.main.temp,
          feelsLike: data.main.feels_like,
          windSpeed: data.wind.speed,
          description: data.weather[0].description,
          humidity: data.main.humidity,
          main: data.weather[0].main,
          sunrise: data.sys.sunrise, // Fetch sunrise time
          sunset: data.sys.sunset,   // Fetch sunset time
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
  };

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
      fetchWeatherData();
    }
  }, [location]);


    // Function to get current time in Unix format
    const getCurrentTime = () => Math.floor(Date.now() / 1000);

    // Function to determine background color based on time of day
    const getBackgroundColor = () => {
      const currentTime = getCurrentTime();
      const { sunrise, sunset } = weather;
  
      if (sunrise && sunset) {
        if (currentTime < sunrise || currentTime > sunset) {
          return '#09011f'; // Dark blue for nighttime
        } else {
          return '#87CEEB'; // Light blue for daytime
        }
      }
  
      return '#EBCEF8'; // Default color if no data
    };

  // Function to determine text color based on time of day
  const getTextColor = () => {
    const currentTime = getCurrentTime();
    const { sunrise, sunset } = weather;

    if (sunrise && sunset) {
      if (currentTime < sunrise || currentTime > sunset) {
        return '#EBCEF8'; // White text for dark background
      } else {
        return '#09011f'; // Black text for light background
      }
    }

    return '#000000'; // Default text color
  };
  
  // Function to choose the background based on the weather
  const getBackgroundImage = () => {
    if (weather.main === 'Clear') return [sunShine];
    if (weather.main === 'Clouds') return [clouds];
    if (weather.main === 'Mist') return [clouds];
    if (weather.main === 'Haze') return [clouds];
    if (weather.main === 'Fog') return [clouds];
    if (weather.main === 'Drizzle') return [drizzle, clouds, ];
    if (weather.main === 'Rain') return [water, rain, clouds,];
    if (weather.main === 'Thunderstorm') return [drowningWater];
    if (weather.main === 'Tornado') return [drowningWater];
    if (weather.main === 'Smoke') return [ clouds];
    if (weather.main === 'Snow') return [ fallingSnow,];
    if (weather.main === 'Sand') return [sandCloud];
    if (weather.main === 'Dust') return [clouds];
    if (weather.main === 'Ash') return [ashCloud];
    if (weather.main === 'Squall') return [clouds];
    return [clouds]; // default background
  };
    // Function to choose the background based on the weather
    const getGroundImage = () => {
      if (weather.main === 'Clear' && weather.temperature !== null && weather.temperature > 0) {
        return [greenGround]; // Return both images
      }
      if (weather.main === 'Clear') return [defaultGRound];
      if (weather.main === 'Clouds') return [blueGround];
      if (weather.main === 'Mist') return [blueGround];
      if (weather.main === 'Haze') return [blueGround];
      if (weather.main === 'Fog') return [blueGround];
      if (weather.main === 'Drizzle') return [blueGround];
      if (weather.main === 'Rain') return [ blueGround ];
      if (weather.main === 'Thunderstorm') return [ drowningWater, clouds];
      if (weather.main === 'Tornado') return [ drowningWater, clouds];
      if (weather.main === 'Smoke') return [ defaultGRound, smoke, ];
      if (weather.main === 'Snow') return [snow];
      if (weather.main === 'Sand') return [sand];
      if (weather.main === 'Dust') return [sand];
      if (weather.main === 'Ash') return [volcanicGround];
      if (weather.main === 'Squall') return [blueGround];
      return [defaultGRound]; // default background
    };


  // Function to choose the right headwear
  const getHeadwear = () => {
    if (weather.temperature !== null && weather.temperature < 10) return [cap];
    if (weather.temperature !== null && weather.temperature < 5) return [scarf];
    if (weather.temperature !== null && weather.temperature < 0) return [winterHat, scarf];
    return [blankHead];
  };

  // Function to choose the right chest clothing
  const getChestWear = () => {
    if (weather.main === 'Rain') return [rainCoat];
    if (weather.windSpeed && weather.temperature !== null && weather.windSpeed > 7 && weather.temperature > 10) return [windBreaker];
    if (weather.temperature !== null && weather.temperature < 18) return [puffer];
    if (weather.temperature !== null && weather.temperature < 20) return [tShirt];
    return [singlet];
  };

  const getAccessories = () => {
    if (weather.humidity !== null && weather.humidity < 30 || weather.main === 'Clear' || weather.temperature !== null && weather.temperature > 20) return [waterBottle, sunGlasses];
    return [blankHead];
  };

  // Function to choose the right leggings
  const getLeggings = () => {
    if (weather.main === 'Rain') return [rainPants];
    if (weather.temperature !== null && weather.temperature < 10) return [joggers];
    if (weather.temperature !== null && weather.temperature < 20) return [jeans];
    return [shorts];
  };

  // Function to choose the right footwear
  const getFootwear = () => {
    if (weather.main === 'Rain') return [rubberBoots];
    if (weather.windSpeed !== null && weather.windSpeed > 4) return [rubberBoots];
    if (weather.temperature !== null && weather.temperature > 20) return [sandals];
    return [boots];
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {errorMsg ? (
        <Text style={[styles.error, { color: getTextColor() }]}>{errorMsg}</Text>
      ) : (
        <>
          <Text style={[styles.title, { color: getTextColor() }]}>{weather.main}</Text>
          <>
          {/* Map through background images */}
          {getBackgroundImage().map((bg, index) => (
            <Image key={index} source={bg} style={styles.background} />
          ))}
             {getGroundImage().map((bg, index) => (
            <Image key={index} source={bg} style={styles.ground} />
          ))}

          <Image source={defaultFrame} style={styles.responsiveImage} /> 
          {getHeadwear() && getHeadwear().map((headItem, index) => (
            <Image key={index} source={headItem} style={styles.responsiveImage} />
          ))}

          {getChestWear().map((chestItem, index) => (
            <Image key={index} source={chestItem} style={styles.responsiveImage} />
          ))}

          {getAccessories().map((accessoryItem, index) => (
            <Image key={index} source={accessoryItem} style={styles.responsiveImage} />
          ))}

          {getLeggings().map((legItem, index) => (
            <Image key={index} source={legItem} style={styles.responsiveImage} />
          ))}

          {getFootwear().map((footItem, index) => (
            <Image key={index} source={footItem} style={styles.responsiveImage} />
          ))}
          </> 
          {weather.temperature !== null ? (
            <>
            <Text style={[styles.desc, { color: getTextColor() }]}>{weather.description}</Text>
            <Text style={[styles.deg, { color: getTextColor() }]}>{weather.temperature} °C</Text>
            <Text style={[styles.deets, { color: getTextColor() }]}>Feels like: {weather.feelsLike} °C</Text>
            <Text style={[styles.deets, { color: getTextColor() }]}>Wind: {weather.windSpeed} m/s</Text>
            <Text style={[styles.deetsBottom, { color: getTextColor() }]}>Humidity: {weather.humidity}%</Text>
            </>
          ) : (
            <Text>Fetching weather data...</Text>
          )}

            <View style={styles.separator}/>
            <TouchableOpacity onPress={fetchWeatherData} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Refresh Weather</Text>
          </TouchableOpacity>
          
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
    paddingTop: 350,
    backgroundColor: '#09011f',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    position: 'absolute',
    top: 2,
    left: 8,
  },
  deets: {
    fontSize: 20,
    fontWeight: '600',
  },
  deetsBottom: {
    fontSize: 20,
    fontWeight: '600',
  },
  deg: {
    fontSize: 30,
    fontWeight: '700',
    position: 'absolute',
    top: 2,
    right: 8,
  },
  desc: {
    fontSize: 28,
    marginTop: 'auto',
    fontWeight: '700',
  },
  responsiveImage: {
    position: 'absolute',
    top: 100,
    width: screenWidth * 1, // 80% of the screen width
    height: screenWidth * 1, // Keep it square
    marginVertical: 10,
  },
  background: {
    position: 'absolute',
    top: 50,
    width: screenWidth * 1, // 90% of the screen width
    height: screenWidth * 1, // Keep it square
  },
  ground: {
    position: 'absolute',
    top: 110,
    width: screenWidth * 1, // 90% of the screen width
    height: screenWidth * 1, // Keep it square
  },
  refreshButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#D69DF1',
    borderRadius: 5,
    marginBottom: screenWidth * 0.1,
  },
  refreshButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '40%',
    backgroundColor: '#D69DF1'
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
