// requires
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const keys = require("./keys.js");

// global variables

let argv2 = process.argv[2]
const omdbapi = "bbc6c707";
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
function song() {
    // console.log(this);
    // if (search) {
    //     search = search;
    // } else if (potato) {
    //     search = potato
    // }
    // else {
    //     search = `The Sign`
    // }

    const spotify = new Spotify(keys.spotify);

    spotify.search({type: 'track', query: 'All the Small Things' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data);
    });
          


//     spotify1.search({ type: 'track', query: search }, function (err, data)  {
// console.log(data);
//         if (err) {
//             console.log('Error occurred: ' + err);
//             return;
//         }
//         console.log(data.tracks.items[0].artists[0].name);
//         // let data = `
//         // Artist Name: ${data.tracks.items[0].artists[0].name}
//         // Song Name: ${data.tracks.items[0].name}`;

//         // fs.appendFile("log.txt", data, function (error) {
//         //     if (error) {
//         //         throw error;
//         //     }
//         // })
//         // console.log(data);
//         // Do something with 'data'
//     });
}

// node liri.js spotify - this - song '<song name here>'






// This will show the following information about the song in your terminal / bash window


// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from


// If no song is provided then your program will default to "The Sign" by Ace of Base.
// You will utilize the node - spotify - api package in order to retrieve song information from the Spotify API.
// The Spotify API requires you sign up as a developer to generate the necessary credentials.You can follow these steps in order to generate a client id and client secret:
// Step One: Visit https://developer.spotify.com/my-applications/#!/
// Step Two: Either login to your existing Spotify account or create a new one(a free account is fine) and log in.
// Step Three: Once logged in, navigate to https://developer.spotify.com/my-applications/#!/applications/create to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.
// Step Four: On the next screen, scroll down to where you see your client id and client secret.Copy these values down somewhere, you'll need them to use the Spotify API and the node-spotify-api package.






// node liri.js movie - this '<movie name here>'

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

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            throw error;
        }
        // console.log(data);
        var separate = data.split(",");
        // console.log(separate);
        argv2 = separate[0];
        potato = separate[1];
        // console.log(argv2);
        // console.log(search);
        if (argv2 === "spotify-this-song") {
            song(potato);
        } else if (argv2 === "movie-this") {
            movie(potato);
        } else if (argv2 === "concert-this") {
            bands(potato);
        }
    })
}
// node liri.js do -what - it - says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.


// It should run spotify - this - song for "I Want it That Way," as follows the text in random.txt.
// Edit the text in random.txt to test out the feature for movie - this and concert - this.