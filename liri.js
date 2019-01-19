require("dotenv").config();
var inquirer = require("inquirer");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);


inquirer.prompt([
    {
        type:"input",
        message: "What media are you looking for?",
        name: "song"
    },
    {
        type:"list",
        message: "What command do you want to use?",
        choices: ["concert-this","spotify-this-song","movie-this","do-what-it-says"],
        name: "command"
    }
])
.then(function(response){
    if (response.song === "") {
        response.song = "Sunflower";
    }
    if (response.command === "spotify-this-song") {
        console.log("Accessing spotify API");

        spotify.search({type: 'track', query: response.song, market:'US',limit: 1}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            } else {
                console.log("Success!");
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song: " + data.tracks.items[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("Preview: " + data.tracks.items[0].external_urls.spotify)
            }
        });
    }
});