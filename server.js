/* eslint-disable camelcase */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//DOTENV (read our enviroment variable)
require('dotenv').config();

// Application Dependencies
const express = require('express');
//CORS = Cross Origin Resource Sharing
const cors = require('cors');
// client-side HTTP request library
const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());


// Routes
app.get('/', homeRouteHandler);
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/parks',parksHandler);
app.get('*', notFoundHandler);



// Routes Handlers
function homeRouteHandler(request, response) {
  response.status(200).send('Your server is alive! :D');
}

//http://localhost:3000/location?city=amman
function locationHandler(req, res) {
  // get data from api server (locationIQ)
  // send a request using superagent library (request url + key)
  // console.log(req.query);
  let cityName = req.query.city;
  // console.log(cityName);
  let key = process.env.LOCATION_KEY;
  let LocURL = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;

  console.log('before superagent');
  superagent.get(LocURL) //send request to LocationIQ API
    .then(geoData => {
      console.log('inside superagent');
      // console.log(geoData.body);
      let gData = geoData.body;
      const locationData = new Location(cityName, gData);
      res.send(locationData);
      // return locationData;
    })
  // .then((locationData) => {
  //     res.send(locationData);
  // })
    .catch(error => {
      console.log('inside superagent');
      console.log('Error in getting data from LocationIQ server');
      console.error(error);
      res.send(error);
    });
  console.log('after superagent');

}
//https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY

function weatherHandler(req, res) {
  let weatherArray =[];
  // console.log(req.query);
  let cityName = req.query.search_query;
  // console.log(cityName);
  let weatherKey = process.env.WEATHER_KEY;
  let weatherURL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${cityName}&key=${weatherKey}`;
  superagent.get(weatherURL) //send request to weatherbit.io API
    .then(geoData => {
      console.log('inside superagent');
      // console.log(geoData);
      geoData.body.data.map (val => {
        const weatherData = new Weather(val);
        weatherArray.push(weatherData);
      });
      res.send(weatherArray);

    })

    .catch(error => {
      console.log('inside superagent');
      console.log('Error in getting data from weatherorbit.io server');
      console.error(error);
      res.send(error);
    });
  console.log('after superagent');
}

function parksHandler(req, res) {
  parksArray = [];
  // console.log(req.query);
  let cityName = req.query.search_query;
  // console.log(cityName);
  let parksKey = process.env.PARKS_KEY;
  let parksURL = `https://developer.nps.gov/api/v1/parks?q=${cityName}&limit=10&api_key=${parksKey}

  `;
  superagent.get(parksURL) //send request to nps.gov API
    .then(geoData => {
      console.log('inside superagent');
      // console.log(geoData.body.data);
      geoData.body.data.map (val => {
        const parksData = new Park (val);
        parksArray.push(parksData);
        // console.log(parksData);
      });
      res.send(parksArray);
      // console.log(parksData);

    })

    .catch(error => {
      console.log('inside superagent');
      console.log('Error in getting data from nps.gov server');
      console.error(error);
      res.send(error);
    });
  console.log('after superagent');
}

function notFoundHandler(req, res) {
  res.status(404).send('Error, the page you are looking for does not exist :(');
}

// Constructors:

function Location (city, locData){
  this.search_query = city;
  this.formatted_query = locData[0].display_name;
  this.latitude = locData[0].lat;
  this.longitude = locData[0].lon;
}

function Weather (weatherData){
  this.forecast = weatherData.weather.description;
  this.time = weatherData.valid_date;
}

function Park (parksData) {
  this.name = parksData.fullName;
  this.address = `${parksData.addresses[0].line1},
  ${parksData.addresses[0].city},
  ${parksData.addresses[0].stateCode},
  ${parksData.addresses[0].postalCode}`;
  this.fee = parksData.fees;
  this.description = parksData.description;
  this.url = parksData.url;
}
// // this have to be at the end so it will check if nothing above was the route:

// server.get('*',(req,res) => {
//   let errorObj = {
//     status: 500,
//     responseText: 'Sorry, Something went wrong'
//   };
//   res.status(500).send(errorObj);
// });


app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

