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

function activateStormTracker(map, infoBox, overlay) {
    fetchStormAlerts()
        .then(data => {
            const features = data.features || [];
            if (features.length > 0) {
                showStormAlerts(map, features);
                infoBox.update({
                    title: 'Storm Tracker',
                    description: `Showing ${features.length} active alerts.`
                });
                if (overlay) {
                    overlay.innerHTML = `Active alerts: ${features.length}`;
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
