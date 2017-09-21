var express = require('express');
var fs = require("fs");
var ejs = require("ejs");

var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var data = JSON.parse(fs.readFileSync("data.json"));
data.currentQuestion = null;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

var events = ["wrong", "go", "answer", "reset", "displayAll", "media", "unmedia"];

var onEvent = function (socket, event, opts) {
  if(event === "go"){
    data.currentQuestion = opts.questionIndex;
  } else if(event === "reset"){
    data.currentQuestion = null;
    for(var i = 0; i < data.questions.length; i++){
      for(var j = 0; j < data.questions[i].answers.length; j++){
        data.questions[i].answers[j].open = false;
        data.questions[i].answers[j].side = null;
      }
    }
  } else if(event === "answer"){
    if(opts.cancel){
      data.questions[opts.questionIndex].answers[opts.answerIndex].open = false;
      data.questions[opts.questionIndex].answers[opts.answerIndex].side = null;
    } else {
      data.questions[opts.questionIndex].answers[opts.answerIndex].open = true;
      data.questions[opts.questionIndex].answers[opts.answerIndex].side = opts.side;
    }
  } else if(event === "displayAll"){
    for(var j = 0; j < data.questions[opts.questionIndex].answers.length; j++){
      if(!data.questions[opts.questionIndex].answers[j].open){
        data.questions[opts.questionIndex].answers[j].open = true;
        data.questions[opts.questionIndex].answers[j].side = null;
      }
    }
  }
  // we tell the client to execute 'new message'
  socket.broadcast.emit(event, opts);
};

io.on('connection', function (socket) {
  for(var i = 0; i < events.length; i++){
    socket.on(events[i], onEvent.bind(this, socket, events[i]));
  }
  // when the user disconnects.. perform this
  socket.on('disconnect', function (reason) {
    // debug
    // console.log(socket);
    // log
    console.log("client "+socket.id+" disconnect because of ", reason)
  });
});

app.set('view engine', 'ejs');
app.use(express.static('public'))



app.get('/front', function (req, res) {
  //console.log("data.currentQuestion", data.currentQuestion);
  res.render('page', Object.assign({}, data, {"page" : "front"}));
});

app.get('/back', function (req, res) {
  res.render('page', Object.assign({}, data, {"page" : "back"}));
});

/*app.listen(port, function () {
  console.log('App listening on port '+port);
});*/
