import { OPENWEATHERMAP_API_KEY } from './config.js';

function addCloudLayer(map) {
    if (!OPENWEATHERMAP_API_KEY) return null;
    if (map.cloudLayer) return map.cloudLayer;
    map.cloudLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`,
        {
            opacity: 0.5,
            attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
        }
    ).addTo(map);
    return map.cloudLayer;
}

function addPrecipitationLayer(map) {
    if (!OPENWEATHERMAP_API_KEY) return null;
    if (map.precipLayer) return map.precipLayer;
    map.precipLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`,
        {
            opacity: 0.5,
            attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
        }
    ).addTo(map);
    return map.precipLayer;
}

function activatePrecipitation(map, infoBox, overlay) {
    addCloudLayer(map);
    addPrecipitationLayer(map);

    const desc = 'Displaying cloud and precipitation layers.';
    infoBox.update({ title: 'Precipitation Map', description: desc });

    if (overlay) {
        overlay.innerHTML = desc;
        overlay.classList.remove('hidden');
    }
}

window.activatePrecipitation = activatePrecipitation;
