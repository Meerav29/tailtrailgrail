const SATELLITE_LAYERS = {
    none: { name: 'Street Map' },
    esri: {
        name: 'Esri World Imagery',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    usgs: {
        name: 'USGS Topo',
        url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">USGS</a>',
        maxNativeZoom: 16
    },
    sentinel: {
        name: 'Sentinel-2 Cloudless',
        url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg',
        attribution: '&copy; <a href="https://s2maps.eu">EOX IT Services GmbH</a>',
        maxNativeZoom: 18,
        updateWhenIdle: true
    }
};

export function setSatelliteLayer(map, type) {
    // Remove existing satellite layer
    if (map.satelliteLayer) {
        map.removeLayer(map.satelliteLayer);
        map.satelliteLayer = null;
    }

    // Show or hide the CartoDB street base layer
    if (map._cartoBaseLayer) {
        if (!type || type === 'none') {
            if (!map.hasLayer(map._cartoBaseLayer)) map._cartoBaseLayer.addTo(map);
        } else {
            if (map.hasLayer(map._cartoBaseLayer)) map.removeLayer(map._cartoBaseLayer);
        }
    }

    if (!type || type === 'none' || !SATELLITE_LAYERS[type]) return;

    const info = SATELLITE_LAYERS[type];
    const options = { attribution: info.attribution };
    if (info.maxNativeZoom) options.maxNativeZoom = info.maxNativeZoom;
    if (info.updateWhenIdle) options.updateWhenIdle = info.updateWhenIdle;
    map.satelliteLayer = L.tileLayer(info.url, options);
    map.satelliteLayer.addTo(map);
}
