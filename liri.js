require("dotenv").config();
var axios = require('axios');
var inquirer = require("inquirer");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var fs = require("fs");

inquirer.prompt([
    {
        type:"list",
        message: "What command do you want to use?",
        choices: ["concert-this","spotify-this-song","movie-this","do-what-it-says"],
        name: "command"
    }
])
.then(function(answer){
    var protocol = answer.command;
    if (protocol === "do-what-it-says") {
        console.log('Accessing random.txt file...');
        fs.readFile("random.txt", "utf8", function(err, textData){
            textData = textData.split(',');
            protocol = textData[0];
            protocol2 = textData[1];
            console.log("Switching to spotify-this-song...");
            spotify.search({type: 'track', query: protocol2, market:'US',limit: 1}, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                } else {
                    console.log("Artist: " + data.tracks.items[0].artists[0].name);
                    console.log("Song: " + data.tracks.items[0].name);
                    console.log("Album: " + data.tracks.items[0].album.name);
                    console.log("Preview: " + data.tracks.items[0].external_urls.spotify)
                }
            });
        });
    } else if (protocol === "spotify-this-song") {
        inquirer.prompt([
            {
                type:"input",
                message: "Please input the name of a song.",
                name: "media"
            }
        ])
        .then(function(response){
            if (response.media === "") {
                response.media = "The Sign Ace";
            }
            console.log("Accessing Spotify API...");
            spotify.search({type: 'track', query: response.media, market:'US',limit: 1}, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                } else {
                    console.log("Artist: " + data.tracks.items[0].artists[0].name);
                    console.log("Song: " + data.tracks.items[0].name);
                    console.log("Album: " + data.tracks.items[0].album.name);
                    console.log("Preview: " + data.tracks.items[0].external_urls.spotify)
                }
            });
        })
    } else if (protocol === "concert-this") {
        inquirer.prompt([
            {
                type:"input",
                message: "Please input the name of an artist.",
                name: "media"
            }
        ])
        .then(function(response){
            if (response.media === "") {
                response.media = "Drake";
            }
            console.log("Accessing Bands In Town API...");
            axios({
                url: 'https://rest.bandsintown.com/artists/' + response.media + '/events?app_id=codingbootcamp/'
            })
            .then(function(bandsReply){
                console.log('Venue: ' + bandsReply.data[0].venue.name);
                console.log('Location: ' + bandsReply.data[0].venue.city + ', ' + bandsReply.data[0].venue.country);
                var bandsDate = bandsReply.data[0].datetime;
                bandsDate = moment(bandsDate, "YYYY-MMTHH:mm:ss").format("MM/DD/YYYY");
                console.log('Date: ' + bandsDate);
            })
            .catch(function (error){
                console.log(error);
            });
        })
    } else if (protocol === "movie-this") {
        inquirer.prompt([
            {
                type:"input",
                message: "Please input the name of a movie.",
                name: "media"
            }
        ])
        .then(function(response){
            if (response.media === "") {
                response.media = "Mr. Nobody";
            }
            console.log("Accessing IMDB API...");
            axios({
                url: 'http://www.omdbapi.com/?apikey=trilogy&t=' + response.media + ''
            })
            .then(function(movieReply){
                console.log('Title: ' + movieReply.data.Title);
                console.log('Year: ' + movieReply.data.Year);
                console.log('IMDB Rating: ' + movieReply.data.Ratings[0].Value);
                console.log('Rotten Tomatoes Score: ' + movieReply.data.Ratings[1].Value);
                console.log('Country Produced: ' + movieReply.data.Country);
                console.log('Language: ' + movieReply.data.Language);
                console.log('Plot Summary: ' + movieReply.data.Plot);
                console.log('Main Cast: ' + movieReply.data.Actors);
            })
            .catch(function (error){
                console.log(error);
            })
        })
    } 
});
