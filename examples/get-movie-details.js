/*---------------------------------------------------------------------------*/
Kodi = require("../index.js");
/*---------------------------------------------------------------------------*/
var movie = 2; // a movie from your library

var kodi = new Kodi({
    host: 'localhost',
    port: 8080
});

kodi.get_movie_details(movie, function(err, resp){
  if (!err) {
    console.log("get_movie_details OK! " + JSON.stringify(resp));
  } else {
    console.log("get_movie_details FAIL!");
  }
});
