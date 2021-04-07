/* eslint-disable quotes */
/* eslint-disable camelcase */
/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

//DOTENV (read our enviroment variable)

require('dotenv').config();
// Application Dependencies

const express = require('express');
const pg = require('pg'); // install pg package:  npm i pg
const cors = require('cors'); //CORS = Cross Origin Resource Sharing
const superagent = require('superagent'); // client-side HTTP request library
const yelp = require( 'yelp-fusion' ); // This is needed for yelp and yelp-fusion to work!

// Application Setup
const PORT = process.env.PORT || 3000;

// const client = new pg.Client(process.env.DATABASE_URL); // adding DATABASE URL
// clients.connect(); // Activate the client
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const app = express();
app.use(cors());

// Routes
app.get('/', homeRouteHandler);
app.get('/location', locationHandler);
app.get('/showlocation', locationTableHandler);
app.get('/weather', weatherHandler);
app.get('/movies', moviesHandler);
app.get('/parks',parksHandler);
app.get('/yelp',yelpPagingHandler);
app.get('*', notFoundHandler); //error handler

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
  let key = process.env.LOCATION_KEY;
  let LocURL = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;

  console.log('before superagent');

  superagent.get(LocURL) //send request to LocationIQ API
    .then(geoData => {
      console.log('inside superagent');
      let gData = geoData.body;
      const locationData = new Location(cityName, gData);
      let SQL = `SELECT * FROM locations WHERE search_query=$1`;
      let cityValue = [cityName];
      client.query(SQL, cityValue).then(result => {
        // console.log(result);
        if (result.rowCount) {
          res.send(result.rows[0]);
        }
        else {
          let search_query= locationData.search_query;
          let formatted_query = locationData.formatted_query;
          let latitude = locationData.latitude;
          let longitude = locationData.longitude;
          SQL = `INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4) RETURNING *;`;
          let safeValues = [search_query,formatted_query,latitude,longitude];
          client.query(SQL,safeValues)
            .then(result=>{
              res.send(result.rows[0]);
            });
        }
      });
      // }
      // res.send(locationData);
    })
    .catch(error => {
      console.log('Error in getting data from LocationIQ server');
      console.error(error);
      res.send(error);
    });


  console.log('after superagent');

}
function locationTableHandler (req,res){
  let SQL = `SELECT * FROM locations;`;
  client.query(SQL)
    .then (result=>{
      res.send(result.rows);
    })
    .catch(error=>{
      res.send(error);
    });
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

function moviesHandler(req, res) {
  let moviesArray =[];
  // let cityName = req.query.query;
  let moviesKey = process.env.MOVIES_KEY;
  let moviesURL = `https://api.themoviedb.org/3/discover/movie?api_key=${moviesKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false`;
  superagent.get(moviesURL)
    .then(geoData => {
      let geoD = geoData.body.results;
      console.log('inside superagent');
      // console.log(geoD);
      geoD.map (movieValue => {
      //   for (let i in geoData){
        const moviesData = new Movie(movieValue);
        moviesArray.push(moviesData);
        // console.log(moviesData.image_url);

      });
      // console.log('movies array',moviesArray);
      res.send(moviesArray);

    })

    .catch(error => {
      console.log('inside superagent');
      console.log('Error in getting data from www.themoviedb.org server');
      console.error(error);
      res.send(error);
    });
  console.log('after superagent');
}

// to activate yelp run npm install yelp-fusion and npm i yelp.
let pageCounter =1;
function yelpPagingHandler( req, res ) {
  let yelpArr = [];
  pageCounter++;
  let cityName = req.query.search_query;
  const yelpKey = process.env.YELP_FUSION_KEY;
  const searchQuery = {};
  let displayStartingPage = 1;

  function getYelp( city,pageCounter ){
    const displayPage = 5;
    const displayStartingPage = ( ( pageCounter -1 ) * displayPage + 1 );
    searchQuery.location = city;
    searchQuery.limit = displayPage;
    searchQuery.offset = displayStartingPage;
    pageCounter++;
  }
  getYelp( cityName,pageCounter );
  const client = yelp.client( yelpKey );
  client.search( searchQuery )
    .then( ( yelpGeoData ) => {
      console.log(yelpGeoData);
      let yelpData = yelpGeoData.jsonBody.businesses;
      yelpArr = yelpData.map( ( yelpData ) => {
        return new Yelp( yelpData );
      } );
      console.log(yelpArr);
      res.send( yelpArr );
    } )
    .catch( ( error ) => {
      res.send( error );
    } );
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

function Movie (movieData){
  this.title = movieData.original_title;
  this.overview = movieData.overview;
  this.average_votes = movieData.vote_average;
  this.total_votes = movieData.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
  this.popularity = movieData.popularity;
  this.released_on = movieData.release_date;
}

function Yelp( yData ) {
  this.name = yData.name;
  this.image_url = yData.image_url;
  this.price = yData.price;
  this.rating = yData.rating;
  this.url = yData.url;
}
// // this have to be at the end so it will check if nothing above was the route:

// server.get('*',(req,res) => {
//   let errorObj = {
//     status: 500,
//     responseText: 'Sorry, Something went wrong'
//   };
//   res.status(500).send(errorObj);
// });


// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });

client.connect()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`listening on ${PORT}`)
    );
  });


