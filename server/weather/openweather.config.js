import dotenv from "dotenv";

// Load environment variables from .env file
// Change the path if your .env file is located elsewhere
dotenv.config({ path: "../.env" });

import axios from "axios";

// Create an Axios instance for OpenWeather API with default parameters
const openWeatherAPI = axios.create({
  // Base URL for OpenWeather API for current weather data
  baseURL: "https://api.openweathermap.org/data/2.5",
  params: {
    appid: process.env.OPENWEATHER_API_KEY,
    units: "metric",
  },
});

export default openWeatherAPI;
