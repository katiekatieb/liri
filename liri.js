require("dotenv").config();
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var axios = require('axios');
var fs = require('fs');
var moment = require('moment');;
var spotify = new Spotify(keys.spotify);


var action = process.argv[2];


var nodeArgs = process.argv;
var search = "";
for(var i = 3; i < nodeArgs.length; i++){
  if(i > 3 && i < nodeArgs.length){
    search = search + '+' + nodeArgs[i];
  } else{
    search += nodeArgs[i];
  }
};

switch (action) {
case "spotify-this-song":
  spotifyThisSong(search);
  break;

case "concert-this":
  concertThis(search);
  break;

case "movie-this":
  movieThis(search);
  break;

case "do-what-it-says":
  doWhatItSays(search);
  break;
}

//node liri.js spotify-this-song simple song
function spotifyThisSong(search){

  if(search === ""){
    search = "The Sign";
  };

  spotify.search({ type: 'track', query: search, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  
    var data = data.tracks.items[0];
    console.log(
      "Artist: " + data.artists[0].name +
      "\nSong Name: " + data.name +
      "\nPreview Link: " + data.preview_url +
      "\nAlbum: " + data.album.name
    );
  });
};


//node liri.js concert-this kelly clarkson
function concertThis(search){
  var queryUrl = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
  console.log(queryUrl);

  axios.get(queryUrl).then(function(response){
    // console.log(response.data[0]);
    var data = response.data[0];
    console.log(
      "Venue: " + data.venue.name +
      "\nLocation: " + data.venue.city + ", " + data.venue.region +
      "\nDate: " + moment(data.datetime).format("MM/DD/YYYY")
    );

  }).catch(function(error){
    console.log(error);
  });
};


//node liri.js movie-this kelly jaws
function movieThis(search){

  if(search === ""){
    search = "Mr. Nobody";
  };

  var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=" + search;
  console.log(queryUrl);

  axios.get(queryUrl).then(function(response){
    // console.log(response.data);
    var data = response.data;

    console.log(
      "Title: " + data.Title +
      "\nYear: " + data.Year +
      "\nIMDB Rating: " + data.Ratings[0].Value + 
      "\nRotten Tomatoes Rating: " + data.Ratings[1].Value + 
      "\nCountry Produced: " + data.Ratings[0].Value + 
      "\nLanguage " + data.Language + 
      "\nPlot " + data.Plot + 
      "\nActors " + data.Actors 
    );

  }).catch(function(error){
    console.log(error);
  });
};

function doWhatItSays(search){
  fs.readFile('random.txt', 'utf8', function(err, data){
    if(err){
      return console.log(err);
    };
    var array = data.split(',');
    var action = array[0];
    var search = array[1].replace(/^"(.*)"$/, '$1');

    console.log(search)
    console.log(action)

    switch (action) {
      case "spotify-this-song":
        spotifyThisSong(search);
        break;
      
      case "concert-this":
        concertThis(search);
        break;
      
      case "movie-this":
        movieThis(search);
        break;
    };


    console.log(array);
  });
}