var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static("res"))

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html")
})

var players = [
]

// Is the game in progress?
var gameStatus = false;

io.on("connection", function(socket){
  socket.emit('playerList', players);



  socket.on("new player", function(name){
    console.log(name + " has joined")
    // push new player to the players list
    players.push({"name": name, "clicks": 0})
    // update other players
    io.emit("newClicker", name)
    // check if 8 players are present
    if (Object.keys(players).length == 2) {
      console.log('The 23rd Hunger Games has begun!');
      io.emit('gameStart');
      setTimeout(function () {
        gameStatus = true;
        setTimeout(function () {
          gameStatus = false;
          io.emit("gameEnd", players)
          players = []
        }, 10000);
      }, 3000);
    }
  });

  socket.on("click", function(name){
    // check if player is in list of players
    var inList;
    for (var i = 0; i < players.length; i++) {
      if (players[i].name == name) {
        var inList = true;
      }
    }

    // if player is in the list
    if (inList && gameStatus) {
      for (var i = 0; i < players.length; i++) {
        if (players[i].name == name) {
          // Update the players list
          players[i].clicks += 1
          // Push update to other players
          io.emit('clicker', name)
        }
      }

    }


  });
});

http.listen(3000, function(){
  console.log('listening on port 3000...');
})
