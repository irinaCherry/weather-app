function getCurrentDay(fullDate) {
  let dayOfWeek = fullDate.getDay();
  let month = fullDate.getMonth();
  let day = fullDate.getDate();
  let localtime = fullDate.toLocaleTimeString("en-GB");
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${days[dayOfWeek]}, ${months[month]} ${day}, ${localtime}`;
}

function updateWeatherIcon(iconId) {
  let weatherIconElement = document.querySelector("#weather-icon");
  if (iconId === "01n") {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-moon");
  } else if (iconId === "01d") {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-sun");
  } else if (iconId === "02d") {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-cloud-sun");
  } else if (iconId === "02n") {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-cloud-moon");
  } else if (
    (iconId === "03d") |
    (iconId === "03n") |
    (iconId === "04d") |
    (iconId === "04n")
  ) {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-cloud");
  } else if ((iconId === "09d") | (iconId === "09n")) {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-cloud-showers-heavy");
  } else if (iconId === "10d") {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-cloud-sun-rain");
  } else if (iconId === "10n") {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-cloud-moon-rain");
  } else if ((iconId === "11d") | (iconId === "11n")) {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-cloud-bolt");
  } else if ((iconId === "13d") | (iconId === "13n")) {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-snowflake");
  } else if ((iconId === "50d") | (iconId === "50n")) {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-smog");
  } else {
    weatherIconElement.classList.remove(weatherIconElement.classList.item(2));
    weatherIconElement.classList.add("fa-hurricane");
  }
}

function showForecast() {
  let forecastSection = document.querySelector("#forecast-section");
  let forecastHTML = `<div class="row">`;
  let forecastDays = [
    "Sat, July 2",
    "Sun, July 3",
    "Mon, July 4",
    "Tue, July 5",
    "Wed, July 6",
  ];
  forecastDays.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `<div class="col forecast-day-weather">
                <div class="card shadow-sm rounded card-forecast">
                  <div class="card-body">
                    <h6 class="text-secondary">${day}</h6>
                    <div class="forecast-icon">
                      <i class="fa-solid fa-cloud-rain"></i>
                    </div>
                    <div class="row forecast-temp">
                      <div class="col forecast-day-night">Day:</div>
                      <div class="col forecast-degree">22 °C</div>
                    </div>
                    <div class="row forecast-temp">
                      <div class="col forecast-day-night">Night:</div>
                      <div class="col forecast-degree">17 °C</div>
                    </div>
                  </div>
                </div>
              </div>`;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastSection.innerHTML = forecastHTML;
}

function updateCurrentTemperature(response) {
  degree = Math.round(response.data.main.temp);
  document.querySelector(
    "#current-city"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector(
    "#current-weather-description"
  ).innerHTML = `${response.data.weather[0].description}`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}`;
  document.querySelector("#wind").innerHTML = `${Math.round(
    response.data.wind.speed
  )}`;
  document.querySelector("#search-city").value = "";
  if (celsiusUnits.classList.contains("active-units")) {
    updateTemperatureToCelsius();
  } else {
    updateTemperatureToFahrenheit();
  }
  updateWeatherIcon(response.data.weather[0].icon);
  showForecast();
}

function findWeatherByCoordinates(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "409663116819999f86eb04964bec2384";
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  let endPoint = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(endPoint).then(updateCurrentTemperature);
}

function startCalculationCoordinates() {
  navigator.geolocation.getCurrentPosition(findWeatherByCoordinates);
}

function findWeatherByCity(city) {
  let apiKey = "409663116819999f86eb04964bec2384";
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  let endPoint = `${apiUrl}?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(endPoint).then(updateCurrentTemperature);
}

function searchForWeather(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-city");
  findWeatherByCity(searchCity.value);
}

function updateTemperatureToFahrenheit() {
  fahrenheitUnits.classList.replace("passive-units", "active-units");
  celsiusUnits.classList.replace("active-units", "passive-units");
  document.querySelector("#degree").innerHTML = Math.round(
    (degree * 9) / 5 + 32
  );
}

function updateTemperatureToCelsius() {
  document.querySelector("#degree").innerHTML = degree;
  celsiusUnits.classList.replace("passive-units", "active-units");
  fahrenheitUnits.classList.replace("active-units", "passive-units");
}

let currentDate = new Date();
let currentDateElement = document.querySelector("#current-date");
currentDateElement.innerHTML = getCurrentDay(currentDate);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchForWeather);

let degree = null;

let celsiusUnits = document.querySelector("#celsius-units");
let fahrenheitUnits = document.querySelector("#fahrenheit-units");
fahrenheitUnits.addEventListener("click", updateTemperatureToFahrenheit);
celsiusUnits.addEventListener("click", updateTemperatureToCelsius);

let currentWeather = document.querySelector("#current-location-btn");
currentWeather.addEventListener("click", startCalculationCoordinates);
findWeatherByCity("Kyiv");
