// JavaScript file.  Primarily to perform animations and dynamically load elements




/********************
 *                  *
 *     GLOBAL       *
 *    VARIABLES     *
 *                  *
 ********************/

var chars = [],
    questions = [],
    questionsFull = [],
    numQs = 15,
    numCs,
    user_answer, user_answer_choice, newHint,
    currChar = currQuestion = xPos = wrongAnswers = numHints = 0,
    stat_max = 8,
    userDifficulty = numLives = numLivesRemaining = 5,
    maxWrongAnswers,
    maxWrongAnswersText = 3,
    maxWrongAnswersMC = 2,
    enterTime = 8000, // in milliseconds
    exitTime,
    pixelSlideTime = 20,
    questionSlideTime = howto_load_time = (enterTime - 3000),
    allow_keys = skip_question = false,
    charSoundDuration = 0.0,
    name, thisCharacter,
    stepTime, enterStoppingPoint, questionStoppingPoint, xLength,
    mediumDifficulty = 4,
    highDifficulty = 8,
    maxDifficulty = 10,
    percentageDifficulty = 0.0,
    enter_to_start = false,
    sliderWidth, adjSliderFillPos,
    sliderHandleHalfWidth = 26,
    uniqChar = '',
    howto_fadeColor = '#aedecb',
    currContainer = 'start_container', // start, character_selection, confirm, game, death, victory, answer
    user_code = '',
    playMusic = true;

const FULL_DASH_ARRAY = 283;
// const WARNING_THRESHOLD = 3;
// const ALERT_THRESHOLD = 1;

const DEATH_COLOR_CODES = {
  info: {
    color: "green" },

  warning: {
    color: "orange",
    threshold: 3 },

  alert: {
    color: "red",
    threshold: 1 } };

const VICTORY_COLOR_CODES = {
  info: {
    color: "green" },

  warning: {
    color: "orange",
    threshold: 9 },

  alert: {
    color: "red",
    threshold: 3 } };

const DEATH_TIME_LIMIT = 5;
let timePassed = 0;
let timerInterval = null;

const $element = $('#difficultySlider');
const $tooltip = $('#slider_tooltip');
const sliderStates = [
  { name: 'low', tooltip: 'GG EZ', range: _.range(1, mediumDifficulty)},
  { name: 'med', tooltip: 'normal', range: _.range(mediumDifficulty, highDifficulty)},
  { name: 'high', tooltip: 'struggle is real', range: _.range(highDifficulty, maxDifficulty)}
];

var currentState;
var $handle;

$(document).ready(function(){
  $.ajax({
    url: "data/questions.json",
    dataType: "json",
    success: function(data) {
      $.each(data, function(key, value){
        questionsFull.push(value);
      });
    },
    complete: function(data) {
      // numQs = questions.length;
      //shuffle(questions);
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

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var c_code = '133517';

/********************
 *                  *
 *      START       *
 *                  *
 *                  *
 ********************/

function showCont(container){
  currContainer = container;
  $("body > div:not(#"+container+")").hide();
  $("#"+container).show();
}

function showConts(cont1, cont2){
  currContainer = cont1;
  $("body > div:not(#"+cont1+",#"+cont2+")").hide();
  $("#"+cont1+",#"+cont2).show();
}

function startCharSelection(){
  // Load character_selection
  showCont("character_selection_container");

  // TODO: uncomment when nearing end
  if(playMusic){
    playMusic == false;
    $('#music')[0].play();
  }
  
  nextCharacter();
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

// function hideConfirm(){
//   $('#confirm_container').animate({
//     left: '100vw'
//   }, {
//     queue: false,
//     duration: 5000,
//     complete: function() {
//       $("#confirm_container").hide();
//       $('#conf_answer > span').hide();
//       $("#confirm_container").css('left',0);
//     }
//   });
// }

function hideConfirm(){
  // do reverse of showGame
  enter_to_start = false;
  
  $('#confirm_container').animate({
    left: '100vw'
  }, {
    queue: false,
    duration: howto_load_time,
    complete: function() {
      $("#confirm_container").hide();
      $('#conf_answer > span').hide();
      $("#confirm_container").css('left','0');
      $("#confirm_container > *:not('#loadbar')").css('left','0');

      var counter = 0,
          howtos = $('#howto_cont > span');

      function fadeHowTos(){
        if(uniqChar == 'zombie'){
          howto_fadeColor = '#8fb9a8';
        } else if(uniqChar == 'snow'){
          howto_fadeColor = '#c1ffff';
        } else {
          howto_fadeColor = '#aedecb';
        }
        howtos.eq(counter).animate({
          backgroundColor: howto_fadeColor
        }, 2000);


        howtos.eq(counter).fadeIn(2000, function() {
          counter++;
          if (counter < howtos.length){
            fadeHowTos();
          } else{
            allow_keys = true;
          }
        }).css('display','table-cell');
      }

      fadeHowTos();
    }
  });
    $("#confirm_container > *:not('#loadbar')").animate({
    left: '-100vw'
  }, {
    queue: false,
    duration: howto_load_time
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
      console.log('current: ' + currQuestion);
    }
    
    $("#game_character").css('background-position',thisCharacter.gameBackgroundPosX[xPos % xLength] + ' ' + thisCharacter.gameBackgroundPosY);
  }, sTime);
}

function characterChangePos(sTime, wTime){
  setTimeout(function() {
    characterWalk(sTime, wTime, enterStoppingPoint);
    var slideCharacter = window.setInterval(function() {
      $("#game_character").css('left', '+=1');
    }, pixelSlideTime);
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

  exitTime = ($(window).width() + $("#game_character").width()) * pixelSlideTime;

  characterChangePos(stepTime, enterTime);

  // Add grayscale for zombie (she doesn't have enough contrast with gameBackground)
  if(thisCharacter.image == "zombie.png"){
    uniqChar = 'zombie';
    $(".bg").css("filter","grayscale(80%)");
    $(".bg").css("-webkit-filter","grayscale(80%)");

    $(".choice").css('background-color','#8fb9a8');
    $(".answer").css('background-color','#8fb9a8');
    

    $(".answer").css('border-color','#8fb9a8');
  } else if(thisCharacter.image == "santa.png" || thisCharacter.image == "yeti.png"){
    uniqChar = 'snow';
    $("#howto_cont > span").css("color","#666");
    $(".bg").css("filter","grayscale(30%) brightness(180%)");
    $("#bg4").css("filter","grayscale(70%) brightness(220%)");
    $("#bg5").css("filter","grayscale(100%) brightness(300%)");
    $("#ground").css("filter","brightness(340%)");
    $("#ground").css("filter","brightness(300%)");

    $(".choice").css('background-color','#c1ffff');
    $(".answer").css('background-color','#c1ffff');
    

    $(".answer").css('border-color','#c1ffff');
  } else if(thisCharacter.image == "jack.png"){
    $("#bg5").hide();
  }
}

function generateCode(){
  $("#this_char_code_img").attr('src','img/chars/profile/' + thisCharacter.image);
  if(Array.isArray(thisCharacter.victory_code)){
    thisCharacter.victory_code.forEach(function(img){
      $("#victory_code").append('<img class=\'code_img\' alt=\'code_img\' src=\'img/chars/profile/' + img + '\'>');
    });
  } else {
    $("#victory_code > #code_text").append(thisCharacter.victory_code);
  }
}

function startConfirmation(){
  // Load confirm

  showConts("confirm_container","game_container");
  $('#char_sound').attr('src','sound/char/' + thisCharacter.sound);
  $('#conf_character').attr('src','img/chars/profile/' + thisCharacter.image);

  var q_start = currChar * numQs;

  questions = questionsFull.slice(q_start, q_start + numQs);
  console.log(questions);
  shuffle(questions);

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

      shuffle(question.choices);
      question.choices.forEach(function(choice){
        qc_div.append('<div class=\'choice_divider\'></div>');
        qc_div.append('<div class=\'choice\'>' + choice + '</div>');
      });
      q_div.append(qc_div);
    } else if(question.type == "text"){
      // Image (contains question)
      q_div.append('<img class=\'q_img\' alt=\'img ' + currQuestion + '\' src=\'img/questions/' + question.image + '\'>');
      
      // Answer Input Form
      q_div.append('<textarea class=\'answer\' placeholder=\'> Your Guess Here <\'>');

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

function startGame(){
  currContainer = "game_container";
  
  numLives = maxDifficulty - userDifficulty + 1;
  if(userDifficulty == maxDifficulty){
    maxWrongAnswersText = maxWrongAnswersMC = 1;
  }
  numLivesRemaining = numLives;
  showLives();
  $("#howto_cont").prepend("<span>welcome,<br>" + thisCharacter.name.toLowerCase() + "</span>");
  $("#howto_cont").show();
  
  hideConfirm();
  generateCharacter();
  generateCode();
}

function showLives(){
  // place numLives worth of char prof images top left
  for (var l = 0; l < numLives; ++ l)
    $('#display_lives').append('<img class=\'charLifeImage\' alt=\'LIFE\' src=\'img/chars/profile/' + thisCharacter.image + '\'>');

}

function outOfLives(){
  window.setTimeout(function() {
    showCont("death_container");
    //startTimer(DEATH_TIME_LIMIT, "death", DEATH_COLOR_CODES);
  }, 5000);
}

function loseLife(){
  numLivesRemaining--;
  // grey out character life
  $(".charLifeImage").eq(numLivesRemaining).css('filter','brightness(15%)');

  if(numLivesRemaining == 0){
    outOfLives();
  } else {
    skip_question = true;
    nextQuestion();
  }
}

function nextQuestion(){
  
  if(currQuestion > 0){
    
    var correct_answer = questions[currQuestion - 1].answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

    if (user_answer == correct_answer) {
      document.getElementById("correct_answer").play();

      skip_question = true;

      if(questions[currQuestion - 1].type == 'mc'){
        user_answer_choice.css('border-color','#54ff29');
      } else {
        $('.question_box').eq(currQuestion - 1).find('.answer').css('border-color','#54ff29');
      }
    }

    if (skip_question){
      skip_question = false;

      if(currQuestion < numQs){
        wrongAnswers = 0;
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
              if(questions[currQuestion - 1].type == 'text'){
                maxWrongAnswers = maxWrongAnswersText;
                allow_keys = true;
              } else {
                maxWrongAnswers = maxWrongAnswersMC;
              }
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
        // TODO: slide off last question, slide off character, slide in 'YOU WIN' and code and play_again timer
        gameBackgroundScroll(questionSlideTime);
        characterWalk(stepTime, (questionSlideTime * 1.5), questionStoppingPoint);

        setTimeout(function(){
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

          $('#victory_cont').animate({
            left: "20vw"
          }, {
            queue: false,
            duration: (questionSlideTime * 1.5),
            complete: function() {
              // Animation complete TODO: present clue & play_again timer
              characterChangePos(stepTime, exitTime);
              startTimer(stepTime, "victory", VICTORY_COLOR_CODES);
            }
          });
        }, 500);
      }
    } else {
      wrongAnswers++;

      document.getElementById("wrong_answer").play();
      console.log('maxWrong' + maxWrongAnswers);
      console.log('numWrong' + wrongAnswers);
      console.log('lives: ' + numLivesRemaining + ', totalLives: ' + numLives);

      if(questions[currQuestion - 1].type == 'mc'){
        user_answer_choice.css('border-color','red');
      } else if(questions[currQuestion - 1].type == 'text'){
        $('.question_box').eq(currQuestion - 1).find('.answer').css('border-color','red');
        $('.question_box').eq(currQuestion - 1).children('.wrong_cont').children('.wrong' + wrongAnswers).css('display','inline');
      }
      if(wrongAnswers==maxWrongAnswers){
        if(currQuestion < numQs){
          loseLife();
        } else {
          // TODO: trigger victory but meh
        }
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
        if(questions[currQuestion - 1].type == 'text'){
          maxWrongAnswers = maxWrongAnswersText;
          allow_keys = true;
        } else {
          maxWrongAnswers = maxWrongAnswersMC;
        }
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

  newHint = $('<div class=\'hintbox\'>' + currHint + '</div>');
  $("#hintbox_cont").append(newHint);
  if(uniqChar == 'zombie'){
    newHint.css('background-color','8fb9a8');
  } else if(uniqChar == 'snow'){
    newHint.css('background-color','#c1ffff');
  }
  numHints++;
}




/********************
 *                  *
 *      EVENT       *
 *    LISTENERS     *
 *                  *
 ********************/

$("#load_character_selection").on('click', function(){
  startCharSelection();
});

$('#enter_code span').on('click', function(){
  showCont("enter_code_container");
}); 

$('#enter_code_container').on('keyup', '.final_solution', function () {
    if (this.value.length == this.maxLength) {
      if($(this).not(':last-child')){
        $(this).next('.final_solution').focus();
      }

      user_code = '';

      $('.final_solution').each(function() {
        user_code = user_code.concat($(this)[0].value);
      });

      // TODO: compare to correct code
      if(user_code == c_code){
        console.log('WIN');
        //TODO: showCont("answer_container");
      } else {
        console.log("Donald Trump: \"WRONG!\"");
      }
    }
});

$('#enter_code_container').on('click', '#return', function(){
  showCont("start_container");
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
  startConfirmation();
}); 

$('#difficultySlider').on('change', function(){
  userDifficulty = parseInt($('#difficultySlider').val());
});

$('#confirm_container').on('click', '#yes', function(){
  startGame();
});

$('#confirm_container').on('click', '#no', function(){
  enter_to_start = false;

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
  enter_to_start = true;
});

$('#char_sound').on("canplay", function () {
  charSoundDuration = $('#char_sound')[0].duration;
  $('#char_sound')[0].play();
  generateLoadBar(charSoundDuration);
});

$(document).on('keydown', function(event){
  if(event.keyCode == '13'){ // enter key
    event.preventDefault();
    if(allow_keys){
      if(currQuestion != 0){
        user_answer = $('.question_box').eq(currQuestion - 1).find('.answer').val().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
      }
      nextQuestion();
    } else if(currContainer == 'start_container'){
      startCharSelection();
    } else if(currContainer == 'character_selection_container'){
      startConfirmation();
    } else if(currContainer == 'confirm_container' && enter_to_start){
      startGame();
    }
  } else if(event.keyCode == '37'){ // left arrow key
    if(currContainer == 'character_selection_container'){
      currChar = (currChar + numCs - 1) % numCs;
      nextCharacter();
    } else if(currContainer == 'confirm_container'){
      userDifficulty = parseInt($('#difficultySlider').val()) - 1;
      if(userDifficulty >= 1){
        sliderWidth = $('#js-rangeslider-0').width() - sliderHandleHalfWidth;
        percentageDifficulty = ((userDifficulty - 1) / (maxDifficulty - 1));
        adjSliderFillPos = sliderWidth * percentageDifficulty;
        $('#difficultySlider').val(userDifficulty)
        updateHandle($handle[0], userDifficulty);
        checkState($handle[0], userDifficulty);
        $('.rangeslider__fill').css('width',(adjSliderFillPos + 26) + 'px');
        $('.rangeslider__handle').css('left',adjSliderFillPos + 'px');
      }
    }
  } else if(event.keyCode == '39'){ // right arrow key
    if(currContainer == 'character_selection_container'){
      currChar = (currChar + 1) % numCs;
      nextCharacter();
    } else if(currContainer == 'confirm_container'){
      userDifficulty = parseInt($('#difficultySlider').val()) + 1;
      if(userDifficulty <= maxDifficulty){
        sliderWidth = $('#js-rangeslider-0').width() - sliderHandleHalfWidth;
        percentageDifficulty = ((userDifficulty - 1) / (maxDifficulty - 1));
        adjSliderFillPos = sliderWidth * percentageDifficulty;
        $('#difficultySlider').val(userDifficulty)
        updateHandle($handle[0], userDifficulty);
        checkState($handle[0], userDifficulty);
        $('.rangeslider__fill').css('width',(adjSliderFillPos + 26) + 'px');
        $('.rangeslider__handle').css('left',adjSliderFillPos + 'px');
      }
    }
  }
});

$('#enter').on('click', function(event){
    nextQuestion();
});

$('#game_container').on('click', '.choice', function(){
  user_answer_choice = $(this);
  user_answer = user_answer_choice.text().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  nextQuestion();
});







/********************
 *                  *
 *    DIFFICULTY    *
 *      SLIDER      *
 *                  *
 ********************/

/* Credit: Andre Ruffert at https://codepen.io/collection/oeBwH */

$element.
rangeslider({
  polyfill: false,
  onInit: function () {
    $handle = $('.rangeslider__handle', this.$range);
    console.log(this);
    updateHandle($handle[0], this.value);
    updateState($handle[0], this.value);
  } }).

on('input', function () {
  console.log('input: ' + this);
  console.log(this.value);
  updateHandle($handle[0], this.value);
  checkState($handle[0], this.value);
});

// Update the value inside the slider handle
function updateHandle(el, val) {
  el.textContent = val;
}

// Check if the slider state has changed
function checkState(el, val) {
  // if the value does not fall in the range of the current state, update
  console.log(currentState.range);
  console.log(parseInt(val));
  if (!_.contains(currentState.range, parseInt(val))) {
    updateState(el, val);
  }
}

// Change the state of the slider
function updateState(el, val) {
  for (var j = 0; j < sliderStates.length; j++) {if (window.CP.shouldStopExecution(0)) break;
    if (_.contains(sliderStates[j].range, parseInt(val))) {
      currentState = sliderStates[j];
      // updateSlider();
    }
  }
  //  // If the state is high, update the handle count to read 50+
  //  window.CP.exitedLoop(0);if (currentState.name == "high") {
  //    updateHandle($handle[0], "50+");
  //  }

  // Update handle color
  $handle.
  removeClass(function (index, css) {
    return (css.match(/(^|\s)js-\S+/g) || []).join(' ');
  }).
  addClass("js-" + currentState.name);
  // Update tooltip
  $tooltip.html(currentState.tooltip);
}



/********************
 *                  *
 *    PLAY AGAIN    *
 *      TIMER       *
 *                  *
 ********************/

/* Credit: Mateusz Rybczonec at https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/ */

document.getElementById("death_timer").innerHTML = `
<div class="death-base-timer">
  <svg class="death-base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="death-base-timer__circle">
      <circle class="death-base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="death-base-timer-path-remaining"
        stroke-dasharray="283"
        class="death-base-timer__path-remaining green"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="death-base-timer-label" class="death-base-timer__label">Play Again</span>
</div>
`;

document.getElementById("victory_timer").innerHTML = `
<div class="victory-base-timer">
  <svg class="victory-base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="victory-base-timer__circle">
      <circle class="victory-base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="victory-base-timer-path-remaining"
        stroke-dasharray="283"
        class="victory-base-timer__path-remaining green"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="victory-base-timer-label" class="victory-base-timer__label">Play Again</span>
</div>
`;

function onTimesUp() {
  clearInterval(timerInterval);
  showCont("start_container");
}

function startTimer(timeLimit, condition, color_codes) {
  var timePassed = 0;
  var timeLeft = timeLimit;
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = timeLimit - timePassed;

    setCircleDasharray(timeLeft, timeLimit, condition);
    setRemainingPathColor(timeLeft, timeLimit, condition, color_codes);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function setRemainingPathColor(timeLeft, timeLimit, condition, color_codes) {
  const { alert, warning, info } = color_codes;
  if (timeLeft <= alert.threshold) {
    document.
    getElementById(condition + "-base-timer-path-remaining").
    classList.remove(warning.color);
    document.
    getElementById(condition + "-base-timer-path-remaining").
    classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document.
    getElementById(condition + "-base-timer-path-remaining").
    classList.remove(info.color);
    document.
    getElementById(condition + "-base-timer-path-remaining").
    classList.add(warning.color);
  }
}

function calculateTimeFraction(timeLeft, timeLimit) {
  const rawTimeFraction = timeLeft / timeLimit;
  return rawTimeFraction - 1 / timeLimit * (1 - rawTimeFraction);
}

function setCircleDasharray(timeLeft, timeLimit, condition) {
  const circleDasharray = `${(
  calculateTimeFraction(timeLeft, timeLimit) * FULL_DASH_ARRAY).
  toFixed(0)} 283`;
  document.
  getElementById(condition + "-base-timer-path-remaining").
  setAttribute("stroke-dasharray", circleDasharray);
}







