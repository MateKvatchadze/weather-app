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
const weatherByDay = document.getElementById("weatherByDay");

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
  getForecastDay(lastCity);
});

const lastCity = localStorage.getItem("lastCity");
if (lastCity) {
  getWeather(lastCity);
  getForecast(lastCity);
  getForecastDay(lastCity);
}

async function getWeather(city) {
  try {
    const API_KEY = "";
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
  const Weather_byHours = data.list.slice(0, 6);
  weatherByHour.innerHTML = "";

  Weather_byHours.forEach(function (item) {
    const time = item.dt_txt.split(" ")[1].slice(0, 5);
    const temp = item.main.temp;
    const humidity = item.main.humidity;

    const card = document.createElement("div");
    card.classList.add("hourCard");
    const timeEl = document.createElement("p");
    const iconEl = document.createElement("img");
    const tempEl = document.createElement("p");
    const humidityEl = document.createElement("p");
    const iconCode = item.weather[0].icon;

    timeEl.textContent = time;
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
    tempEl.textContent = `${Math.round(temp)}°`;
    humidityEl.textContent = `💧 ${humidity}%`;

    const weatherMain = item.weather[0].main;

    if (weatherMain === "Clear") {
      hero.style.backgroundImage = "url(images/weather-clear.png)";
    } else if (weatherMain === "Clouds") {
      hero.style.backgroundImage = "url(images/weather-clouds.jpg)";
    } else if (weatherMain === "Rain") {
      hero.style.backgroundImage = "url(images/weather-rain.jpg)";
      hero.style.backgroundPosition = "center 70%";
    } else if (weatherMain === "Clouds") {
      hero.style.backgroundImage = "url(images/weather-clouds.jpg)";
    } else if (weatherMain === "Snow") {
      hero.style.backgroundImage = "url(images/weather-snow.jpg)";
      hero.style.backgroundPosition = "center 70%";
    } else if (weatherMain === "Thunderstorm") {
      hero.style.backgroundImage = "url(images/weather-thunderstorm.png)";
      hero.style.backgroundPosition = "center 40%";
    }
    card.append(timeEl, iconEl, tempEl, humidityEl);
    weatherByHour.append(card);
  });
}

async function getForecastDay(city) {
  const API_KEY = "";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();
  const list = data.list;

  const startIndex = list.findIndex(function (item) {
    const time = item.dt_txt.split(" ")[1];
    return time === "00:00:00";
  });
  let filteredList;
  if (startIndex === 0) {
    filteredList = list.slice(startIndex + 8);
  } else {
    filteredList = list.slice(startIndex);
  }

  const dailyList = filteredList.filter(function (item) {
    const time = item.dt_txt.split(" ")[1];
    return time === "15:00:00";
  });

  filteredList.forEach(function (item) {
    const time = item.dt_txt;
    const hours = time.split(" ")[1].slice(0, 5);
    //const day = time.split(" ")[0].slice(5, 10);

    const temp = Math.round(item.main.temp) + "°";

    const humidity = "💧 " + item.main.humidity + "%";

    const iconCode = item.weather[0].icon;

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("dayDiv");

    const timeEl = document.createElement("p");
    timeEl.textContent = hours;

    const iconEl = document.createElement("img");
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}.png`;

    const humidityEl = document.createElement("p");
    humidityEl.textContent = humidity;

    const tempEl = document.createElement("p");
    tempEl.textContent = temp;

    dayDiv.append(timeEl, iconEl, tempEl, humidityEl);
    weatherByDay.append();
  });
  console.log(filteredList);
}
