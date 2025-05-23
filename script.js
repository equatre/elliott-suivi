const map = L.map('map').setView([44.45, 1.44], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Charger la trace GPX avec icônes par défaut
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

// Icône personnalisée pour ta position
const positionIcon = L.icon({
    iconUrl: 'https://dgalywyr863hv.cloudfront.net/pictures/athletes/143663846/32510117/1/medium.jpg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

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

            if (lat === 0 && lon === 0) {
                console.warn("Position invalide (0,0), conservation dernière position");
                document.getElementById('status').innerText =
                    `⚠️ Dernière position conservée – ${new Date().toLocaleTimeString()}`;
                return;
            }

            lastGoodPosition = [lat, lon];
            console.log("Nouvelle position :", lat, lon);

            document.getElementById('status').innerText =
                `🛰️ Position reçue à ${new Date().toLocaleTimeString()}`;

            if (!marker) {
                marker = L.marker(lastGoodPosition, { icon: positionIcon, title: "Moi 🚴" }).addTo(map);
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

updatePosition();
setInterval(updatePosition, 10000);

document.getElementById('recenter').addEventListener('click', () => {
    if (lastGoodPosition) {
        map.setView(lastGoodPosition, 14);
    } else {
        alert("Position actuelle non disponible.");
    }
});