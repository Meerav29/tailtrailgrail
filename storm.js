export async function fetchStormAlerts() {
    const url = 'https://api.weather.gov/alerts/active';
    try {
        const r = await fetch(url, {
            headers: { 'Accept': 'application/geo+json' }
        });
        return await r.json();
    } catch (e) {
        console.error("Storm fetch failed", e);
        return null;
    }
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
        onEachFeature: function (feature, layer) {
            const props = feature.properties || {};
            const event = props.event || 'Alert';
            const headline = props.headline || '';
            layer.bindPopup(`<strong>${event}</strong><br>${headline}`);
        }
    });
}

export function toggleStormLayer(map, show, alertsData) {
    if (alertsData) {
        showStormAlerts(map, alertsData);
    }

    if (!map.stormLayer) return;
    if (show) {
        if (!map.hasLayer(map.stormLayer)) map.stormLayer.addTo(map);
    } else {
        if (map.hasLayer(map.stormLayer)) map.removeLayer(map.stormLayer);
    }
}

// Helper functions for distance calc
function toRad(deg) { return deg * (Math.PI / 180); }
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8;
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
        if (Array.isArray(c) && c.length >= 2) coords.push([c[1], c[0]]);
    }
    if (geom.type === 'Point') pushCoord(geom.coordinates);
    else if (geom.type === 'Polygon') geom.coordinates.forEach(r => r.forEach(pushCoord));
    else if (geom.type === 'MultiPolygon') geom.coordinates.forEach(p => p.forEach(r => r.forEach(pushCoord)));
    else if (geom.type === 'LineString') geom.coordinates.forEach(pushCoord);
    else if (geom.type === 'MultiLineString') geom.coordinates.forEach(l => l.forEach(pushCoord));
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

export function nearestAlertDistance(features, lat, lon) {
    let min = Infinity;
    for (const feature of features) {
        const d = distanceToFeature(feature, lat, lon);
        if (d < min) min = d;
    }
    return min;
}

export async function checkStormAlerts(map, email, distance) {
    try {
        const data = await fetchStormAlerts();
        const features = data.features || [];
        if (features.length === 0) return null;

        const center = map.getCenter();
        const nearest = nearestAlertDistance(features, center.lat, center.lng);

        if (nearest <= distance) {
            return {
                triggered: true,
                message: `High Alert! Storm detected ${nearest.toFixed(1)} miles away.`,
                detail: `Alert sent to ${email} (simulated).`
            };
        }
    } catch (e) {
        console.error("Alert check failed", e);
    }
    return null;
}
