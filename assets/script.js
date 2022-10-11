var searchBtn = document.querySelector('#search-btn');

let searchInput = document.querySelector('#searchbar').value;

var currentCity = document.querySelector('#city-title');
var currentDate = document.querySelector('#date-today');
var currentIcon = document.querySelector('#weather-icon');
var currentTemp = document.querySelector('#current-temp');
var currentWind = document.querySelector('#current-wind');
var currentHumidity = document.querySelector('#current-humidity');


// var requestUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + long + '&units=imperial&appid=1ac2e1ab97a3d396986d8b6bd6516f63';
// var latLong = 'https://api.openweathermap.org/geo/1.0/direct?q=Austin&limit=1&appid=1ac2e1ab97a3d396986d8b6bd6516f63';
// https://api.openweathermap.org/data/3.0/onecall?lat=30.266666&lon=-97.733330&units=imperial&appid=1ac2e1ab97a3d396986d8b6bd6516f63;
// http://openweathermap.org/img/wn/10d@2x.png


var currentWeather = {
  temp: '',
  humidity: '',
  windSpeed: '',
  unixMeasure: '',
  icon: ''
};

var dailyWeather = {
  temps: [],
  humidities: [],
  windSpeeds: [],
  unixMeasures: [],
  icons: []
};


function getLatLong(searchInput) {

  // let forecastSection = document.querySelector('#forecast');

  // let h1El = document.createElement('h1');

  // h1El.setAtrribute('id', 'loading');

  // h1El.textContent = 'Loading...'

  // forecastSection.appendChild(h1El);


  fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + searchInput + '&limit=1&appid=1ac2e1ab97a3d396986d8b6bd6516f63')
  .then (function(response) {
    return response.json();
  })
  .then (function(data) {
    console.log(data)
    
    let lat = data[0].lat;
    let long = data[0].lon;
    
    getWeather(lat, long);
  })
}

function getWeather(lat, long) {
  fetch ('https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + long + '&units=imperial&appid=1ac2e1ab97a3d396986d8b6bd6516f63')
    .then (function (response) {
      return response.json();
    })
    .then (function (data) {
      console.log(data);

      currentWeather.temp = data.current.temp;
      currentWeather.humidity = data.current.humidity;
      currentWeather.windSpeed = data.current.wind_speed;
      currentWeather.unixMeasure = new Date(data.current.dt * 1000).toLocaleDateString('en-US');
      currentWeather.icon = data.current.weather[0].icon;

      for (let i = 0; i < 6; i++) {
        dailyWeather.temps.push(data.daily[i].temp.day);
        dailyWeather.humidities.push(data.daily[i].humidity);
        dailyWeather.windSpeeds.push(data.daily[i].wind_speed);
        dailyWeather.unixMeasures.push(new Date(data.daily[i].dt * 1000).toLocaleDateString('en-US'));
        dailyWeather.icons.push(data.daily[i].weather[0].icon);
      }

      displayCurrentWeather();
      displayDailyForecast();

      

      document.querySelector('#info-display').style.display = 'flex';
    })
}


function displayCurrentWeather() {
  currentCity.textContent = `${searchInput} (${currentWeather.unixMeasure})`
  currentIcon.src = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`
  currentTemp.textContent = `Temp: ${currentWeather.temp}°F`
  currentWind.textContent = `Wind: ${currentWeather.windSpeed} MPH`
  currentHumidity.textContent = `Humidity: ${currentWeather.humidity}%`
}

function displayDailyForecast() {


  
  for (let i = 1; i < 6; i++) {

    let forecastSection = document.querySelector('#forecast');

    let divEl = document.createElement('div');
    let h4El = document.createElement('h4');
    let imgEl = document.createElement('img');
    let pEl1 = document.createElement('p')
    let pEl2 = document.createElement('p')
    let pEl3 = document.createElement('p')

    divEl.setAttribute('class', 'forecast-card');

    h4El.setAttribute('id', 'forecast-date');
    imgEl.setAttribute('id', 'forecast-icon')
    pEl1.setAttribute('id', 'temperature');
    pEl2.setAttribute('id', 'wind');
    pEl3.setAttribute('id', 'humidity');

    h4El.textContent = dailyWeather.unixMeasures[i];
    imgEl.src = `http://openweathermap.org/img/wn/${dailyWeather.icons[i]}@2x.png`
    pEl1.textContent = `Temp: ${dailyWeather.temps[i]}°F`
    pEl2.textContent = `Wind: ${dailyWeather.windSpeeds[i]} MPH`
    pEl3.textContent = `Humidity: ${dailyWeather.humidities[i]}%`

    forecastSection.appendChild(divEl);
    divEl.appendChild(h4El);
    divEl.appendChild(imgEl);
    divEl.appendChild(pEl1);
    divEl.appendChild(pEl2);
    divEl.appendChild(pEl3);
  }
}

// function searchHistory() {

// }

searchBtn.addEventListener('click', function () {
  let searchInput = document.querySelector('#searchbar').value;

  getLatLong(searchInput);
})
