var requestUrl = ''

// var 


function getWeather() {
  fetch (requestUrl)
    .then (function (response) {
      return response.json();
    })
    .then (function (data) {
      console.log(data);

      console.log(data.daily[0].temp.day)

      // for (let i = 0; i < data.length; i++) {
      //   console.log(data.daily[i].temp.day)
      // }
    })
}