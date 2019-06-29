// requires
require("dotenv").config()
var fs = require("fs")
var axios = require("axios");
var moment = require("moment");
var spotify = require("node-spotify-api");
var keys = require("./keys.js");

// global variables
var spotify = new spotify(keys.spotify);
var argv2 = process.argv[2]
var omdbapi = "bbc6c707";
var artistInput = process.argv.slice(3);
var artist = artistInput.join(" ");

var bandsInTown = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

// concert grabbing from Bands in Town api
if (argv2 === "concert-this") {
    axios.get(bandsInTown).then(
        function (response) {
            // for(var val in response){
            console.log(response.data[0].venue.name);
            // }
        }
    )
}


// Name of the venue
// Venue location
// Date of the Event(use moment to format this as "MM/DD/YYYY")