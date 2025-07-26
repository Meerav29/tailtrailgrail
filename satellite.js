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
    },
    sentinel: {
        name: 'Sentinel-2 Cloudless',
        url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg',
        attribution: '&copy; <a href="https://s2maps.eu">EOX IT Services GmbH</a>'
    }
};

L.Control.SatelliteLayers = L.Control.extend({
    options: {
        position: 'topright',
        infoBox: null,
        selected: null
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar p-2 rounded-lg bg-gray-800 bg-opacity-80');
        L.DomEvent.disableClickPropagation(container);
        const select = L.DomUtil.create('select', 'bg-gray-700 text-gray-100 p-2 rounded-lg transition-colors hover:bg-gray-600', container);

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

            map.selectedSatelliteKey = key;
            map.satelliteProviderName = info.name;
            if (this.options.infoBox) {
                this.options.infoBox.update({ title: 'Satellite Explorer', description: 'Layer: ' + info.name });
            }
        };

        select.addEventListener('change', () => setLayer(select.value));

        // use previously selected key if available
        if (this.options.selected && SATELLITE_LAYERS[this.options.selected]) {
            select.value = this.options.selected;
        }

        // initialize first layer
        setLayer(select.value);

        return container;
    }
});

function activateSatelliteExplorer(map, infoBox, overlay) {
    const selected = map.selectedSatelliteKey || Object.keys(SATELLITE_LAYERS)[0];

    // the control will update the info box when setting the layer

    if (map.satelliteControl) {
        map.removeControl(map.satelliteControl);
    }

    map.satelliteControl = new L.Control.SatelliteLayers({ infoBox, selected });
    map.addControl(map.satelliteControl);
}

window.activateSatelliteExplorer = activateSatelliteExplorer;
