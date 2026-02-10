import { OPENWEATHERMAP_API_KEY } from './config.js';

export async function getWeatherData(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    try {
        const r = await fetch(url);
        return await r.json();
    } catch (e) {
        console.error("Weather fetch failed", e);
        return null;
    }
}

export function addCloudLayer(map) {
    if (!OPENWEATHERMAP_API_KEY) return null;
    if (map.cloudLayer) return map.cloudLayer;
    map.cloudLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`, {
        opacity: 0.5,
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
    });
    return map.cloudLayer;
}

export function toggleCloudLayer(map, show) {
    const layer = addCloudLayer(map);
    if (!layer) return;

    if (show) {
        if (!map.hasLayer(layer)) layer.addTo(map);
    } else {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    }
}
