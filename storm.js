// Fetch active weather alerts from the US National Weather Service
function fetchStormAlerts() {
    const url = 'https://api.weather.gov/alerts/active';
    return fetch(url, {
        headers: {
            'Accept': 'application/geo+json'
        }
    }).then(r => r.json());
}

// Calculate Haversine distance between two lat/lon pairs in miles
function haversineMiles(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth radius in miles
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
}

// Attempt to derive a representative coordinate for an alert feature
function featureCenter(feature) {
    const geom = feature.geometry;
    if (!geom) return null;
    if (geom.type === 'Point') {
        return [geom.coordinates[1], geom.coordinates[0]]; // [lat, lon]
    }
    // Handle Polygon/MultiPolygon roughly by averaging coordinates
    const coords = geom.type === 'Polygon' ? geom.coordinates[0]
        : geom.type === 'MultiPolygon' ? geom.coordinates[0][0] : null;
    if (!coords) return null;
    let lat = 0, lon = 0;
    coords.forEach(c => { lon += c[0]; lat += c[1]; });
    const count = coords.length;
    return [lat / count, lon / count];
}

function distanceToFeature(feature, lat, lon) {
    const center = featureCenter(feature);
    if (!center) return Infinity;
    return haversineMiles(lat, lon, center[0], center[1]);
}

function showStormAlerts(map, alerts) {
    if (map.stormLayer) {
        map.removeLayer(map.stormLayer);
    }
    if (!alerts || alerts.length === 0) {
        if (map.stormLayer) {
            map.removeLayer(map.stormLayer);
            delete map.stormLayer;
        }
        return;
    }
    map.stormLayer = L.geoJSON(alerts, {
        style: {
            color: 'orange',
            weight: 2,
            fillOpacity: 0.2
        },
        onEachFeature: function(feature, layer) {
            const props = feature.properties || {};
            const event = props.event || 'Alert';
            const headline = props.headline || '';
            layer.bindPopup(`<strong>${event}</strong><br>${headline}`);
        }
    }).addTo(map);
}

function activateStormTracker(map, infoBox, overlay) {
    const center = map.getCenter();
    fetchStormAlerts()
        .then(data => {
            const features = data.features || [];
            let nearest = Infinity;
            features.forEach(f => {
                const dist = distanceToFeature(f, center.lat, center.lng);
                if (dist < nearest) nearest = dist;
            });

            const localAlerts = features.filter(f =>
                distanceToFeature(f, center.lat, center.lng) <= 50
            );

            showStormAlerts(map, localAlerts);

            let label = 'No Threat';
            let emoji = '✅';
            let desc = 'No storm alerts within a 50 mile radius';

            if (nearest <= 25) {
                label = 'High Alert';
                emoji = '❗';
                desc = `Nearest storm alert is ${nearest.toFixed(1)} miles away`;
            } else if (nearest <= 50) {
                label = 'Low Threat';
                emoji = '⚠️';
                desc = `Nearest storm alert is ${nearest.toFixed(1)} miles away`;
            }

            infoBox.update({
                title: `Storm Tracker - ${label}`,
                description: desc
            });

            if (overlay) {
                overlay.innerHTML = `${emoji} ${label}<br>${desc}`;
                overlay.classList.remove('hidden');
            }
        })
        .catch(() => {
            infoBox.update({ title: 'Storm Tracker', description: 'Failed to load storm data.' });
            if (overlay) {
                overlay.innerHTML = 'Failed to load storm data.';
                overlay.classList.remove('hidden');
            }
        });

    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

window.activateStormTracker = activateStormTracker;
