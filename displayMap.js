// Code pour initialiser la carte Leaflet
var map = L.map("map").setView([51.505, -0.09], 2);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);
