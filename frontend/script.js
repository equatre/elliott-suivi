const map = L.map('map').setView([44.45, 1.44], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load GPX track
new L.GPX("cah2gene2305.gpx", {
    async: true,
    marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
    }
}).on('loaded', function(e) {
    map.fitBounds(e.target.getBounds());
}).addTo(map);

// Live tracking
let marker = L.marker([0, 0]).addTo(map);
function updatePosition() {
    fetch('https://elliott-suivi-backend.onrender.com/position')
        .then(response => response.json())
        .then(data => {
            const lat = parseFloat(data.lat);
            const lon = parseFloat(data.lon);
            marker.setLatLng([lat, lon]);
        });
}
setInterval(updatePosition, 10000);
