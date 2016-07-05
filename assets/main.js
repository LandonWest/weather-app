// test weather api call:
// https://api.forecast.io/forecast/12c31783f83b5b91818735dc4805f8ae/50.103387,8.688940?exclude=[minutely,hourly,daily]&callback=?

var openCageUrl = 'https://api.opencagedata.com/geocode/v1/json?q=';
var openCageKey = "&key=755f52b62b486ed63307b81ca533352b";

var forecastUrl = 'https://api.forecast.io/forecast/'
var forecastKey = '12c31783f83b5b91818735dc4805f8ae/'
var exclude = 'exclude=[minutely,hourly,daily]'
var lat, long, temp;

// use geo-location to pull user's latitude/longitude ***Chrome >= 5.0 requires https for this to work***
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    // hard code these for testing locations (below is SanFrancisco)
    // lat = 37.781213;
    // long = -122.392647;
    getLocation();
    getWeather();
  });
} else {
    $('#weather-content').html("<p>Geolocation is not supported in this browser</p>");
}

// OpenCage api request to get city and state from browser's geocoded coordinates
function getLocation() {
  $.getJSON( openCageUrl + lat + '+' + long + openCageKey, function(response) {
    // check if the response has a 'city', 'town', 'village' or 'hamlet' and set it as the city.
    var locResponse = response.results[0].components;
    var city;
    if (locResponse.city !== undefined) {
      city = locResponse.city;
    } else if (locResponse.town !== undefined) {
      city = locResponse.town;
    } else if (locResponse.village !== undefined) {
      city = locResponse.village;
    } else {
      city = locResponse.hamlet;
    }
    // check if response has 'state' or 'state_district' and set as state.
    var state;
    if (locResponse.state !== undefined) {
      state = locResponse.state;
    } else if (locResponse.state_district !== undefined) {
      state = locResponse.state_district;
    }

    $('#location').html(city + '<br><span>' + state + '</span>');
  });
}

// Forecast.io api request for current weather based on geolocation
function getWeather() {
  $.getJSON( forecastUrl + forecastKey + lat + ',' + long + '?' + exclude + '&callback=?', function(response) {
    temp = Math.round(response.currently.temperature);
    $('#temp').html(temp + '<span class="units farh">&deg;F</span>');
    $('.wi').removeClass('wi-night-sleet').addClass('wi-forecast-io-' + response.currently.icon);
    $('#weather').html(response.currently.summary);
  });
}

// convert degrees faranheit to celcius on click and vice versa
$('#temp').on('click', '.units', function() {
  if ( $(this).hasClass('farh') ) {
    $('#temp').html( Math.round((temp -32) * 5/9) + '<span class="units celc">&deg;C</span>');
  } else {
    $('#temp').html( temp + '<span class="units farh">&deg;F</span>');
  }
});
