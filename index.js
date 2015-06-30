// 
// this is a small utility for playing movies on a Kodi-player on the local
// network. Kodi must be configured to enable zeroconf (for host URL) and
// control by other applications (for the JSON RPC).
// 
// (first time: request library and manually find Totoro id)
// First, we stop any running movies
// Then, find and clear video playlist
// Then, add Totoro to playlist
// Finally, play playlist (ie Totoro)
// 
// Todo: search library and find movie automatically
//       error handling (no player, no such movie, etc)
//       GPIOs to do this from button press on rpi
// 
// author: Marcus Linderoth
// 
// ref: http://kodi.wiki/view/JSON-RPC_API/v6
// -----------------------------------------------------------------------------
var request = require('request');
// -----------------------------------------------------------------------------
// set the network configuration for the connection with Kodi
// Note two things:
//   configure port in Settings -> Services -> Webserver -> Port, default is 8080
//   enable zeroconf in Kodi to use rasbmc.local, otherwise use static IP or write discovery functionality

var Kodi = function (options) {
    this.host = options.host;
    this.port = options.port;

    // set the HTTP options, we use the POST method, but GET with URL-encoded string is also possible
    this.options = {
        url: "http://" + this.host + ":" + this.port + "/jsonrpc",
        method: 'POST',
        headers: {
            'User-Agent': 'kodi-controller.js'
        },
        json: true,
        gzip: true,
        body: "{}"
    };

    // enum of basic remote control button actions. Use Input.ExecuteAction for the full set as below
    this.remote_inputs = {};
    this.remote_inputs["Back"] = "Input.Back";
    this.remote_inputs["Down"] = "Input.Down";
    this.remote_inputs["Up"] = "Input.Up";
    this.remote_inputs["Left"] = "Input.Left";
    this.remote_inputs["Right"] = "Input.Right";
    this.remote_inputs["Select"] = "Input.Select";
    this.remote_inputs["Home"] = "Input.Home";
    this.remote_inputs["Info"] = "Input.Info";
    this.remote_inputs["ContextMenu"] = "Input.ContextMenu";
    this.remote_inputs["ShowCodec"] = "Input.ShowCodec";
    this.remote_inputs["ShowOSD"] = "Input.ShowOSD";
    this.remote_inputs["SendText"] = "Input.SendText";
    this.remote_inputs["ExecuteAction"] = "Input.ExecuteAction";
};
// ----------------------------------------
// Input.Action
//   "enums": [
//     "left",
//     "right",
//     "up",
//     "down",
//     "pageup",
//     "pagedown",
//     "select",
//     "highlight",
//     "parentdir",
//     "parentfolder",
//     "back",
//     "previousmenu",
//     "info",
//     "pause",
//     "stop",
//     "skipnext",
//     "skipprevious",
//     "fullscreen",
//     "aspectratio",
//     "stepforward",
//     "stepback",
//     "bigstepforward",
//     "bigstepback",
//     "osd",
//     "showsubtitles",
//     "nextsubtitle",
//     "codecinfo",
//     "nextpicture",
//     "previouspicture",
//     "zoomout",
//     "zoomin",
//     "playlist",
//     "queue",
//     "zoomnormal",
//     "zoomlevel1",
//     "zoomlevel2",
//     "zoomlevel3",
//     "zoomlevel4",
//     "zoomlevel5",
//     "zoomlevel6",
//     "zoomlevel7",
//     "zoomlevel8",
//     "zoomlevel9",
//     "nextcalibration",
//     "resetcalibration",
//     "analogmove",
//     "rotate",
//     "rotateccw",
//     "close",
//     "subtitledelayminus",
//     "subtitledelay",
//     "subtitledelayplus",
//     "audiodelayminus",
//     "audiodelay",
//     "audiodelayplus",
//     "subtitleshiftup",
//     "subtitleshiftdown",
//     "subtitlealign",
//     "audionextlanguage",
//     "verticalshiftup",
//     "verticalshiftdown",
//     "nextresolution",
//     "audiotoggledigital",
//     "number0",
//     "number1",
//     "number2",
//     "number3",
//     "number4",
//     "number5",
//     "number6",
//     "number7",
//     "number8",
//     "number9",
//     "osdleft",
//     "osdright",
//     "osdup",
//     "osddown",
//     "osdselect",
//     "osdvalueplus",
//     "osdvalueminus",
//     "smallstepback",
//     "fastforward",
//     "rewind",
//     "play",
//     "playpause",
//     "delete",
//     "copy",
//     "move",
//     "mplayerosd",
//     "hidesubmenu",
//     "screenshot",
//     "rename",
//     "togglewatched",
//     "scanitem",
//     "reloadkeymaps",
//     "volumeup",
//     "volumedown",
//     "mute",
//     "backspace",
//     "scrollup",
//     "scrolldown",
//     "analogfastforward",
//     "analogrewind",
//     "moveitemup",
//     "moveitemdown",
//     "contextmenu",
//     "shift",
//     "symbols",
//     "cursorleft",
//     "cursorright",
//     "showtime",
//     "analogseekforward",
//     "analogseekback",
//     "showpreset",
//     "presetlist",
//     "nextpreset",
//     "previouspreset",
//     "lockpreset",
//     "randompreset",
//     "increasevisrating",
//     "decreasevisrating",
//     "showvideomenu",
//     "enter",
//     "increaserating",
//     "decreaserating",
//     "togglefullscreen",
//     "nextscene",
//     "previousscene",
//     "nextletter",
//     "prevletter",
//     "jumpsms2",
//     "jumpsms3",
//     "jumpsms4",
//     "jumpsms5",
//     "jumpsms6",
//     "jumpsms7",
//     "jumpsms8",
//     "jumpsms9",
//     "filter",
//     "filterclear",
//     "filtersms2",
//     "filtersms3",
//     "filtersms4",
//     "filtersms5",
//     "filtersms6",
//     "filtersms7",
//     "filtersms8",
//     "filtersms9",
//     "firstpage",
//     "lastpage",
//     "guiprofile",
//     "red",
//     "green",
//     "yellow",
//     "blue",
//     "increasepar",
//     "decreasepar",
//     "volampup",
//     "volampdown",
//     "channelup",
//     "channeldown",
//     "previouschannelgroup",
//     "nextchannelgroup",
//     "leftclick",
//     "rightclick",
//     "middleclick",
//     "doubleclick",
//     "wheelup",
//     "wheeldown",
//     "mousedrag",
//     "mousemove",
//     "noop"
// ----------------------------------------
// perform a request over HTTP. Basic common functionality that all other commands
// use to communicate with Kodi.
Kodi.prototype.do_request = function(reqpayload, fn) {
  this.options.body = reqpayload;
  console.log("Performing request:" + JSON.stringify(this.options.body));
  if (typeof fn === 'function') {
    return request(this.options, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                  // console.log("got ok+callback:" + JSON.stringify(body));
              } else {
                  // console.log("got error+callback:" + JSON.stringify(body));
              }
              fn(error, body);
            });

  } else {
    return request(this.options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log("got ok, no callback:" + JSON.stringify(body));
            }
          });
  }
};
// ----------------------------------------
// Send remote control input to Kodi as defined in the 'remote_inputs' above, eg
//    send_input(remote_inputs["Back"]);
Kodi.prototype.send_input = function(input, fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": input,
                 "id": 1};
  // console.log("Sending input");
  this.do_request(payload, function(error, response) {
    if (!error) {
      console.log("Send input callback got ok, response:" + JSON.stringify(response));
    }
    fn(error, response);
  });
};
// ----------------------------------------
// like send_input, but the full set, see Input.Action list above
// very useful are eg 'close'.
Kodi.prototype.send_input_action = function(inputaction, fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": "Input.ExecuteAction",
                 "params": { "action": inputaction},
                 "id": 1};
  this.do_request(payload, function(error, response) {
      if (!error) {
        console.log("Send input action callback got ok, response:" + JSON.stringify(response));
      }
      fn(error, response);
    });
};
// ----------------------------------------
// Get a Kodi player instance, needed for querying for playing movies, stop/pause
// etc, but not for eg set/clear playlist or start movie
Kodi.prototype.get_player = function(fn) {
  var payload = {"jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1};
  this.do_request(payload, function(error, response) {
    if (error) {
        console.log("error getting player:" + JSON.stringify(response));
    } else {
        console.log("got player:" + JSON.stringify(response));
    }
    fn(error, response);
  });
};
// ----------------------------------------
// Get the movie library
Kodi.prototype.get_movie_library = function(fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": "VideoLibrary.GetMovies",
                 "id": 1};
  // console.log("Getting movie library information");
  this.do_request(payload, function(error, response) {
    var ret;
    if (!error) {
      ret = response.result.movies;
      console.log("movie library information callback got ok, response:" + JSON.stringify(response));
    } else {
      ret = JSON.stringify(response);
    }
    fn(error, ret);
  });
};
// ----------------------------------------
// Get details for a movie using the movieid as retrieved from the movie library, eg 493
Kodi.prototype.get_movie_details = function(movieid, fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": "VideoLibrary.GetMovieDetails",
                 "params": { "movieid": parseInt(movieid)},
                 "id": 1};
  this.do_request(payload, function(error, response) {
    var ret = "";
    if (!error) {
      ret = response.result.moviedetails;
      console.log("movie information callback got ok, response:" + JSON.stringify(response));
    } else {
      ret = JSON.stringify(response);
      console.log("error:" + JSON.stringify(response));
    }
    fn(error, ret);
  });
};
// ----------------------------------------
// get all playlists. They should/could be 3: movie, audio, pictures.
// We are only interested in 'movies' and that seems to always be labelled '1'.
Kodi.prototype.get_playlists = function(fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": "Playlist.GetPlaylists",
                 "id": 1};
  this.do_request(payload, function(error, response) {
    var playlists = response.result;
    if (playlists.length === 0) {
      fn(true, {}); // request went fine but no playlists found
    } else {
      fn(error, playlists);
    }
  });
};
// ----------------------------------------
// Get items on a playlist as retrieved using get_playlists(), eg 1
Kodi.prototype.get_playlist_items = function(playlistid, fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": "Playlist.GetItems",
                 "params": { "playlistid": playlistid},
                 "id": 1};
  this.do_request(payload, function(error, response) {
    if (!error) {
      var playlistitems = response.result.items;
      fn(error, response);
    } else {
      fn(error, response);
    }
  });
};
// ----------------------------------------
// Clear playlist as retrieved using get_playlists(), eg 1
Kodi.prototype.clear_playlist = function(playlistid, fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": "Playlist.Clear",
                 "params": { "playlistid": playlistid},
                 "id": 1};
  // console.log("Clearing playlist");
  this.do_request(payload, function(error, response) {
    if (!error) {
      console.log("clear playlist callback got ok, response:" + JSON.stringify(response));
    }
    fn(error, response);
  });
};
// ----------------------------------------
// Insert a movie (from library id, eg 493) into a playlist (from get_playlists())
// at a certain position (zero-indexed -> 0 is the first position)
Kodi.prototype.insert_at_playlist = function(playlistid, position, movieid, fn) {
  var payload = {"jsonrpc": "2.0",
                 "method": "Playlist.Insert",
                 "params": { "playlistid":  playlistid,
                             "position": position,
                             "item" : { "movieid": movieid }
                             },
                 "id": 1};
  // console.log("Inserting to playlist");
  this.do_request(payload, function(error, response) {
    if (!error) {
      console.log("Insert at playlist callback got ok, response:" + JSON.stringify(response));
    }
    fn(error, response);
  });
};
// ----------------------------------------
// Start a playlist (id as found per above) at playlist position (0 is first)
Kodi.prototype.start_playlist = function(playlist, position, fn) {
   // open playlist[id][position]
  var payload = {"jsonrpc": "2.0",
                 "method": "Player.Open",
                 "params": { "item": { "playlistid" :  playlist,
                                       "position" : position}},
                 "id": 1};
  this.do_request(payload, function(error, response) {
    if (!error) {
      console.log("start movie callback got ok, response:" + JSON.stringify(response));
    }
    fn(error, response);
  });
};
// ----------------------------------------
// Start a movie using movie id as found through the library call
// Clears a playlist and inserts this movie at the first position before starting
// the playlist.
Kodi.prototype.start_movie = function(movieid, fn) {
  this.get_playlists(function(err, playlists){
    if (!err) {
      // [{"playlistid":0,"type":"audio"},{"playlistid":1,"type":"video"},{"playlistid":2,"type":"picture"}]
      var playlistid = -1;
      for (var i = playlists.length - 1; i >= 0; i--) {
        if (playlists[i].type == "video") {
          playlistid = playlists[i].playlistid;
          break;
        }
      }
      if (playlistid === -1) {
        fn(true, "no movie playlist found.");
        return undefined;
      }

      this.clear_playlist(playlistid, function(err, response){

        if (!err && response.result == "OK") {
          // {"id":1,"jsonrpc":"2.0","result":"OK"}
          var position = 0; // first movie in playlist
          this.insert_at_playlist(playlistid, position, movieid, function(err, response){

            if (!err && response.result == "OK") {
              // {"id":1,"jsonrpc":"2.0","result":"OK"}
              // start playlist!
              this.start_playlist(playlistid, position, function(err, response){

                if (!err && response.result == "OK") {
                  // {"id":1,"jsonrpc":"2.0","result":"OK"}
                  console.log("seems like we managed to start the movie!");

                } else {
                  fn(true, "Could not start playlist. Response:" + JSON.stringify(response));
                  return undefined;
                }
              }); // start playlist

            } else {
              fn(true, "Could not insert movie in playlist. Response:" + JSON.stringify(response));
              return undefined;
            }
          }); // insert_at_playlist

        } else {
          fn(true, "Could not clear playlist. Response:" + JSON.stringify(response));
          return undefined;
        }
      }); // clear_playlist

    } else {
      fn(true, "Could not get playlists. Response:" + JSON.stringify(response));
      return undefined;
    }
  }); // get_playlists
};


module.exports = Kodi;
