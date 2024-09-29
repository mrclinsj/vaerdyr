// app.config.js
require('dotenv').config();

export default ({ config }) => ({
  ...config,
  extra: {
    openWeatherApiKey: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY, // Correctly read the API key
  },
});
