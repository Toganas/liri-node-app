// requires
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const spotify = require("node-spotify-api");
const keys = require("./keys.js");

// global variables
let argv2 = process.argv[2]
const omdbapi = "trilogy";
let searchInput = process.argv.slice(3);
let search = searchInput.join(" ");

// concert grabbing from Bands in Town api
if (argv2 === "concert-this") {
    bands();
} else if (argv2 === "spotify-this-song") {
    song();
} else if (argv2 === "movie-this") {
    movie();
} else if (argv2 === "do-what-it-says") {
    doWhatItSays();
}

// node liri.js concert-this
function bands(potato) {
    // checking the search
    if (search) {
        search = search
    } else if (potato) {
        search = potato
    }
    // query URL for Bands in Town
    let bandsInTown = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp"
    // axios get bands in Town;
    axios.get(bandsInTown).then(
        // response from the query
        response => {
            for (let i = 0; i < response.data.length; i++) {
                // grabbing the date fron response
                let day = response.data[i].datetime
                // formatting the date
                let date = moment(day).format("MM/DD/YYYY");
                // creating a variable
                let venues = (`
                Venue Name: ${response.data[i].venue.name}
                Venue Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}, ${response.data[i].venue.country}
                Event Date: ${date}`);
                // console logging venues
                console.log(venues);
                // appending venues to log.txt
                fs.appendFile("log.txt", venues, function (error) {
                    if (error) {
                        throw error;
                    }
                })
            };
        }
    )
}

// node liri.js spotify-this-song
function song(potato) {
    // check if there's an input, if not, default to Ace of Base - The Sign
    if (search) {
        search = search;
    } else if (potato) {
        search = potato
    }
    else {
        search = `Ace of Base`
    }
    // grabbing our spotify id and secret
    const spotify1 = new spotify(keys.spotify);
    // searching spotify
    spotify1.search({ type: 'track', query: search }, (err, data) => {
        // returning an error
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        // creating the variable info
        let info = (`
        Artist Name: ${data.tracks.items[0].artists[0].name}
        Song Name: ${data.tracks.items[0].name}
        Preview Link: ${data.tracks.items[0].external_urls.spotify}
        Album: ${data.tracks.items[0].album.name}`);
        // appending the variable info to the file log.txt
        fs.appendFile("log.txt", info, function (error) {
            if (error) {
                throw error;
            }
        })
        // console logging the variable info to the file log.txt
        console.log(info);
    });
}

// node liri.js movie-this '<movie name here>'
function movie(potato) {
    // check if there's an input, if not, default to Mr. Nobody
    if (search) {
        search = search
    } else if (potato) {
        search = potato
    }
    else {
        search = `Mr. Nobody`
    }
    // Making the query into a variable
    let queryURL = `http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=${omdbapi}`
    // using axios to search
    axios.get(queryURL).then(
        response => {
            // making the variable movies that captures all the information and displays it
            let movies = (`
            Movie Name: ${response.data.Title}
            Release year: ${response.data.Year}
            Rating: ${response.data.Rated}
            Rotten Tomatoes Score: ${response.data.Ratings[1].Value}
            Country Produced: ${response.data.Country}
            Language: ${response.data.Language}
            Plot: ${response.data.Plot}
            Actors: ${response.data.Actors}
            `);
            // console loggin the movies variable
            console.log(movies);
            // appending the movies variable to the log.txt file
            fs.appendFile("log.txt", movies, function (error) {
                if (error) {
                    throw error;
                }
            })
        }
    )
}

// node liri.js do-what-it-says
function doWhatItSays() {
    // read from the random.txt
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            throw error;
        }
        // split the data from the file into two different items based on the comma
        var separate = data.split(",");
        argv2 = separate[0];
        potato = separate[1];
        if (argv2 === "spotify-this-song") {
            song(potato);
        } else if (argv2 === "movie-this") {
            movie(potato);
        } else if (argv2 === "concert-this") {
            bands(potato);
        }
    })
}