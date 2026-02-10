import { OPENWEATHERMAP_API_KEY } from './config.js';

export function addPrecipitationLayer(map) {
    if (!OPENWEATHERMAP_API_KEY) return null;
    if (map.precipLayer) return map.precipLayer;
    map.precipLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`,
        {
            opacity: 0.5,
            attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
        }
    );
    return map.precipLayer;
}

export function togglePrecipitationLayer(map, show) {
    const layer = addPrecipitationLayer(map);
    if (!layer) return;

    if (show) {
        if (!map.hasLayer(layer)) layer.addTo(map);
    } else {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    }
}
