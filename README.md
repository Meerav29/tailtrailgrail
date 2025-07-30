# tailtrailgrail

Map Dash is a small demo application that showcases several map-based dashboards using [Leaflet](https://leafletjs.com/) and a handful of public APIs. The project is fully static and only consists of HTML and JavaScript files, so no build step is required.

## Features

- **Real-Time Weather** – fetches the current temperature and wind information from the [Open-Meteo](https://open-meteo.com/) API. A cloud cover layer from OpenWeatherMap can be displayed when an API key is provided.
- **Satellite Explorer** – lets you switch between different satellite imagery sources such as Esri World Imagery and USGS.
- **Air Quality (AQI)** – displays the current US AQI along with PM2.5 and PM10 levels using the Open-Meteo air quality API.
- **Storm Tracker** – loads active weather alerts from the US National Weather Service and indicates how far the nearest alert is from the map center.
- **My Location** – centers the map on your current position using the browser's geolocation feature.
- **Full Screen** – toggle a distraction-free view of the map.

## Getting Started

1. Clone or download this repository.
2. Because the app is entirely static you can simply open `index.html` in your browser. If you prefer to run a local server, launch one with Python:

   ```bash
   python -m http.server
   ```

   Then navigate to <http://localhost:8000>.

## Providing an OpenWeatherMap API Key

Cloud imagery is optional. If you would like to enable it, edit `weather.js` and set `OPENWEATHERMAP_API_KEY` to your OpenWeatherMap API key:

```javascript
const OPENWEATHERMAP_API_KEY = 'YOUR_KEY_HERE';
```

Without an API key the weather dashboard still works but the cloud layer will be disabled.

## File Overview

- `index.html` – main page with all UI controls and the Leaflet map setup.
- `weather.js` – handles the real-time weather dashboard and optional cloud overlay.
- `aqi.js` – logic for the air quality dashboard.
- `storm.js` – fetches and displays storm alerts from the National Weather Service.
- `satellite.js` – adds a layer selector for various satellite imagery providers.

All dependencies are loaded via CDNs, so an internet connection is required when running the app.

## Credits

This project relies on the following services and libraries:

- [Leaflet](https://leafletjs.com/) for interactive mapping
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Open-Meteo](https://open-meteo.com/) for weather and air quality data
- [OpenWeatherMap](https://openweathermap.org/) for optional cloud cover tiles
- [US National Weather Service](https://www.weather.gov/) for storm alerts
- Various map tile providers such as Esri, USGS and EOX

## License

This project is licensed under the [MIT License](LICENSE).
