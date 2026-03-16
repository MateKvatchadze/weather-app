const hero = document.getElementById("hero");

const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");
const weatherIcon = document.getElementById("weatherIcon");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherByHour = document.getElementById("weatherByHour");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
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

const date = document.getElementById("date");
const now = new Date();

const minutes = String(now.getMinutes()).padStart(2, 0);
const hours = now.getHours();
const month = months[now.getMonth()];
const getDay = now.getDay();
const getDate = now.getDate();

const time = `${days[getDay]}, ${getDate} ${month} ${hours}:${minutes}`;
date.textContent = time;

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const city = new FormData(e.target).get("city").trim();

  if (city === "") {
    cityInput.focus();
    return;
  }
  getWeather(city);
  getForecast(city);
});

const lastCity = localStorage.getItem("lastCity");
if (lastCity) {
  getWeather(lastCity);
  getForecast(lastCity);
}

async function getWeather(city) {
  try {
    const API_KEY = "76e7356f564c35f1586db1fd5d236438";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

    errorMessage.textContent = "";
    loadingMessage.textContent = "Loading weather...";

    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
      throw new Error("City not found");
    }
    loadingMessage.textContent = "";

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    humidity.textContent = "humidity: " + data.main.humidity;
    windSpeed.textContent = "wind speed: " + data.wind.speed;
    cityName.textContent = data.name;
    temperature.textContent = data.main.temp + "°C";
    description.textContent = "weather: " + data.weather[0].description;

    localStorage.setItem("lastCity", city);
  } catch (error) {
    loadingMessage.textContent = "";
    cityName.textContent = "";
    temperature.textContent = "";
    description.textContent = "";

    errorMessage.textContent = error.message;
    console.log(error.message);
  }
}

async function getForecast(city) {
  const API_KEY = "";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  const Weather_byHours = data.list.slice(0, 5);
  weatherByHour.innerHTML = "";
  Weather_byHours.forEach(function (item) {
    const time = item.dt_txt.split(" ")[1].slice(0, 5);
    const temp = item.main.temp;
    const humidity = item.main.humidity;
    const icon = item.weather[0].icon;

    const card = document.createElement("div");
    card.textContent = time;
    weatherByHour.append(card);
  });
}
