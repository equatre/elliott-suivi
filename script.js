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
let lastGoodPosition = null;

function updatePosition() {
    fetch('https://elliott-suivi-backend.onrender.com/position')
        .then(response => {
            if (!response.ok) throw new Error("Erreur HTTP " + response.status);
            return response.json();
        })
        .then(data => {
            const lat = parseFloat(data.lat);
            const lon = parseFloat(data.lon);

            // Vérifier si la position est valide
            if (lat === 0 && lon === 0) {
                console.warn("Position invalide (0,0), conservation dernière position");
                document.getElementById('status').innerText =
                    `⚠️ Dernière position conservée – ${new Date().toLocaleTimeString()}`;
                return;
            }

            // Mise à jour de la dernière position connue
            lastGoodPosition = [lat, lon];
            console.log("Nouvelle position :", lat, lon);

            document.getElementById('status').innerText =
                `🛰️ Position reçue à ${new Date().toLocaleTimeString()}`;

            if (!marker) {
                marker = L.marker(lastGoodPosition, { title: "Moi 🚴" }).addTo(map);
                map.setView(lastGoodPosition, 14);
            } else {
                marker.setLatLng(lastGoodPosition);
            }
        })
        .catch(err => {
            console.warn("Erreur lors de la récupération de la position :", err.message);
            document.getElementById('status').innerText =
                `⚠️ Dernière position conservée – ${new Date().toLocaleTimeString()}`;
        });
}

updatePosition(); // appel immédiat
setInterval(updatePosition, 10000); // toutes les 10 secondes