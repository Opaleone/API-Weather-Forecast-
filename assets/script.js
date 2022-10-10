var searchInput = document.querySelector('#searchbar').value;


var dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
var currentWeather = {
  temp: '',
  humidity: '',
  windSpeed: '',
  unixMeasure: ''
};

var dailyWeather = {
  temps: [],
  humidities: [],
  windSpeeds: [],
  unixMeasures: []
};

function getWeather() {
  fetch (requestUrl)
    .then (function (response) {
      return response.json();
    })
    .then (function (data) {
      console.log(data);

      currentWeather.temp = data.current.temp;
      currentWeather.humidity = data.current.humidity
      currentWeather.windSpeed = data.current.wind_speed
      currentWeather.unixMeasure = new Date(data.current.dt * 1000).toLocaleDateString('en-US');

      for (let i = 0; i < 5; i++) {
        dailyWeather.temps.push(data.daily[i].temp.day);
        dailyWeather.humidities.push(data.daily[i].humidity);
        dailyWeather.windSpeeds.push(data.daily[i].wind_speed);
        dailyWeather.unixMeasures.push(new Date(data.daily[i].dt * 1000).toLocaleDateString('en-US'));
      }
    })
}

// function displayWeather() {

// }