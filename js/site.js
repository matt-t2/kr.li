// JavaScript file.  Primarily to perform animations and dynamically load elements




/********************
 *                  *
 *     GLOBAL       *
 *    VARIABLES     *
 *                  *
 ********************/

var chars = [];
var questions = [];
var currChar = 0;
var stat_max = 8;
var name;
var thisCharacter;
var xPos = 0;
var xLength;
var stepTime;
var currQuestion = 0;
var wrongAnswers = 0;
var numHints = 0;
var enterTime = 8000; // in milliseconds
var enterStoppingPoint;
var questionSlideTime = 8000; // in milliseconds
var questionStoppingPoint;
var numCs;
var numQs;
var allow_keys = false;

$(document).ready(function(){
  $.ajax({
    url: "data/questions.json",
    dataType: "json",
    success: function(data) {
      $.each(data, function(key, value){
        questions.push(value);
      });
    },
    complete: function(data) {
      numQs = questions.length;
    }
  });

  $.ajax({
    url: "data/chars.json",
    dataType: "json",
    success: function(data) {
    	$.each(data, function(key, value){
    		chars.push(value);
    	});
    },
    complete: function(data) {
      numCs = chars.length;
      nextCharacter();
    }
  });
});




/********************
 *                  *
 *      START       *
 *                  *
 *                  *
 ********************/

function showCont(container){
  $("body > div:not(#"+container+")").hide();
  $("#"+container).show();
}

/********************
 *                  *
 *    CHARACTER     *
 *    SELECTION     *
 *                  *
 ********************/

/**** FUNCTIONS ****/
function createStat(stat_class,stat_value){
  var gray = stat_max - stat_value;
  $("#" + stat_class).empty();

  for (var i=0; i < stat_value; ++ i){
    $("#" + stat_class).append('<span class="dot"></span>');
  }
  for (var j=0; j < gray; ++ j){
    $("#" + stat_class).append('<span class="dot gray"></span>');
  }
}

function nextCharacter(){
  thisCharacter = chars[currChar];
  name = thisCharacter.name;

  $("#sel_character").css('background-image','url(img/chars/profile/' + thisCharacter.image + ')');
  $("#sel_character").css('background-position',thisCharacter.charBackgroundPosition);
  $("#sel_character").css('background-size',thisCharacter.charBackgroundSize);
  $("#name").html(name);
  createStat('attack',thisCharacter.attack);
  createStat('defense',thisCharacter.defense);
  createStat('speed',thisCharacter.speed);
  createStat('special',thisCharacter.special);
}




/********************
 *                  *
 *     CONFIRM      *
 *                  *
 *                  *
 ********************/





/********************
 *                  *
 *    GAMEPLAY      *
 *                  *
 *                  *
 ********************/

/**** FUNCTIONS ****/

/********************
 *    CHARACTER     *
 *                  *
 ********************/
function characterWalk(sTime, wTime, stopPoint){
  allow_keys = false;
  var walkingAnimation = window.setInterval(function(){
    xPos++;

    if(xPos == stopPoint){
      xPos = 0;
      clearInterval(walkingAnimation);
      allow_keys = true;
    }
    
    $("#game_character").css('background-position',thisCharacter.gameBackgroundPosX[xPos % xLength] + ' ' + thisCharacter.gameBackgroundPosY);
  }, sTime);
}

function characterEnter(sTime, wTime){
  characterWalk(sTime, wTime, enterStoppingPoint);
  var slideCharacter = window.setInterval(function() {
    $("#game_character").css('left', '+=1');
  }, 20);
  setTimeout(function() {
    clearInterval(slideCharacter);
  }, wTime);
}

function generateCharacter(){
  thisCharacter = chars.find(element => element.name.replace(/ /g,'') == name);
  //thisCharacter = chars[currCharTesting];
  xLength = thisCharacter.gameBackgroundPosX.length;
  stepTime = thisCharacter.stepTime;

  // Update animation time so character finishes at rest
  enterStoppingPoint = Math.ceil((enterTime / stepTime) / xLength) * xLength;
  enterTime = stepTime * enterStoppingPoint;
  questionStoppingPoint = Math.ceil((questionSlideTime / stepTime) / xLength) * xLength;
  questionSlideTime = stepTime * questionStoppingPoint;

  $("#game_character").css('background-image','url(img/chars/walking/' + thisCharacter.image + ')');
  $("#game_character").css('background-position',thisCharacter.gameBackgroundPosX[xPos] + ' ' + thisCharacter.gameBackgroundPosY);
  //$("#game_character").css('left',thisCharacter.left[xPos]);
  $("#game_character").css('background-size',thisCharacter.gameBackgroundSize);
  $("#game_character").css('height',thisCharacter.height);
  $("#game_character").css('width',thisCharacter.width);
  $("#game_character").css('left','-' + thisCharacter.width);
  characterEnter(stepTime, enterTime);

  // Add grayscale for zombie (she doesn't have enough contrast with gameBackground)
  if(thisCharacter.image == "zombie.png"){
    $(".bg").css("filter","grayscale(80%)");
    $(".bg").css("-webkit-filter","grayscale(80%)");
  }
}

/********************
 *     Parallax     *
 *    Background    *
 ********************/
function gameBackgroundScroll(bgSlideTime) {
  var parallax_bg = window.setInterval(function() {
    $('#bg2').css('left', '-=1');
    $('#bg3').css('left', '-=3');
    $('#bg4').css('left', '-=4');
    $('#bg5').css('left', '-=5');
    $('#ground,#ground-over').css('left', '-=10');
  }, 5);
  setTimeout(function() {
    clearInterval(parallax_bg);
  }, bgSlideTime);
}

/********************
 *    Questions     *
 *                  *
 ********************/

function nextQuestion(){
  
  if(currQuestion > 0){
    var user_answer = $('.answer').eq(currQuestion - 1).val().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    var correct_answer = questions[currQuestion - 1].answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

    if (user_answer == correct_answer) {

      document.getElementById("correct").play();

      if(currQuestion < numQs){
        characterWalk(stepTime, questionSlideTime, questionStoppingPoint);

        setTimeout(function(){
          gameBackgroundScroll(questionSlideTime);
          
          $('.question_box').eq(currQuestion).animate({
            left: "70vw"
          }, {
            queue: false,
            duration: questionSlideTime,
            complete: function() {
              // Animation complete
              currQuestion++;
              wrongAnswers = 0;
              numHints = 0;
            }
          });
          $('.question_box').eq(currQuestion - 1).animate({
            left: "-30vw"
          }, {
            queue: false,
            duration: questionSlideTime
          });

          $('#hintbox_cont').animate({
            left: "-98vw"
          }, {
            queue: false,
            duration: questionSlideTime
            complete: function() {
              $("#hintbox_cont").empty();
              $("#hintbox_cont").css('left','0');
            }
          });
        }, 500);
      } else {
      	// TODO: trigger victory
      }
    } else {
      wrongAnswers++;
      $('.question_box').eq(currQuestion - 1).children('.wrong_cont').children('.wrong' + wrongAnswers).css('display','inline');
      if(wrongAnswers==3){
        window.setTimeout(function() {
          window.location.href = "death";
        }, 5000);
      }
    }
  } else {
    characterWalk(stepTime, questionSlideTime, questionStoppingPoint);
    setTimeout(function(){
      gameBackgroundScroll(questionSlideTime);
      $('.question_box').eq(currQuestion).animate({
        left: "70vw"
      }, questionSlideTime, function() {
        // Animation complete
        currQuestion++;
      });

      $('#howto_cont').animate({
        left: "-30vw"
      }, {
        queue: false,
        duration: questionSlideTime
      });
    }, 500);
  }
}

function addHint(){
  // currHint = questions[currQuestion - 1].hints[numHints];
  currHint = "placeholder_text";
  $("#hintbox_cont").append('<div class=\'hintbox\'>' + currHint + '</div>');
  numHints++;
}




/********************
 *                  *
 *      EVENT       *
 *    LISTENERS     *
 *                  *
 ********************/

$("#load_character_selection").on('click', function(){
  $("#load_character_selection").off();
  // Load character_selection
  showCont("character_selection_container");
  $('#music')[0].play();
  nextCharacter();
});

$('#character_selection_container').on('mouseenter', '#left_arrow,#right_arrow', function(){
    $(this).attr('src','img/arrow_hover.png');
});

$('#character_selection_container').on('mouseleave', '#left_arrow,#right_arrow', function(){
    $(this).attr('src','img/arrow.png');
});

$('#character_selection_container').on('click', '#left_arrow', function(){
    currChar = (currChar + numCs - 1) % numCs;
    nextCharacter();
});

$('#character_selection_container').on('click', '#right_arrow', function(){
    currChar = (currChar + 1) % numCs;
    nextCharacter();
});

$('#character_selection_container').on('click', '#select', function(){
  // Load confirm
  showCont("confirm_container");
  $('#char_sound').attr('src','sound/char/' + thisCharacter.sound);
  $('#conf_character').attr('src','img/chars/profile/' + thisCharacter.image);
  $('#char_sound')[0].play();
  // TODO: loading bar across bottom 0 -> 100% with length of audio file
  questions.forEach(function(question, index){
   var q_div = $('<div>' + 
      //'<div class=\'q_text\'>' + question.name + '</div>' + 
      '<img class=\'q_img\' alt=\'img ' + currQuestion + '\' src=\'img/questions/' + question.image + '\'>' + 
      '<input class=\'answer\' placeholder=\'> Your Guess Here <\'>' + 
      '<div class=\'wrong_cont\'>' + 
      '<img src=\'img/wrong/wrong_1.png\' alt=\'wrong1\' class=\'wrong wrong1\'>' + 
      '<img src=\'img/wrong/wrong_2.png\' alt=\'wrong2\' class=\'wrong wrong2\'>' + 
      '<img src=\'img/wrong/wrong_3.png\' alt=\'wrong3\' class=\'wrong wrong3\'>' + 
      '</div>' + 
      '<div class=\'hint_cont\'>' + 
      '<img src=\'img/lightbulb.png\' alt=\'hint1\' class=\'hint hint_avail hint1\'>' + 
      '<img src=\'img/lightbulb.png\' alt=\'hint2\' class=\'hint hint_avail hint2\'>' + 
      '<img src=\'img/lightbulb.png\' alt=\'hint3\' class=\'hint hint_avail hint3\'>' + 
      '</div>' + 
      '</div>');
   $('#game_container').append(q_div);
   q_div.addClass('question_box');
  });
  //document.getElementById("char_sound").play();
}); 

$('#confirm_container').on('click', '#yes', function(){
  showCont("game_container");
  $("#howto_cont").show();
  $('#conf_answer > span').hide();
  generateCharacter();
});

$('#confirm_container').on('click', '#no', function(){
  // Load character_selection
  showCont("character_selection_container");
  $('#conf_answer > span').hide();
  nextCharacter();
});

$('#game_container').on('mouseenter', '.hint_avail', function(){
  $(this).attr('src','img/lightbulb_inv.png');
});


$('#game_container').on('mouseleave', '.hint_avail', function(){
  $(this).attr('src','img/lightbulb.png');
});

$('#game_container').on('click', '.hint_avail', function(){
  $(this).removeClass('hint_avail');
  $(this).attr('src','img/lightbulb_off.png');
  addHint();
});

$('#char_sound').on('ended', function(){
  $('#conf_answer > span').show();
});


$(document).on('keydown', function(event){
  // Enter key = `13`
  console.log(allow_keys);
  if(event.keyCode == '13' && allow_keys){
    nextQuestion();
  }
})


