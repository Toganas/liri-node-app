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



function bands(potato) {
    if (search) {
        search = search
    } else if (potato) {
        search = potato
    }
    // query URL for Bands in Town

    let bandsInTown = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp"

    // axios get bands in Town

    axios.get(bandsInTown).then(
        response => {
            for (let i = 0; i < response.data.length; i++) {
                let day = response.data[i].datetime
                let date = moment(day).format("MM/DD/YYYY");
                let venues = (`
                Venue Name: ${response.data[i].venue.name}
                Venue Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}, ${response.data[i].venue.country}
                Event Date: ${date}`);
                console.log(venues);
                fs.appendFile("log.txt", venues, function (error) {
                    if (error) {
                        throw error;
                    }
                })
            };
        }
    )
}
function song(potato) {
    // console.log(this);
    if (search) {
        search = search;
    } else if (potato) {
        search = potato
    }
    else {
        search = `Ace of Base`
    }
    const spotify1 = new spotify(keys.spotify);
    spotify1.search({ type: 'track', query: search }, (err, data) => {

        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        // console.log(data.tracks.items[5]);
        let info = (`
        Artist Name: ${data.tracks.items[0].artists[0].name}
        Song Name: ${data.tracks.items[0].name}
        Preview Link: ${data.tracks.items[0].external_urls.spotify}
        Album: ${data.tracks.items[0].album.name}`);

        fs.appendFile("log.txt", info, function (error) {
            if (error) {
                throw error;
            }
        })
        console.log(info);

    });
}


// node liri.js movie-this '<movie name here>'

function movie(potato) {

    if (search) {
        search = search
    } else if (potato) {
        search = potato
    }
    else {
        search = `Mr. Nobody`
    }
    let queryURL = `http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=${omdbapi}`
    axios.get(queryURL).then(
        response => {
            // console.log(response.data);
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
            console.log(movies);
            fs.appendFile("log.txt", movies, function (error) {
                if (error) {
                    throw error;
                }
            })
        }
    )
}

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