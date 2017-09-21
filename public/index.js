
(function ($) {
    $.fn.replaceClass = function (pFromClass, pToClass) {
        return this.removeClass(pFromClass).addClass(pToClass);
    };
}(jQuery));

var send = function(message, options){
  console.log("send", message, options)
  console.log("Socket io is not ready")
};

var jingleTimeout, jingleEnd, audioElem;

var launchJingle = function(){
  $(".opened").replaceClass("opened", "closed");
  $(".selected").replaceClass("selected", "unselected");
  $(".logo").replaceClass("unselected", "selected");
  if(serverData.page === "front"){
    audioElem = new Audio();
    audioElem.src = "jingle.mp3";
    audioElem.play();
    jingleEnd = function(){
      $(".logo").replaceClass("selected", "unselected");
      open({ questionIndex : 0});
    };
    jingleTimeout = setTimeout(jingleEnd,60000)
  }
};

var stopJingle = function(){
  audioElem && audioElem.pause();
  audioElem = null;

  jingleEnd && jingleEnd();
  jingleEnd = null;

  jingleTimeout && clearTimeout(jingleTimeout);
  jingleTimeout = null;
};

var open = function(options){
  $(".opened").replaceClass("opened", "closed");
  $(".selected").replaceClass("selected", "unselected");
  $("#question-"+options.questionIndex).replaceClass("unselected", "selected");
}

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
    stopJingle();
    open(options)
  },

  answer : function(options){
    stopJingle();
    if(options.cancel){
      $("#question-"+options.questionIndex+"-answer-"+options.answerIndex).replaceClass("opened", "closed");
      side = $("#question-"+options.questionIndex+"-answer-"+options.answerIndex+" .cancel-control button")[0].attributes["side"].value
      if(side && side !== ""){
        var teamPoints = parseInt($(".team-"+side+" .team-points")[0].innerText)
        teamPoints-=options.value;
        $(".team-"+side+" .team-points")[0].innerText = teamPoints;
        $("#question-"+options.questionIndex+"-answer-"+options.answerIndex+" .cancel-control button")[0].attributes["side"].value = ""
      }
      var audioElem = new Audio();
      audioElem.src = "./cancel.wav";
      audioElem.play();
    } else {
      $("#question-"+options.questionIndex+"-answer-"+options.answerIndex).replaceClass("closed", "opened");
      var side = options.side;
      var teamPoints = parseInt($(".team-"+side+" .team-points")[0].innerText)
      teamPoints+=options.value;
      $("#question-"+options.questionIndex+"-answer-"+options.answerIndex+" .cancel-control button")[0].attributes["side"].value = side;
      $(".team-"+side+" .team-points")[0].innerText = teamPoints;
      var audioElem = new Audio();
      audioElem.src = "./answer.wav";
      audioElem.play();
    }
  },

  media : function(options){
      $("#question-"+options.questionIndex).replaceClass("non-media", "non-answers");
  },
  unmedia : function(options){
    $("#question-"+options.questionIndex).replaceClass("non-answers", "non-media");
  },

  reset : function(){
    stopJingle();
    launchJingle();
  },

  displayAll : function(options){
    $(".answer-of-question-"+options.questionIndex).replaceClass("closed", "opened");
  }

};

var onMessage = function(message, options){
  console.log("receive", message, options);
  fns[message](options);
};

var onLoading = function(){
  if(typeof(serverData.currentQuestion) !== "number"){
    fns.reset();
  }
  var socket = io();
  var events = ["wrong", "go", "answer", "reset", "displayAll", "media", "unmedia"];

  for(var i = 0; i < events.length; i++){
    socket.on(events[i], onMessage.bind(this, events[i]));
  }
  send = function(message, options){
    console.log("send", message, options)
    socket.emit(message, options);
    fns[message](options);
  };
};

onLoading()
