// Fonction pour afficher la météo d'une ville sur la page
function displayWeather(cityName, weatherData) {
    var searchResultsSection = document.getElementById("search-results");
    searchResultsSection.innerHTML = ""; // Effacer les résultats précédents
  
    var cityNameDate = document.createElement("p");
    cityNameDate.textContent =
      "Ville: " +
      cityName +
      " | Date: " +
      new Date(weatherData.dt * 1000).toLocaleDateString();
    searchResultsSection.appendChild(cityNameDate);
  
    var weatherIcon = document.createElement("img");
    weatherIcon.src =
      "http://openweathermap.org/img/w/" + weatherData.weather[0].icon + ".png";
    weatherIcon.alt = weatherData.weather[0].description;
    searchResultsSection.appendChild(weatherIcon);
  
    var temperature = document.createElement("p");
    temperature.textContent =
      "Température: " + (weatherData.main.temp - 273).toFixed(1) + "°C";
    searchResultsSection.appendChild(temperature);
  
    var weatherType = document.createElement("p");
    weatherType.textContent =
      "Type de météo: " + weatherData.weather[0].description;
    searchResultsSection.appendChild(weatherType);
  
    var windSpeed = document.createElement("p");
    windSpeed.textContent =
      "Vitesse du vent: " + weatherData.wind.speed + " km/h";
    searchResultsSection.appendChild(windSpeed);
  
    var precipitation = document.createElement("p");
    precipitation.textContent =
      "Précipitations: " +
      (weatherData.rain && weatherData.rain["1h"]
        ? weatherData.rain["1h"] + "mm"
        : "Pas de pluie");
    searchResultsSection.appendChild(precipitation);
  
    var humidity = document.createElement("p");
    humidity.textContent = "Humidité: " + weatherData.main.humidity + "%";
    searchResultsSection.appendChild(humidity);
  }
  