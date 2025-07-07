const OPENWEATHERMAP_API_KEY = '';

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

function activateWeather(map, infoBox) {
    const center = map.getCenter();
    fetchWeather(center.lat, center.lng)
        .then(data => {
            if (data && data.current_weather) {
                const w = data.current_weather;
                const desc = `Temperature: ${w.temperature}&#8451;, Wind: ${w.windspeed} km/h`;
                infoBox.update({ title: 'Real-Time Weather', description: desc });
            } else {
                infoBox.update({ title: 'Real-Time Weather', description: 'No data available.' });
            }
        })
        .catch(() => {
            infoBox.update({ title: 'Real-Time Weather', description: 'Failed to load weather data.' });
        });

    addCloudLayer(map);
}

window.activateWeather = activateWeather;
