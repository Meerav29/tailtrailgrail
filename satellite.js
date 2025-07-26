const SATELLITE_LAYERS = {
    esri: {
        name: 'Esri World Imagery',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    usgs: {
        name: 'USGS Imagery',
        url: 'https://basemap.nationalmap.gov/ArcGIS/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">USGS</a>'
    }
};

L.Control.SatelliteLayers = L.Control.extend({
    options: {
        position: 'topright'
    },

    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar p-2 rounded bg-gray-800 bg-opacity-80');
        L.DomEvent.disableClickPropagation(container);
        const select = L.DomUtil.create('select', 'text-black p-1 rounded', container);

        for (const key in SATELLITE_LAYERS) {
            const opt = L.DomUtil.create('option', '', select);
            opt.value = key;
            opt.textContent = SATELLITE_LAYERS[key].name;
        }

        const setLayer = (key) => {
            if (map.satelliteLayer) map.removeLayer(map.satelliteLayer);
            const info = SATELLITE_LAYERS[key];
            map.satelliteLayer = L.tileLayer(info.url, { attribution: info.attribution });
            map.satelliteLayer.addTo(map);
        };

        select.addEventListener('change', () => setLayer(select.value));

        // initialize first layer
        setLayer(select.value);

        return container;
    }
});

function activateSatelliteExplorer(map, infoBox, overlay) {
    infoBox.update({ title: 'Satellite Explorer', description: 'Browse different satellite layers.' });

    if (map.satelliteControl) {
        map.removeControl(map.satelliteControl);
    }

    map.satelliteControl = new L.Control.SatelliteLayers();
    map.addControl(map.satelliteControl);
}

window.activateSatelliteExplorer = activateSatelliteExplorer;
