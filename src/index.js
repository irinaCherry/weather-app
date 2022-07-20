function formatDate(date, type) {
  let options = {};
  if (type == 1) {
    options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
  } else {
    options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    };
  }
  return date.toLocaleString("en-US", options);
}

function updateWeatherIcon(iconId, element) {
  if (iconId === "01n") {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-moon");
  } else if (iconId === "01d") {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-sun");
  } else if (iconId === "02d") {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-cloud-sun");
  } else if (iconId === "02n") {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-cloud-moon");
  } else if (
    (iconId === "03d") |
    (iconId === "03n") |
    (iconId === "04d") |
    (iconId === "04n")
  ) {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-cloud");
  } else if ((iconId === "09d") | (iconId === "09n")) {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-cloud-showers-heavy");
  } else if (iconId === "10d") {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-cloud-sun-rain");
  } else if (iconId === "10n") {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-cloud-moon-rain");
  } else if ((iconId === "11d") | (iconId === "11n")) {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-cloud-bolt");
  } else if ((iconId === "13d") | (iconId === "13n")) {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-snowflake");
  } else if ((iconId === "50d") | (iconId === "50n")) {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-smog");
  } else {
    element.classList.remove(element.classList.item(2));
    element.classList.add("fa-hurricane");
  }
}

function showForecast(response) {
  let forecastData = response.data.daily;
  let forecastSection = document.querySelector("#forecast-section");
  let forecastHTML = `<div class="row">`;
  forecastData.forEach(function (forecastDayData, index) {
    if (index < 5) {
      let dayTemp = Math.round(forecastDayData.temp.eve);
      let nightTemp = Math.round(forecastDayData.temp.min);
      let forecastIconId = forecastDayData.weather[0].icon;
      let forecastDay = new Date(forecastDayData.dt * 1000);
      forecastHTML =
        forecastHTML +
        `<div class="col forecast-day-weather">
                <div class="card shadow-sm rounded card-forecast">
                  <div class="card-body">
                    <h6 class="text-secondary">${formatDate(
                      forecastDay,
                      1
                    )}</h6>
                    <div class="icon-block">
                      <i class="fa-solid forecast-icon" id = "forecast-icon-${index}"></i>
                    </div>  
                    <div class="row forecast-temp">
                      <div class="col forecast-day-night">Day:</div>
                      <div class="col forecast-degree">${dayTemp} °C</div>
                    </div>
                    <div class="row forecast-temp">
                      <div class="col forecast-day-night">Night:</div>
                      <div class="col forecast-degree">${nightTemp} °C</div>
                    </div>
                  </div>
                </div>
              </div>`;
      forecastIcons.push(forecastIconId);
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastSection.innerHTML = forecastHTML;
  forecastIcons.forEach(function (icon, index) {
    let elementId = document.querySelector(`#forecast-icon-${index}`);
    updateWeatherIcon(icon, elementId);
  });
}

function requestForecastData(coords, units) {
  let latitude = coords.lat;
  let longitude = coords.lon;
  let apiUrl = "https://api.openweathermap.org/data/2.5/onecall";
  let endPoint = "";
  forecastIcons = [];
  if (units == "metric") {
    endPoint = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  } else {
    endPoint = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
  }
  axios.get(endPoint).then(showForecast);
}

function updateTemperatureToFahrenheit() {
  fahrenheitUnits.classList.replace("passive-units", "active-units");
  celsiusUnits.classList.replace("active-units", "passive-units");
  requestForecastData(coordinates, "imperial");
}

function updateTemperatureToCelsius() {
  celsiusUnits.classList.replace("passive-units", "active-units");
  fahrenheitUnits.classList.replace("active-units", "passive-units");
  requestForecastData(coordinates, "metric");
}

function updateCurrentTemperature(response) {
  coordinates = response.data.coord;
  city = response.data.name;
  let cityHeading = document.querySelector("#current-city");
  let weatherDescription = document.querySelector(
    "#current-weather-description"
  );
  let humidity = document.querySelector("#humidity");
  let wind = document.querySelector("#wind");
  let weatherIconElement = document.querySelector("#weather-icon");
  let iconId = response.data.weather[0].icon;
  let temperature = document.querySelector("#degree");
  degree = Math.round(response.data.main.temp);
  cityHeading.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  weatherDescription.innerHTML = `${response.data.weather[0].description}`;
  humidity.innerHTML = `${response.data.main.humidity}`;
  wind.innerHTML = `${Math.round(response.data.wind.speed)}`;
  document.querySelector("#search-city").value = "";
  temperature.innerHTML = degree;
  if (units == "metric") {
    updateTemperatureToCelsius();
  } else {
    updateTemperatureToFahrenheit();
  }
  updateWeatherIcon(iconId, weatherIconElement);
}

function findWeatherByCoordinates(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  let endPoint = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(endPoint).then(updateCurrentTemperature);
}

function startCalculationCoordinates() {
  navigator.geolocation.getCurrentPosition(findWeatherByCoordinates);
}

function searchForWeather(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-city");
  findWeatherByCity(searchCity.value);
}

function findWeatherByCity(city) {
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  let endPoint = `${apiUrl}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(endPoint).then(updateCurrentTemperature);
}

function requestTempUpdateToFarenheit() {
  units = "imperial";
  findWeatherByCity(city);
}

function requestTempUpdateToCelsius() {
  units = "metric";
  findWeatherByCity(city);
}

let apiKey = "409663116819999f86eb04964bec2384";
let currentDateElement = document.querySelector("#current-date");
currentDateElement.innerHTML = formatDate(new Date(), 0);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchForWeather);
let city = "Kyiv";
let degree = null;
let forecastIcons = [];
let coordinates = {};
let units = "metric";
let celsiusUnits = document.querySelector("#celsius-units");
let fahrenheitUnits = document.querySelector("#fahrenheit-units");
fahrenheitUnits.addEventListener("click", requestTempUpdateToFarenheit);
celsiusUnits.addEventListener("click", requestTempUpdateToCelsius);

let currentWeather = document.querySelector("#current-location-btn");
currentWeather.addEventListener("click", startCalculationCoordinates);
findWeatherByCity(city);
