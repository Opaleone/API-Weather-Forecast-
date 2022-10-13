
// Global Variables
var searchBtn = document.querySelector('#search-btn');

let searchBar = document.querySelector('#searchbar');

let searchHistory = document.querySelector('#city-history');

var currentCity = document.querySelector('#city-title');
var currentDate = document.querySelector('#date-today');
var currentIcon = document.querySelector('#weather-icon');
var currentTemp = document.querySelector('#current-temp');
var currentWind = document.querySelector('#current-wind');
var currentHumidity = document.querySelector('#current-humidity');

var cityName;

var count = 0;

// Local Storage Variable

var historyOfSearches = JSON.parse(localStorage.getItem('historyOfSearches'));

// Initializes variable within local storage is none exists
if (historyOfSearches === null) {
  historyOfSearches = [];

  localStorage.setItem('historyOfSearches', JSON.stringify(historyOfSearches));
}

// Creates button history from local storage array on refresh
searchHistoryButtonsOnRefresh();

// Global Variable for current weather from API
var currentWeather = {
  temp: '',
  humidity: '',
  windSpeed: '',
  unixMeasure: '',
  icon: ''
};

// Global Variable for 5 day forcast from API
var dailyWeather = {
  temps: [],
  humidities: [],
  windSpeeds: [],
  unixMeasures: [],
  icons: []
};


// Function that creates a button for each index of the array in local storage
function searchHistoryButtonsOnRefresh() {
  for (let i = 0; i < historyOfSearches.length; i++) {
    var historyBtn = document.createElement('button');

    historyBtn.setAttribute('id', 'search-btn-history')
    historyBtn.setAttribute('value', historyOfSearches[i]);

    historyBtn.textContent = historyOfSearches[i];

    searchHistory.appendChild(historyBtn);

  }
  
}

// Function to add a button to search history
function searchHistoryButtonsCreation(cityName) {

  var historyBtn = document.createElement('button');

  historyBtn.setAttribute('id', 'search-btn-history')
  historyBtn.setAttribute('value', cityName);

  historyBtn.textContent = cityName;

  searchHistory.appendChild(historyBtn);
  
}

// This function makes a call to the GeoLocator API within OpenWeathers list of API's to get Latitude, longitude from a city name
// It requires an input from the search bar to be passed in as a parameter.
function getLatLong(searchInput) {
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

// This function takes the latitude and longitude in as parameters from the getLatLon
function getWeather(lat, long) {
  fetch ('https://api.openweathermap.org/data/3.0/onecall?lat=' + lat + '&lon=' + long + '&units=imperial&appid=1ac2e1ab97a3d396986d8b6bd6516f63')
    .then (function (response) {
      return response.json();
    })
    .then (function (data) {
      console.log(data);

      // Reinitializes the weather variables to be filled with new search values
      currentWeather = {
        temp: '',
        humidity: '',
        windSpeed: '',
        unixMeasure: '',
        icon: ''
      };
      
      dailyWeather = {
        temps: [],
        humidities: [],
        windSpeeds: [],
        unixMeasures: [],
        icons: []
      };
      
      // Next five lines push current weather from response.json object to currentWeather object for later recall
      currentWeather.temp = data.current.temp;
      currentWeather.humidity = data.current.humidity;
      currentWeather.windSpeed = data.current.wind_speed;
      currentWeather.unixMeasure = new Date(data.current.dt * 1000).toLocaleDateString('en-US');
      currentWeather.icon = data.current.weather[0].icon;

      // Does the same as prior 5 lines but for each index of the dailyWeather object
      for (let i = 0; i < 6; i++) {
        dailyWeather.temps.push(data.daily[i].temp.day);
        dailyWeather.humidities.push(data.daily[i].humidity);
        dailyWeather.windSpeeds.push(data.daily[i].wind_speed);
        dailyWeather.unixMeasures.push(new Date(data.daily[i].dt * 1000).toLocaleDateString('en-US'));
        dailyWeather.icons.push(data.daily[i].weather[0].icon);
      }

      console.log(dailyWeather);
      
      // Runs display functions to display weather variables on the page
      displayCurrentWeather();
      displayDailyForecast();

      // Displays the weather section on the page
      document.querySelector('#info-display').style.display = 'flex';
    })
}

// This displays the current weather in the current weather section on the page
function displayCurrentWeather() {
  currentCity.textContent = `${cityName} (${currentWeather.unixMeasure})`
  currentIcon.src = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`
  currentTemp.textContent = `Temp: ${currentWeather.temp}°F`
  currentWind.textContent = `Wind: ${currentWeather.windSpeed} MPH`
  currentHumidity.textContent = `Humidity: ${currentWeather.humidity}%`
}

// This function displays the 5 day forecast cards on the page
function displayDailyForecast() {

  let targetEl = document.createElement('div');

  count++;
  
  for (let i = 1; i < 6; i++) {

    let forecastSection = document.querySelector('#forecast');

    let divEl = document.createElement('div');
    let h4El = document.createElement('h4');
    let imgEl = document.createElement('img');
    let pEl1 = document.createElement('p');
    let pEl2 = document.createElement('p');
    let pEl3 = document.createElement('p');

    targetEl.setAttribute('id', 'target-container');

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

    forecastSection.appendChild(targetEl);
    targetEl.appendChild(divEl);
    divEl.appendChild(h4El);
    divEl.appendChild(imgEl);
    divEl.appendChild(pEl1);
    divEl.appendChild(pEl2);
    divEl.appendChild(pEl3);
  }
}



// Event listener for search button click
searchBtn.addEventListener('click', function () {
  document.querySelector('#info-display').style.display = 'none';

  let searchInput = document.querySelector('#searchbar').value;

  // Keeps count of how many times the user has searched and removes card section if user has searched more than once.
  // Clears card section in preparation for updated weather
  if (count > 0) {
    document.querySelector('#target-container').remove()
  }

  // Stores city name that was searched by user for use later
  cityName = searchInput;

  // Checks to see if search history button has already been created 
  //If not, creates one and displays it
  if (historyBtn.includes(cityName)) {
    // Begins requests of API
    getLatLong(searchInput);
  } else {
    historyOfSearches.push(cityName);
    localStorage.setItem('historyOfScores', JSON.stringify(historyOfSearches));

    searchHistoryButtonsCreation(cityName);

    getLatLong(searchInput);
  }

})

// Event listener for Enter key on Search Bar
searchBar.addEventListener('keyup', function (event) {
  
  // Only runs the function if the key up is the Enter key
  if (event.key !== 'Enter') {
    return;
  }
  
  // Sets the weather display to hide while weather updates
  document.querySelector('#info-display').style.display = 'none';

  if (count > 0) {
    document.querySelector('#target-container').remove()
  }

  let searchInput = document.querySelector('#searchbar').value;

  cityName = searchInput;

  if (historyOfSearches.includes(cityName)) {
    getLatLong(searchInput);
  } else {
    historyOfSearches.push(cityName);
    localStorage.setItem('historyOfSearches', JSON.stringify(historyOfSearches));

    searchHistoryButtonsCreation(cityName);

    getLatLong(searchInput);
  }
})


// Event listener for click on Search History buttons
let searchBtns = document.querySelectorAll('#search-btn-history');
// Adds an event listener to each search button
for (let i = 0; i < searchBtns.length; i++) {
  searchBtns[i].addEventListener('click', function () {

    if (count > 0) {
      document.querySelector('#target-container').remove()
    }

    console.log(searchBtns[i].value);

    cityName = searchBtns[i].value;
  

    if (historyOfSearches.includes(cityName)) {
      getLatLong(cityName);
    } else {
      historyOfSearches.push(cityName);
      localStorage.setItem('historyOfSearches', JSON.stringify(historyOfSearches));

      getLatLong(cityName);
    }
  })
}
