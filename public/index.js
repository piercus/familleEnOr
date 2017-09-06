


var send = function(message, options){
  socket.emit(message, options)
};

var fns = {

  wrong : function(){
    var audioElem = new Audio();
    audioElem.src = "./wrong.wav";
    audioElem.play();
    $(".wrong").replaceClass("hidden", "displayed");
    setTimeout(function(){
      $(".wrong").replaceClass("displayed", "hidden");
    },2000)
  },

  go : function(options){
    $(".opened").replaceClass("opened", "closed");
    $(".selected").replaceClass("selected", "unselected");
    $("#question-"+options.questionIndex).replaceClass("unselected", "selected");
  },

  answer : function(options){
    $("#question-"+options.questionIndex+"-answer-"+options.answerIndex).replaceClass("closed", "opened");
    var audioElem = new Audio();
    audioElem.src = "./answer.wav";
    audioElem.play();
  },

  reset : function(){
    $(".opened").replaceClass("opened", "closed");
    $(".selected").replaceClass("selected", "unselected");
    $(".logo").replaceClass("hidden", "display");
    var audioElem = new Audio();
    audioElem.src = "./jingle.wav";
    audioElem.play();
    setTimeout(function(){
      $(".logo").replaceClass("displayed", "hidden");
      fns.go({ questionIndex : 0});
    },4000)
  }

};

var onMessage = function(message, options){
  fns[message](options);
};

var onLoading = function(){
  socket.connect("");
  fns.reset();
  var socket = io();
  var events = ["wrong", "go", "answer", "reset"];

  for(var i = 0; i < events.length; i++){
    socket.on(events[i], onMessage.bind(this, events[i]));
  }
};
