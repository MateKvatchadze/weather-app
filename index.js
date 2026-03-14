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

form.addEventListener("submit", function(e){
e.preventDefault();

const city = new FormData(e.target).get("city").trim();

if(city === "") {
  cityInput.focus();
  return;
}
getWeather(city);
});


const lastCity = localStorage.getItem("lastCity");
  if(lastCity){
    getWeather(lastCity);
}

async function getWeather(city) {
try {
 

    const API_KEY = "312f19c5ab835a8e96cd89f4b947bc7a"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
   
    errorMessage.textContent = "";
    loadingMessage.textContent = "Loading weather...";
    
    const response = await fetch(url);
    const data = await response.json();
    
    loadingMessage.textContent = "";

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
     humidity.textContent = "humidity: " + data.main.humidity;
     windSpeed.textContent = "wind speed: " + data.wind.speed;
     cityName.textContent = data.name;
    temperature.textContent = data.main.temp + "°C";
    description.textContent = "weather: " + data.weather[0].description;

    if (!response.ok) {
      throw new Error("City not found");
    }
    localStorage.setItem("lastCity", city);
   
      console.log(data);
      console.log(data.weather[0].icon)
} 
catch(error){
 
   loadingMessage.textContent = "";
   cityName.textContent = "";
   temperature.textContent = "";
   description.textContent = "";
   
   errorMessage.textContent = error.message
  console.log(error.message)
}
}
