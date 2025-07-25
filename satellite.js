const SATELLITE_LAYERS = {
    esri: {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    usgs: {
        url: 'https://basemap.nationalmap.gov/ArcGIS/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">USGS</a>'
    }
};

function activateSatelliteExplorer(map, infoBox, overlay) {
    infoBox.update({ title: 'Satellite Explorer', description: 'Browse different satellite layers.' });

    if (overlay) {
        overlay.innerHTML = `
            <div class="bg-gray-800 bg-opacity-80 p-4 rounded-lg pointer-events-auto">
                <label for="satellite-select" class="block mb-2 text-white text-sm">Select Layer:</label>
                <select id="satellite-select" class="text-black p-1 rounded">
                    <option value="esri">Esri World Imagery</option>
                    <option value="usgs">USGS Imagery</option>
                </select>
            </div>
        `;
        overlay.classList.remove('hidden');
        overlay.classList.remove('pointer-events-none');
    }

    let currentLayer = map.satelliteLayer;

    function setLayer(key) {
        if (currentLayer) map.removeLayer(currentLayer);
        const info = SATELLITE_LAYERS[key];
        currentLayer = L.tileLayer(info.url, { attribution: info.attribution });
        currentLayer.addTo(map);
        map.satelliteLayer = currentLayer;
    }

    const selectEl = overlay ? overlay.querySelector('#satellite-select') : null;
    if (selectEl) {
        setLayer(selectEl.value);
        selectEl.addEventListener('change', () => setLayer(selectEl.value));
    }
}

window.activateSatelliteExplorer = activateSatelliteExplorer;
