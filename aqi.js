export async function getAQIData(lat, lon) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=us_aqi,pm10,pm2_5&timezone=auto`;
    try {
        const r = await fetch(url);
        return await r.json();
    } catch (e) {
        console.error("AQI fetch failed", e);
        return null;
    }
}

export function getNearestHourIndex(times) {
    if (!Array.isArray(times) || times.length === 0) return -1;
    const now = Date.now();
    let nearest = 0;
    let minDiff = Infinity;
    for (let i = 0; i < times.length; i++) {
        const diff = Math.abs(new Date(times[i]).getTime() - now);
        if (diff < minDiff) {
            minDiff = diff;
            nearest = i;
        }
    }
    return nearest;
}

export function getAQIColor(aqi) {
    if (aqi <= 50) return 'green';
    if (aqi <= 100) return 'yellow';
    if (aqi <= 150) return 'orange';
    if (aqi <= 200) return 'red';
    if (aqi <= 300) return 'purple';
    return 'maroon';
}

function updateAQILayer(map, lat, lon, aqi) {
    const color = getAQIColor(aqi);

    if (map.aqiMarker) {
        map.removeLayer(map.aqiMarker);
    }

    map.aqiMarker = L.circleMarker([lat, lon], {
        radius: 10,
        color,
        fillColor: color,
        fillOpacity: 0.5,
    });

    map.aqiMarker.bindPopup(`AQI: ${aqi}`);
}

export function toggleAQILayer(map, show, lat, lon, aqiValue) {
    // If we have new data, update the marker first
    if (typeof lat === 'number' && typeof aqiValue === 'number') {
        updateAQILayer(map, lat, lon, aqiValue);
    }

    if (!map.aqiMarker) return;

    if (show) {
        if (!map.hasLayer(map.aqiMarker)) {
            map.aqiMarker.addTo(map);
            map.aqiMarker.openPopup();
        }
    } else {
        if (map.hasLayer(map.aqiMarker)) {
            map.removeLayer(map.aqiMarker);
        }
    }
}
