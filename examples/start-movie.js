/*---------------------------------------------------------------------------*/
Kodi = require("kodi");
/*---------------------------------------------------------------------------*/
var movie_to_start = 493; // find it in your library

var kodi = new Kodi({
    host: 'localhost',
    port: 8080
});

kodi.start_movie(movie_to_start, function(err, resp){
  if (!err) {
    console.log("start_movie OK! " + JSON.stringify(resp));
  } else {
    console.log("start_movie FAIL!");
  }
});
/*---------------------------------------------------------------------------*/
