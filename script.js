// Fonction pour effectuer une requête vers l'API Adresse et obtenir des suggestions de villes
function searchAddress(input) {
  var apiUrl =
    "https://api-adresse.data.gouv.fr/search/?q=" + input + "&type=municipality&autocomplete=1";

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => data.features);
}

// Fonction pour récupérer les coordonnées de la ville sélectionnée
function getCityCoordinates(cityName) {
  var apiUrl =
    "https://api-adresse.data.gouv.fr/search/?q=" + cityName + "&limit=1";

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.features && data.features.length > 0) {
        return {
          lat: data.features[0].geometry.coordinates[1],
          lon: data.features[0].geometry.coordinates[0],
        };
      } else {
        throw new Error("City coordinates not found");
      }
    });
}

// Fonction pour récupérer les données météorologiques d'une ville à partir de ses coordonnées
function getWeatherData(latitude, longitude) {
  var apiKey = "0d47d640a383307597fca125db84f064";
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    apiKey;

  return fetch(apiUrl).then((response) => response.json());
}

// Fonction pour afficher la météo d'une ville sur la page
function displayWeather(cityName, weatherData) {
  var searchResultsSection = document.getElementById("search-results");
  searchResultsSection.innerHTML = ""; // Effacer les résultats précédents

  var cityNameDate = document.createElement("p");
  cityNameDate.innerHTML =
    "<span class='city-name'>" +
    cityName +
    "</span> | <span class='date'>" +
    new Date(weatherData.dt * 1000).toLocaleDateString() +
    "</span>";
  searchResultsSection.appendChild(cityNameDate);

  var weatherIcon = document.createElement("img");
  weatherIcon.src =
    "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png";
  weatherIcon.alt = weatherData.weather[0].description;
  weatherIcon.classList.add("weather-icon"); // Ajoutez la classe pour l'icône météo
  searchResultsSection.appendChild(weatherIcon);

  var temperature = document.createElement("p");
  temperature.textContent =
    (weatherData.main.temp - 273.15).toFixed(1) + "°C";
  temperature.classList.add("temperature"); // Ajoutez la classe pour la température
  searchResultsSection.appendChild(temperature);

  // Traduction des descriptions météorologiques
  var weatherDescriptions = {
    "clear sky": "Ciel dégagé",
    "few clouds": "Quelques nuages",
    "scattered clouds": "Nuages épars",
    "broken clouds": "Très nuageux",
    "shower rain": "Averses",
    "rain": "Pluie",
    "thunderstorm": "Orage",
    "snow": "Neige",
    "mist": "Brume",
    // Ajoutez d'autres descriptions selon vos besoins
  };
  var weatherDescription = weatherData.weather[0].description;
  if (weatherDescriptions.hasOwnProperty(weatherDescription)) {
    weatherDescription = weatherDescriptions[weatherDescription];
  }

  var weatherType = document.createElement("p");
  weatherType.textContent =  weatherDescription;
  weatherType.classList.add("weather-info"); // Ajoutez la classe pour le type de météo
  searchResultsSection.appendChild(weatherType);

  var windSpeed = document.createElement("p");
  windSpeed.innerHTML =
    "<img src='./assets/img/wind.png'>" + // Ajouter l'icône du vent
    " Vent: " + (weatherData.wind.speed).toFixed(1) + " km/h";
  windSpeed.classList.add("windSpeed"); // Ajoutez la classe pour la vitesse du vent
  searchResultsSection.appendChild(windSpeed);

  var precipitation = document.createElement("p");
  precipitation.innerHTML =
    "<img src='./assets/img/rain.png'>" + // Ajouter l'icône des précipitations
    " Précipitations: " +
    (weatherData.rain && weatherData.rain["1h"]
      ? ((weatherData.rain["1h"] / 10) * 100).toFixed(1) + "%"
      : "0%");
  precipitation.classList.add("precipitation"); // Ajoutez la classe pour les précipitations
  searchResultsSection.appendChild(precipitation);

  var humidity = document.createElement("p");
  humidity.innerHTML =
    "<img src='./assets/img/humidity.png'>" + // Ajouter l'icône de l'humidité
    " Humidité: " + weatherData.main.humidity + "%";
  humidity.classList.add("humidity"); // Ajoutez la classe pour l'humidité
  searchResultsSection.appendChild(humidity);

  // Ajout de la classe ou de l'ID à la section search-results
  searchResultsSection.classList.add("search-results-visible");
}

// Fonction pour afficher les suggestions de villes dans l'interface utilisateur
function displayCitySuggestions(addresses) {
  var suggestionsList = document.getElementById("city-suggestions");
  suggestionsList.innerHTML = ""; // Effacer les suggestions précédentes

  var uniqueCities = {};

  addresses.forEach((address) => {
    var cityName = address.properties.city;
    var postalCode = address.properties.postcode;
    var key = cityName + " - " + postalCode;

    // Vérifier si la ville n'a pas déjà été ajoutée
    if (!uniqueCities[key]) {
      var option = document.createElement("option");
      option.value = key;
      suggestionsList.appendChild(option);
      uniqueCities[key] = true;
    }
  });
}


// Fonction pour effacer les suggestions de villes
function clearCitySuggestions() {
  var suggestionsList = document.getElementById("city-suggestions");
  suggestionsList.innerHTML = "";
}

// Code pour initialiser la carte Leaflet avec la position initiale
var map = L.map("map").setView([47.856944, 1.351389], 5);

// Ajout du fond de carte OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Création d'un groupe de marqueurs
var markerCluster = L.markerClusterGroup();

// Fonction principale pour rechercher une ville, afficher la météo et les marqueurs sur la carte
function searchAndDisplay() {
  var searchInput = document.getElementById("city-input").value;

  var searchResultsSection = document.getElementById("search-results");
  var searchMessage = document.getElementById("search-message");

  // Vérification de nullité pour l'élément "search-message"
  if (searchMessage) {
    searchMessage.style.display = "block"; // Afficher le message de recherche
  }

  // Recherche d'adresses correspondant à l'entrée utilisateur
  searchAddress(searchInput)
    .then((addresses) => {
      clearCitySuggestions();
      displayCitySuggestions(addresses);

      if (addresses.length > 0) {
        // Vérification de nullité pour l'élément "search-message"
        if (searchMessage) {
          searchMessage.style.display = "none"; // Cacher le message de recherche
        }
        return getCityCoordinates(addresses[0].properties.city);
      } else {
        throw new Error("No cities found");
      }
    })
    .then((coordinates) => {
      console.log("Coordinates:", coordinates); // Débogage

      getWeatherData(coordinates.lat, coordinates.lon)
        .then((weatherData) => {
          displayWeather(weatherData.name, weatherData);

          // Création du marqueur
          var marker = L.marker([coordinates.lat, coordinates.lon])
            .bindPopup(
              "<b>Ville:</b> " +
              weatherData.name +
              "<br><b>Température:</b> " +
              (weatherData.main.temp - 273).toFixed(1) +
              "°C"
            );

          // Ajout du marqueur au groupe de marqueurs
          markerCluster.addLayer(marker);

          // Ajout du groupe de marqueurs à la carte
          map.addLayer(markerCluster);

          // Centrer et zoomer sur le marqueur
          map.setView([coordinates.lat, coordinates.lon], 7);
        });
    })
    .catch((error) => console.error("Error:", error));
}

// Fonction pour attacher un événement de saisie à l'élément d'entrée de la ville
document.getElementById("city-input").addEventListener("input", function () {
  var searchInput = this.value;

  // Recherche d'adresses correspondant à l'entrée utilisateur
  searchAddress(searchInput)
    .then((addresses) => {
      displayCitySuggestions(addresses);
    })
    .catch((error) => console.error("Error:", error));
});

