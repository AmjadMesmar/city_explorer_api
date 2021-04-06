# city_explorer_api

Number and name of feature: Lab: 06 - Node, npm, and Express.

Estimate of time needed to complete: 2 hours

Start time: 02:00 pm

Finish time: 05:00 pm

Actual time needed to complete: 2 hours

# city_explorer_api

**Author**: Amjad Mesmar

**Version**: 3.0.0

## Overview

A city explorer application that get the city's data and it's weather forecast and time.

## Getting Started

1- create a github repo.
2- clone it to local machine.
3- create server.js file.
4- setup node_modules files by running npm init -y
5- install express,cros and dotenv by running npm i express, npm i cros, npm i dotenv
6- create .env file and write the port you want.

## Architecture

 The application uses JavaScript, npm, express and cros.
 the application is deployed on heroku.

## Change Log

04-04-2021 02:15pm - Application now has a fully-functional express server, with a GET route for the location resource.

04-04-2021 02:45pm - Application can now get the location data and display it on localhost/location.

04-04-2021 03:30pm - Application can now get the weather data and display it on localhost/weather.

04-04-2021 04:00pm - Application can handle error requests with status(500).

04-04-2021 04:15pm - Application tested and working on code fellows url.

04-04-2021 04:30pm - Application now pushed on github repo and deployed on heroku.

## Credits and Collaborations

Emran Aloul.

------------------------------------------------------------------------------------------------

# city_explorer_api

Number and name of feature: Lab 07 API

Estimate of time needed to complete: 5 hours

Start time: 02:00 pm

Finish time: 10:00 pm

Actual time needed to complete: 8 hours

# city_explorer_api

**Author**: Amjad Mesmar

**Version**: 4.0.0

## Overview

A city explorer application that get the city's data and it's weather forecast and time.

## Getting Started

1- Installed superagent using npm i superagent.
2- removed old $.ajax code.
3- created location,weather and parks handlers.
4- getting the api keys and api links for weather,location and parks.
5- creating 3 constructors for location, weather and parks.
6- linking the data in each handler using superagent.get().
7-testing the apis on the front-end website.

## Architecture

 The application uses JavaScript, npm, express and cros.
 the application is deployed on heroku.

## Change Log

05-04-2021 02:30pm - Location API is testid and running.

05-04-2021 04:00pm - Weather API is tested and running.

05-04-2021 09:00pm - Parks API tested and running.

## Credits and Collaborations

Tasnim Wheebi.

------------------------------------------------------------------------------------------------

Number and name of feature: SQL database working with API

Estimate of time needed to complete: 5 hours.

Start time:  06/04/2021 at 03:30 pm

Finish time:  07/04/2021 at 02:30 am

Actual time needed to complete: 11 hours.

# city_explorer_api

**Author**: Amjad Mesmar

**Version**: 5.0.0

## Overview

A city explorer application that get the city's data and it's weather forecast and time.

## Getting Started

1- installed pg by running npm i pg
2- created schema.sql file
3- added sql code with locations table
4- created database named cityexplorer and linked schema with using  psql -f schema.sql -d cityexplorer.
5- made location query get added to the table if it didnt exist or esle bring it from database and show it.
6- tested and working on front end website.

## Architecture

 The application uses JavaScript, npm, express and cros.
 the application is deployed on heroku.

## Change Log

06-04-2021 07:30 pm - installed a working  Database.

06-04-2021 10:00 pm - locationHandler can add new data to the table from the request query.

07-04-2021 01:00 am - added code to make query check if data exists in the locations table before adding, then show it.

## Credits and Collaborations

Tasnim Wheebi.
