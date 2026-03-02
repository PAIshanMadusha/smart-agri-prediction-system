import openWeatherAPI from "../weather/openweather.config.js";

export const getWeatherData = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    // Validate latitude and longitude
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Check if latitude and longitude are valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude!",
      });
    }

    // Fetch weather data from OpenWeather API
    const response = await openWeatherAPI.get("/weather", {
      params: { lat: latitude, lon: longitude },
    });

    // Extract relevant weather data from the API response
    const data = response.data;

    res.status(200).json({
      success: true,
      weather: {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        feelsLike: data.main.feels_like,
        description: data.weather[0].description,
        windSpeed: data.wind.speed,
        cloudCoverage: data.clouds.all,
        rainfallLastHour: data.rain?.["1h"] || 0,
        city: data.name,
      },
    });
  } catch (error) {
    console.error("Weather error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch weather data. Please try again later!",
    });
  }
};
