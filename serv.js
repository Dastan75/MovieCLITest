var async 				= require('async');
var inquirer      = require('inquirer');
var request       = require('request');

const APIKEY      = "9addd40314c1597e7c96b75a6d88d8bb";

var questions = [
  {
    type: 'input',
    name: 'language',
    message: "Choose a language (en or fr)",
    default: function() {
      return 'en';
    }
  },
  {
    type: 'input',
    name: 'animation',
    message: "Animation movies ? (yes/no)",
    default: function() {
      return 'no';
    }
  },
  {
    type: 'input',
    name: 'page',
    message: "Which page ?",
    default: function() {
      return '1';
    }
  },
  {
    type: 'input',
    name: 'star',
    message: "Minimum star (0 to 10)",
    default: function() {
      return '0';
    }
  },
  {
    type: 'input',
    name: 'sort',
    message: "Sort by ? (vote or release)",
    default: function() {
      return 'vote';
    }
  }
];

inquirer.prompt(questions).then(answers => {
  //console.log(JSON.stringify(answers, null, '  '));
  //
  var URL = "https://api.themoviedb.org/3/discover/movie?api_key=" + APIKEY +
  "&language=" + answers.language +
  "&include_adult=false&include_video=false" +
  "&page=" + answers.page +
  "&vote_average.gte=" + answers.star;

  if (answers.animation == "yes")
    URL += "&with_genres=16"
  if (answers.sort == "vote")
    URL += "&sort_by=vote_average.desc"
  if (answers.sort == "release")
    URL += "&sort_by=release_date.desc"
  console.log(URL);
  request.get(URL, function (error, response, body) {
    if (error)
      console.log('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //  console.log('body:', body);
    obj = JSON.parse(body);
    console.log("Returned movies : ", obj.total_results);
    console.log("Current page : ", obj.page);
    console.log("Total pages : ", obj.total_pages);
    listMovies = obj.results;
      async.each(listMovies, function(movie, callback) {
        console.log("Title : ", movie.title, ",Release date : ", movie.release_date, ",Vote average : " , movie.vote_average);
        console.log("-------------");
        callback();
      }, function(err) {
        if( err ) {
          console.log('Error');
        } else {

        }
      });
  });
});
//Chaque film sera affiché sur une ligne avec son titre, son année et sa note arrondie à la 1ère décimale. Exemple : Fight Club (1999) 8,3/10
