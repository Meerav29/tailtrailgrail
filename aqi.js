const OPENWEATHERMAP_API_KEY = 'YOUR_API_KEY';

// Layer to hold AQI markers
const aqiLayer = L.layerGroup();

function aqiColor(aqi) {
    switch (aqi) {
        case 1: return '#009966'; // Good
        case 2: return '#ffde33'; // Fair
        case 3: return '#ff9933'; // Moderate
        case 4: return '#cc0033'; // Poor
        case 5: return '#660099'; // Very Poor
        default: return '#7e0023';
    }
}

async function fetchPointAQI(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
        console.error('Failed to fetch AQI data', res.statusText);
        return null;
    }
    return res.json();
}

async function fetchAQIForBounds(bounds) {
    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const east = bounds.getEast();

    const midLat = (south + north) / 2;
    const midLon = (west + east) / 2;

    const points = [
        [midLat, midLon],
        [south, west],
        [south, east],
        [north, west],
        [north, east]
    ];

    const results = await Promise.all(points.map(([lat, lon]) => fetchPointAQI(lat, lon)));
    return points.map((pt, idx) => ({ lat: pt[0], lon: pt[1], data: results[idx] }));
}

async function showAQI(map, infoBox) {
    aqiLayer.clearLayers();
    const results = await fetchAQIForBounds(map.getBounds());
    results.forEach(({ lat, lon, data }) => {
        if (!data || !data.list || !data.list.length) return;
        const aqi = data.list[0].main.aqi;
        const color = aqiColor(aqi);
        const marker = L.circleMarker([lat, lon], {
            radius: 8,
            color,
            fillColor: color,
            fillOpacity: 0.7
        }).bindPopup(`AQI: ${aqi}`);
        marker.on('click', () => {
            infoBox.update({
                title: 'Air Quality Index',
                description: `AQI at this point is ${aqi}`
            });
        });
        aqiLayer.addLayer(marker);
    });
    aqiLayer.addTo(map);
    infoBox.update({
        title: 'Air Quality (AQI)',
        description: 'Click markers for more details.'
    });
}

function hideAQI(map, infoBox) {
    aqiLayer.clearLayers();
    map.removeLayer(aqiLayer);
    infoBox.update({
        title: 'Air Quality (AQI)',
        description: 'Layer hidden.'
    });
}

// Expose toggle function globally
window.toggleAQI = async function(map, infoBox) {
    if (map.hasLayer(aqiLayer)) {
        hideAQI(map, infoBox);
        return false;
    }
    await showAQI(map, infoBox);
    return true;
};
