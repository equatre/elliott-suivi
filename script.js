const map = L.map('map').setView([44.45, 1.44], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Charger la trace GPX
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

// Marqueur de position
let marker = null;

function updatePosition() {
    fetch('https://elliott-suivi-backend.onrender.com/position')
        .then(response => response.json())
        .then(data => {
            const lat = parseFloat(data.lat);
            const lon = parseFloat(data.lon);

            console.log("Position reçue :", lat, lon);

            if (!marker) {
                marker = L.marker([lat, lon], { title: "Moi 🚴" }).addTo(map);
                map.setView([lat, lon], 14);
            } else {
                marker.setLatLng([lat, lon]);
            }
        })
        .catch(err => console.error("Erreur récupération position :", err));
}

updatePosition(); // appel immédiat
setInterval(updatePosition, 10000); // mise à jour toutes les 10 secondes
