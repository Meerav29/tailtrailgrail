function fetchAQI(lat, lon) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi,pm10,pm2_5`;
    return fetch(url).then(r => r.json());
}

function getAQIColor(aqi) {
    if (aqi <= 50) return 'green';
    if (aqi <= 100) return 'yellow';
    if (aqi <= 150) return 'orange';
    if (aqi <= 200) return 'red';
    if (aqi <= 300) return 'purple';
    return 'maroon';
}

function showAQIMarker(map, lat, lon, aqi) {
    const color = getAQIColor(aqi);
    if (map.aqiMarker) {
        map.removeLayer(map.aqiMarker);
    }
    map.aqiMarker = L.circleMarker([lat, lon], {
        radius: 10,
        color,
        fillColor: color,
        fillOpacity: 0.5,
    }).addTo(map);
    map.aqiMarker.bindPopup(`AQI: ${aqi}`).openPopup();
}

function activateAQI(map, infoBox, overlay) {
    const center = map.getCenter();
    fetchAQI(center.lat, center.lng)
        .then(data => {
            const aqi = data?.hourly?.us_aqi?.[0];
            const pm25 = data?.hourly?.pm2_5?.[0];
            const pm10 = data?.hourly?.pm10?.[0];
            if (typeof aqi === 'number') {
                const desc = `US AQI: ${aqi}, PM2.5: ${pm25} µg/m³, PM10: ${pm10} µg/m³`;
                infoBox.update({ title: 'Air Quality (AQI)', description: desc });
                showAQIMarker(map, center.lat, center.lng, aqi);
                if (overlay) {
                    overlay.innerHTML = desc;
                    overlay.classList.remove('hidden');
                }
            } else {
                infoBox.update({ title: 'Air Quality (AQI)', description: 'No data available.' });
                if (overlay) {
                    overlay.innerHTML = 'No data available.';
                    overlay.classList.remove('hidden');
                }
            }
        })
        .catch(() => {
            infoBox.update({ title: 'Air Quality (AQI)', description: 'Failed to load air quality data.' });
            if (overlay) {
                overlay.innerHTML = 'Failed to load air quality data.';
                overlay.classList.remove('hidden');
            }
        });

    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

window.activateAQI = activateAQI;
