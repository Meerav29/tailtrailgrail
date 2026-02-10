const SATELLITE_LAYERS = {
    none: { name: 'Street Map' },
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

export function setSatelliteLayer(map, type) {
    // Remove existing satellite layer
    if (map.satelliteLayer) {
        map.removeLayer(map.satelliteLayer);
        map.satelliteLayer = null;
    }

    if (!type || type === 'none' || !SATELLITE_LAYERS[type]) return;

    const info = SATELLITE_LAYERS[type];
    map.satelliteLayer = L.tileLayer(info.url, { attribution: info.attribution });
    map.satelliteLayer.addTo(map);
    map.satelliteLayer.bringToBack(); // ensure it stays behind labels if we had hybrid
}
