// requires
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
const spotify = require("node-spotify-api");
const keys = require("./keys.js");

// global variables

let argv2 = process.argv[2]
const omdbapi = "bbc6c707";
let searchInput = process.argv.slice(3);
let search = searchInput.join(" ");

let bandsInTown = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp"

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

// axios get bands in Town

function bands() {
    axios.get(bandsInTown).then(
        response => {
            for (let i = 0; i < response.data.length; i++) {
                let day = response.data[i].datetime
                let date = moment(day).format("MM/DD/YYYY");
                console.log(`
                Venue Name: ${response.data[i].venue.name}
                Venue Location: ${response.data[i].venue.city}, ${response.data[i].venue.region}, ${response.data[i].venue.country}
                Event Date: ${date}`)
                // let day = response.data[i].datetime
                // let date = moment(day).format("MM/DD/YYYY");
                // // Date of the Event(use moment to format this as "MM/DD/YYYY")
                // console.log(`Event Date: ${date}`);
                // fs.appendFile("log.txt", day, function(error){
                //     if (error){
                //     console.log(error); 
                //     }
                // })
                // console.log(("Event Date: "+ moment(day)));
            }
            // console.log(response);
        }

    )
}
function song(potato) {
    // console.log(this);
    if (search){
        search = search;
    }
    else{
        search = potato
    }
    const spotify1 = new spotify(keys.spotify);
    spotify1.search({ type: 'track', query: search }, (err, data) => {
       
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        // let data = `
        // Artist Name: ${data.tracks.items[0].artists[0].name}
        // Song Name: ${data.tracks.items[0].name}`;
        // fs.appendFile("log.txt", data, function(error){
        //     if (error){
        //         throw error;
        //     }
        // })
        //  console.log(data);
        // Do something with 'data'
    });
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
    }else if (potato) {
        search = potato
    }
    else {
        search = `Mr. Nobody`
    }
    let queryURL = `http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=${omdbapi}`
    axios.get(queryURL).then(
        response => {
            console.log(`Movie Name: ${response.data.Title}`);
        }
    )
}


// This will output the following information to your terminal / bash window:

//    * Title of the movie.
//    * Year the movie came out.
//    * IMDB Rating of the movie.
//    * Rotten Tomatoes Rating of the movie.
//    * Country where the movie was produced.
//    * Language of the movie.
//    * Plot of the movie.
//    * Actors in the movie.


// If the user doesn't type a movie in, the program will output data for the movie 'Mr.Nobody.'


// If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/

// It's on Netflix!


// You'll use the axios package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.




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
        }else if (argv2 === "movie-this"){
            movie(potato);
        }


})}
// node liri.js do -what - it - says





// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.


// It should run spotify - this - song for "I Want it That Way," as follows the text in random.txt.
// Edit the text in random.txt to test out the feature for movie - this and concert - this.