/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
'use strict';
// start with npm init -y
const express = require('express'); // npm i express
const cors = require('cors'); // npm i cors
require('dotenv').config(); // npm i dotenv

const server = express();
const PORT = process.env.PORT || 3000;
/*PORT: .env which is 5000 in here ,if not available
PORT: Heroku PORT , if none is available
PORT: 3000 */
server.use(cors());

// Routes :
// Request: localhost:5000
// Response: /
server.get('/',(req,res) => {
  res.send('Your server is alive!');
});

server.listen (PORT,() => {

  console.log(`alive on port ${PORT}`);
});

server.get(('/location'),(req,res) => {
  //res.status(200).send('Location route');
  // fetch data from location.json
  let getLocation = require('./data/location.json');
  let locationData = new Location(getLocation);
  res.status(200).send(locationData);
  // console.log(locationData);
});

server.get(('/weather'),(req,res) => {
  // res.status(200).send('Weather route');
  let getWeather = require('./data/weather.json');
  getWeather.data.forEach (function (weather){
    let weatherData = new Weather(weather);

  });
  console.log(getWeather);
  res.status(200).send(Weather.allWeather);
  Weather.allWeather = [];

});

function Location (locData){
  this.search_query = 'Lynnwood';
  this.formatted_query = locData[0].display_name;
  this.latitude = locData[0].lat;
  this.longitude = locData[0].lon;
}

function Weather (weatherData){
  this.forecast = weatherData.weather.description;
  this.time = weatherData.valid_date;
  Weather.allWeather.push(this);
}
Weather.allWeather = [];

// this have to be at the end so it will check if nothing above was the route:
server.get('*',(req,res) => {
  let errorObj = {
    status: 500,
    responseText: 'Sorry, Something went wrong'
  };
  res.status(500).send(errorObj);
});



