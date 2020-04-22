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
var questionSlideTime = 8000;
var numCs;
var numQs;

$(document).ready(function(){
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
});


/********************
 *                  *
 *      START       *
 *                  *
 *                  *
 ********************/

$("#load_character_selection").on('click', function(){

  // Load character_selection
  $('#container').html(character_selection);
  document.getElementById("music").play();
  nextCharacter();

  $("#right_arrow").on({
  	mouseenter: function(){
  		$(this).attr('src','img/arrow_hover.png');
  	},
  	mouseleave: function(){
  		$(this).attr('src','img/arrow.png');
  	}, 
  	click: function(){
  		currChar = (currChar + 1) % numCs;
	  	nextCharacter();
  	}
  });

  $("#left_arrow").on({
  	mouseenter: function(){
  		$(this).attr('src','img/arrow_hover.png');
  	},
  	mouseleave: function(){
  		$(this).attr('src','img/arrow.png');
  	}, 
  	click: function(){
  		currChar = (currChar - 1) % numCs;
	  	nextCharacter();
  	}
  });

  $("#select").on({
  	click: function(){
      // Load confirm
  		$('#container').html(confirm);
      $("#conf_character").attr('src','img/chars/profile/' + thisCharacter.image);
  		$("#left_arrow,#right_arrow,#select").off();

      // // Update animation time so character finishes at rest
      // var stoppingPoint = Math.ceil((questionSlideTime / stepTime) / xLength) * xLength;
      // questionSlideTime = stepTime * stoppingPoint;

      // $("#yes").on('click', function(){
      //   window.location.href = "game?char=" + name;
      // });

      // $("#no").on('click', function(){
      //   window.location.href = "character_selection";
      // });


  	}
  });
});
 



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

/**** EVENT HANDLERS ****/




/********************
 *                  *
 *     CONFIRM      *
 *                  *
 *                  *
 ********************/

// TODO: links to char_sel & gameplay

// // TODO: set these variables on `CONFIRM` step
// // Update animation time so character finishes at rest
// var stoppingPoint = Math.ceil((questionSlideTime / stepTime) / xLength) * xLength;
// questionSlideTime = stepTime * stoppingPoint;

// content.forEach(function(question, index){
// 	var q_div = $('<div>' + 
//     //'<div class=\'q_text\'>' + question.name + '</div>' + 
//     '<img class=\'q_img\' alt=\'img ' + currQuestion + '\' src=\'' + question.image + '\'>' + 
//     '<input class=\'answer\' placeholder=\'> Your Guess Here <\'>' + 
//     '<div class=\'wrong_cont\'>' + 
//     '<img src=\'img/wrong/wrong_1.png\' alt=\'wrong1\' class=\'wrong wrong1\'>' + 
//     '<img src=\'img/wrong/wrong_2.png\' alt=\'wrong2\' class=\'wrong wrong2\'>' + 
//     '<img src=\'img/wrong/wrong_3.png\' alt=\'wrong3\' class=\'wrong wrong3\'>' + 
//     '</div>' + 
//     '<div class=\'hint_cont\'>' + 
//     '<img src=\'img/lightbulb.png\' alt=\'hint1\' class=\'hint hint_avail hint1\'>' + 
//     '<img src=\'img/lightbulb.png\' alt=\'hint2\' class=\'hint hint_avail hint2\'>' + 
//     '<img src=\'img/lightbulb.png\' alt=\'hint3\' class=\'hint hint_avail hint3\'>' + 
//     '</div>' + 
//     '</div>');
// 	$('#character_selection_container').append(q_div);
// 	q_div.addClass('question_box');
// });
//generateCharacter();

// $(window).keypress(function(event){
//   // Enter key = `13`
//   if(event.which == 13){
//     nextQuestion();
//   }
// });


// // TODO: on hover, change lightbulb to lightbulb_inv
// // on click, change lightbulb to lightbulb_off.  make unclickable.  provide hint
// $('body').on('mouseenter', '.hint_avail', function(){
//     $(this).attr('src','img/lightbulb_inv.png');
// });


// $('body').on('mouseleave', '.hint_avail', function(){
//     $(this).attr('src','img/lightbulb.png');
// });

// $("body").on('click', '.hint_avail', function(){
//     $(this).removeClass('hint_avail');
//     $(this).attr('src','img/lightbulb_off.png');
//     addHint();
//   }
// );



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
function characterWalk(sTime, wTime){
  var stoppingPoint = Math.ceil((wTime / sTime) / xLength) * xLength;

  var walkingAnimation = window.setInterval(function(){
    xPos++;

    if(xPos == stoppingPoint){
      xPos = 0;
      clearInterval(walkingAnimation);
    }
    
    $("#game_character").css('background-position',thisCharacter.gameBackgroundPosX[xPos % xLength] + ' ' + thisCharacter.gameBackgroundPosY);
  }, sTime);
}

function characterEnter(sTime, wTime){
  characterWalk(sTime, wTime);
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
  var enterTime = 8000; // in milliseconds
  // Update animation time so character finishes at rest
  var stoppingPoint = Math.ceil((enterTime / stepTime) / xLength) * xLength;
  enterTime = stepTime * stoppingPoint;

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
    var correct_answer = content[currQuestion - 1].answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

    if (user_answer == correct_answer) {

      document.getElementById("correct").play();

      if(currQuestion < numQs){
        characterWalk(stepTime, questionSlideTime);

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
        }, 500);
      } else {
      	// TODO: trigger victory
      }
      $(".hintbox").hide( questionSlideTime / 2, function() {
        $("#hintbox_cont").empty();
      });
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
    $("#howto_cont").hide( questionSlideTime / 2, function() {
      $("#howto_cont").remove();
    });
    characterWalk(stepTime, questionSlideTime);
    setTimeout(function(){
      gameBackgroundScroll(questionSlideTime);
      $('.question_box').eq(currQuestion).animate({
        left: "70vw"
      }, questionSlideTime, function() {
        // Animation complete
        currQuestion++;
      });
    }, 500);
  }
}

function addHint(){
  currHint = content[currQuestion - 1].hints[numHints];
  $("#hintbox_cont").append('<div class=\'hintbox\'>' + currHint + '</div>');
  numHints++;
}




















