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

function getTemperature(response) {
  console.log(response);
  let temperature = Math.round(response.data.main.temp);
  document.querySelector(
    "#current-city"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  document.querySelector(
    "#current-weather-description"
  ).innerHTML = `${response.data.weather[0].description}`;
  document.querySelector("#search-city").value = "";
  document.querySelector("#degree").innerHTML = temperature;
}

function calculateCoordinates(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiKey = "409663116819999f86eb04964bec2384";
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  let endPoint = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(endPoint).then(getTemperature);
}

function startCalculationCoordinates() {
  navigator.geolocation.getCurrentPosition(calculateCoordinates);
}

function showTheWeatherIntheCity(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-city");
  let apiKey = "409663116819999f86eb04964bec2384";
  let apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  let endPoint = `${apiUrl}?q=${searchCity.value}&appid=${apiKey}&units=metric`;
  axios.get(endPoint).then(getTemperature);
}

function updateTemperatureToFahrenheit() {
  fahrenheitUnits.classList.replace("passive-units", "active-units");
  celsiusUnits.classList.replace("active-units", "passive-units");
  degree.innerHTML = Math.round((degree.innerHTML * 9) / 5 + 32);
}

function updateTemperatureToCelsius() {
  degree.innerHTML = Math.round(((degree.innerHTML - 32) * 5) / 9);
  celsiusUnits.classList.replace("passive-units", "active-units");
  fahrenheitUnits.classList.replace("active-units", "passive-units");
}

let currentDate = new Date();
let currentDateElement = document.querySelector("#current-date");
currentDateElement.innerHTML = getCurrentDay(currentDate);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", showTheWeatherIntheCity);

let degree = document.querySelector("#degree");
let celsiusUnits = document.querySelector("#celsius-units");
let fahrenheitUnits = document.querySelector("#fahrenheit-units");
fahrenheitUnits.addEventListener("click", updateTemperatureToFahrenheit);
celsiusUnits.addEventListener("click", updateTemperatureToCelsius);

let currentWeather = document.querySelector("#current-location-btn");
currentWeather.addEventListener("click", startCalculationCoordinates);
startCalculationCoordinates();
