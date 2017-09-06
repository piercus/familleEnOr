var express = require('express');
var fs = require("fs");
var ejs = require("ejs");

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var events = ["wrong", "go", "answer", "reset"];

var onEvent = function (socket, event, data) {
  // we tell the client to execute 'new message'
  socket.broadcast.emit(event, data);
};

io.on('connection', function (socket) {
  for(var i = 0; i < events.length; i++){
    socket.on(events[i], onEvent.bind(this, socket, events[i]));
  }
  // when the user disconnects.. perform this
  socket.on('disconnect', function (reason) {
    // debug
    console.log(socket);
    // log
    console.log("client "+socket.id+" disconnect because of ", reason)
  });
});

app.set('view engine', 'ejs');
app.use(express.static('public'))

var data = JSON.parse(fs.readFileSync("data.json"));

app.get('/front', function (req, res) {
  res.render('page', Object.assign({}, data, {"page" : "front"}));
});

app.get('/back', function (req, res) {
  res.render('page', Object.assign({}, data, {"page" : "back"}));
});

/*app.listen(port, function () {
  console.log('App listening on port '+port);
});*/
