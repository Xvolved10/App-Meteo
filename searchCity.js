// Fonction pour effectuer une requête vers l'API Adresse et obtenir des suggestions de villes
function searchAddress(input) {
    var apiUrl =
      "https://api-adresse.data.gouv.fr/search/?q=" + input + "&limit=5";
  
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
  
  // Fonction pour afficher les suggestions de villes dans l'interface utilisateur
  function displayCitySuggestions(addresses) {
    var suggestionsList = document.getElementById("city-suggestions");
  
    addresses.forEach((address) => {
      var cityName = address.properties.city;
      var option = document.createElement("option");
      option.value = cityName;
      suggestionsList.appendChild(option);
    });
  }
  
  // Fonction pour effacer les suggestions de villes
  function clearCitySuggestions() {
    var suggestionsList = document.getElementById("city-suggestions");
    suggestionsList.innerHTML = "";
  }
  