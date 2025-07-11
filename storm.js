// Fetch active weather alerts from the US National Weather Service
function fetchStormAlerts() {
    const url = 'https://api.weather.gov/alerts/active';
    return fetch(url, {
        headers: {
            'Accept': 'application/geo+json'
        }
    }).then(r => r.json());
}

function showStormAlerts(map, alerts) {
    if (map.stormLayer) {
        map.removeLayer(map.stormLayer);
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

function toRad(deg) {
    return deg * (Math.PI / 180);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function getFeatureCoordinates(feature) {
    const geom = feature.geometry;
    if (!geom) return [];
    const coords = [];

    function pushCoord(c) {
        if (Array.isArray(c) && c.length >= 2) {
            coords.push([c[1], c[0]]); // [lat, lon]
        }
    }

    if (geom.type === 'Point') {
        pushCoord(geom.coordinates);
    } else if (geom.type === 'Polygon') {
        geom.coordinates.forEach(ring => ring.forEach(pushCoord));
    } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach(poly => poly.forEach(ring => ring.forEach(pushCoord)));
    } else if (geom.type === 'LineString') {
        geom.coordinates.forEach(pushCoord);
    } else if (geom.type === 'MultiLineString') {
        geom.coordinates.forEach(line => line.forEach(pushCoord));
    }

    return coords;
}

function distanceToFeature(feature, lat, lon) {
    const coords = getFeatureCoordinates(feature);
    let min = Infinity;
    for (const [clat, clon] of coords) {
        const d = haversineDistance(lat, lon, clat, clon);
        if (d < min) min = d;
    }
    return min;
}

function nearestAlertDistance(features, lat, lon) {
    let min = Infinity;
    for (const feature of features) {
        const d = distanceToFeature(feature, lat, lon);
        if (d < min) min = d;
    }
    return min;
}

function activateStormTracker(map, infoBox, overlay) {
    const center = map.getCenter();
    fetchStormAlerts()
        .then(data => {
            const features = data.features || [];
            if (features.length > 0) {
                showStormAlerts(map, features);

                const nearest = nearestAlertDistance(features, center.lat, center.lng);

                let status = '✅ No Threat';
                let desc = 'No storm alerts within a 50 mile radius.';

                if (nearest <= 25) {
                    status = '❗ High Alert';
                    desc = `Nearest storm alert is ${nearest.toFixed(1)} miles away.`;
                } else if (nearest <= 50) {
                    status = '⚠️ Low Threat';
                    desc = `Nearest storm alert is ${nearest.toFixed(1)} miles away.`;
                }

                infoBox.update({
                    title: 'Storm Tracker',
                    description: `${status} ${desc}`
                });

                if (overlay) {
                    overlay.innerHTML = `${status} ${desc}`;
                    overlay.classList.remove('hidden');
                }
            } else {
                infoBox.update({ title: 'Storm Tracker', description: 'No active alerts found.' });
                if (overlay) {
                    overlay.innerHTML = 'No active alerts found.';
                    overlay.classList.remove('hidden');
                }
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
