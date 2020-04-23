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
var user_answer_choice;
var user_answer;
var wrongAnswers = 0;
var maxWrongAnswers = 3;
var numHints = 0;
var enterTime = 8000; // in milliseconds
var enterStoppingPoint;
var questionSlideTime = 5000; // in milliseconds
var questionStoppingPoint;
var numCs;
var numQs;
var charSoundDuration = 0.0;
var allow_keys = false;

$(document).ready(function(){
  $.ajax({
    url: "data/mc_questions.json",
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

function showConts(cont1, cont2){
  $("body > div:not(#"+cont1+",#"+cont2+")").hide();
  $("#"+cont1+",#"+cont2).show();
}

function updateOther(other_type){
  if(other_type == 'death'){
    $('#title').html('<span>YOU LOSE</span>');
  } else if(other_type == 'victory'){
    $('#title').html('<span>VICTORY!</span>');
  } else if(other_type == 'answer'){
    $('#title').html('<span>1-2-3</span>');
  }
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

function generateLoadBar(charSoundDuration){
  $('#loadbar').animate({
    width: "100%"
  }, {
    queue: false,
    duration: charSoundDuration * 1000
  });
}

function hideConfirm(){
  $('#confirm_container').animate({
    left: '100vw'
  }, {
    queue: false,
    duration: 5000,
    complete: function() {
      $("#confirm_container").hide();
      $('#conf_answer > span').hide();
      $("#confirm_container").css('left',0);
    }
  });
}


  

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
      if(currQuestion == 0 || questions[currQuestion - 1].type == 'text'){
        allow_keys = true;
      }
    }
    
    $("#game_character").css('background-position',thisCharacter.gameBackgroundPosX[xPos % xLength] + ' ' + thisCharacter.gameBackgroundPosY);
  }, sTime);
}

function characterEnter(sTime, wTime){
  setTimeout(function() {
    characterWalk(sTime, wTime, enterStoppingPoint);
    var slideCharacter = window.setInterval(function() {
      $("#game_character").css('left', '+=1');
    }, 20);
    setTimeout(function() {
      clearInterval(slideCharacter);
    }, wTime);
  }, 2000);
}

function generateCharacter(){
  thisCharacter = chars.find(element => element.name == name);
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
  } else if(thisCharacter.image == "santa.png" || thisCharacter.image == "yeti.png"){
    $(".bg").css("filter","grayscale(30%) brightness(180%)");
    $("#bg4").css("filter","grayscale(70%) brightness(220%)");
    $("#bg5").css("filter","grayscale(100%) brightness(300%)");
    $("#ground").css("filter","brightness(340%)");
    $("#ground").css("filter","brightness(300%)");
    $(".hintbox,.answer").css('background-color','#c1ffff');
  } else if(thisCharacter.image == "jack.png"){
    $("#bg5").hide();
  }
}

/********************
 *     Parallax     *
 *    Background    *
 ********************/
function gameBackgroundScroll(bgSlideTime) {
  var parallax_bg = window.setInterval(function() {
    $('#bg2').css('background-position-x', '-=1');
    $('#bg3').css('background-position-x', '-=3');
    $('#bg4').css('background-position-x', '-=4');
    $('#bg5').css('background-position-x', '-=5');
    $('#ground,#ground-over').css('background-position-x', '-=10');
  }, 5);
  setTimeout(function() {
    clearInterval(parallax_bg);
  }, bgSlideTime);
}

/********************
 *    Questions     *
 *                  *
 ********************/

 function loseLife(){
  window.setTimeout(function() {
      updateOther('death');
      showCont("other_container");
    }, 5000);
 }

function nextQuestion(){
  
  if(currQuestion > 0){
    
    var correct_answer = questions[currQuestion - 1].answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

    if (user_answer == correct_answer) {

      document.getElementById("correct_answer").play();

      if(questions[currQuestion].type == 'mc'){
        user_answer_choice.css('border-color','#54ff29');
      }

      if(currQuestion < numQs){
        characterWalk(stepTime, questionSlideTime, questionStoppingPoint);

        gameBackgroundScroll(questionSlideTime);
        
        setTimeout(function(){
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
            duration: questionSlideTime,
            complete: function() {
              $("#hintbox_cont").empty();
              $("#hintbox_cont").css('left','0');
            }
          });
        }, 500);
      } else {
        updateOther('victory');
        showCont("other_container");
      }
    } else {
      wrongAnswers++;

      document.getElementById("wrong_answer").play();

      if(questions[currQuestion].type == 'mc'){
        user_answer_choice.css('border-color','red');
      } else if(questions[currQuestion].type == 'text'){
        $('.question_box').eq(currQuestion - 1).children('.wrong_cont').children('.wrong' + wrongAnswers).css('display','inline');
      }
      if(wrongAnswers==maxWrongAnswers){
        loseLife();
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
  currHint = questions[currQuestion - 1].hints[numHints];
  //currHint = "placeholder_text";
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
  // TODO: uncomment when nearing end $('#music')[0].play();
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
  showConts("confirm_container","game_container");
  $('#char_sound').attr('src','sound/char/' + thisCharacter.sound);
  $('#conf_character').attr('src','img/chars/profile/' + thisCharacter.image);
  // TODO: loading bar across bottom 0 -> 100% with length of audio file
  questions.forEach(function(question, index){
    // Type refers to how answers are submitted.  Text-answer questions 
    // have an image, an input field, hints, and allow for 3 wrong guesses.
    // Multiple Choice questions have a text question and 4 answer 
    // choices, allowing for 1 wrong guess.
    var q_div = $('<div></div>');

    if(question.type == "mc"){
      // Question
      q_div.append('<div class=\'question\'>' + question.question + '</div>');

      // Answer Choices
      var qc_div = $('<div class=\'choice_container\'></div>');
      question.choices.forEach(function(choice){
        qc_div.append('<div class=\'choice\'>' + choice + '</div>');
      });
      q_div.append(qc_div);
    } else if(question.type == "text"){
      // Image (contains question)
      q_div.append('<img class=\'q_img\' alt=\'img ' + currQuestion + '\' src=\'img/questions/' + question.image + '\'>');
      
      // Answer Input Form
      q_div.append('<input class=\'answer\' placeholder=\'> Your Guess Here <\'>');

      // Display any wrong guesses
      q_div.append(
        '<div class=\'wrong_cont\'>' + 
          '<img src=\'img/wrong/wrong_1.png\' alt=\'wrong1\' class=\'wrong wrong1\'>' + 
          '<img src=\'img/wrong/wrong_2.png\' alt=\'wrong2\' class=\'wrong wrong2\'>' + 
          '<img src=\'img/wrong/wrong_3.png\' alt=\'wrong3\' class=\'wrong wrong3\'>' + 
        '</div>'
      );

      // Hints
      q_div.append(
        '<div class=\'hint_cont\'>' + 
          '<img src=\'img/lightbulb.png\' alt=\'hint1\' class=\'hint hint_avail hint1\'>' + 
          '<img src=\'img/lightbulb.png\' alt=\'hint2\' class=\'hint hint_avail hint2\'>' + 
          '<img src=\'img/lightbulb.png\' alt=\'hint3\' class=\'hint hint_avail hint3\'>' + 
        '</div>'
      );
    }
    $('#game_container').append(q_div);
    q_div.addClass('question_box');
  });
}); 

$('#confirm_container').on('click', '#yes', function(){
  $("#howto_cont").show();
  hideConfirm();
  generateCharacter();
});

$('#confirm_container').on('click', '#no', function(){
  // Load character_selection
  showCont("character_selection_container");
  $('#conf_answer > span').hide();
  nextCharacter();
  $('#loadbar').width(0);
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

$('#char_sound').on("canplay", function () {
  charSoundDuration = $('#char_sound')[0].duration;
  $('#char_sound')[0].play();
  generateLoadBar(charSoundDuration);
});


$(document).on('keydown', function(event){
  // Enter key = `13`
  console.log(allow_keys);
  if(event.keyCode == '13' && allow_keys){
    if(currQuestion != 0){
      user_answer = $('.answer').eq(currQuestion - 1).val().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    }
    nextQuestion();
  }
});

$('#game_container').on('click', '.choice', function(){
  user_answer_choice = $(this);
  user_answer = user_answer_choice.text().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  nextQuestion();
});






