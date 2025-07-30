import { OPENWEATHERMAP_API_KEY } from './config.js';

function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    return fetch(url).then(r => r.json());
}

function addCloudLayer(map) {
    if (!OPENWEATHERMAP_API_KEY) return null;
    if (map.cloudLayer) return map.cloudLayer;
    map.cloudLayer = L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHERMAP_API_KEY}`, {
        opacity: 0.5,
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
    });
    map.cloudLayer.addTo(map);
    return map.cloudLayer;
}

function activateWeather(map, infoBox, overlay) {
    const center = map.getCenter();
    fetchWeather(center.lat, center.lng)
        .then(data => {
            if (data && data.current_weather) {
                const w = data.current_weather;
                const desc = `Temperature: ${w.temperature}&#8451;, Wind: ${w.windspeed} km/h`;
                infoBox.update({ title: 'Real-Time Weather', description: desc });
                if (overlay) {
                    overlay.innerHTML = desc;
                    overlay.classList.remove('hidden');
                }
            } else {
                infoBox.update({ title: 'Real-Time Weather', description: 'No data available.' });
                if (overlay) {
                    overlay.innerHTML = 'No data available.';
                    overlay.classList.remove('hidden');
                }
            }
        })
        .catch(() => {
            infoBox.update({ title: 'Real-Time Weather', description: 'Failed to load weather data.' });
            if (overlay) {
                overlay.innerHTML = 'Failed to load weather data.';
                overlay.classList.remove('hidden');
            }
        });

    if (overlay) {
        overlay.classList.remove('hidden');
    }

    addCloudLayer(map);
}

window.activateWeather = activateWeather;
