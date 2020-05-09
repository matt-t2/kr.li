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
    enterTime = 4000, // in milliseconds
    exitTime,
    pixelSlideTime = 20,
    questionSlideTime = howto_load_time = 3000,
    allow_keys = skip_question = false,
    maxSoundDuration = charSoundDuration = 2,
    name, thisCharacter,
    stepTime, enterStoppingPoint, exitStoppingPoint, questionStoppingPoint, xLength,
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
    dieSpeed = 500,
    characterPosition = '15vw',
    num_dbs,
    john_count = 0,
    playMusic = true,
    playback_speed = 1.0,
    show_extra = true;

//$('#music')[0].volume=0;
$('#game_start_music')[0].volume=0.3;
$('#click')[0].volume=0.1;
$('#char_sound')[0].volume=0.5;
$('#unusual')[0].volume=0.5;
$('#pussycat')[0].volume=0.5;
$('#music')[0].volume=0.5;


var light_dist = ($(window).width() / 20) - 20;
$('.light.left').css('left',light_dist+'px');
$('.light.right').css('right',light_dist+'px');


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
const VICTORY_TIME_LIMIT = 30;
let timePassed = 0;
let timerInterval = null;

const $element = $('#difficultySlider');
const $tooltip = $('#slider_tooltip');
const sliderStates = [
  { name: 'low', tooltip: 'it\'d be embarrassing if you lost', range: _.range(1, mediumDifficulty)},
  { name: 'med', tooltip: 'aggressively mediocre', range: _.range(mediumDifficulty, highDifficulty)},
  { name: 'high', tooltip: 'the struggle is real', range: _.range(highDifficulty, maxDifficulty)}
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
    }
  });
});

if (typeof $.cookie('chars_used') === 'undefined'){
 $.cookie("chars_used", 0);
} 

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

var timestamp = t_s = 746667727465;

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
  
  setTimeout(function() {
    $('#game_start_music')[0].play();
  }, 700);
  

  var lights_counter = 0;

  var startGameAnimation = window.setInterval(function(){
    lights_counter++;
    if(lights_counter == 1){
      $(".light.red").show();
    } else if(lights_counter == 2){
      $(".light.yellow").show();
    } else if(lights_counter == 3){
      $(".light.green").show();
      clearInterval(startGameAnimation);
    }
  },1000); 


  setTimeout(function() {
    // Load character_selection
    showCont("character_selection_container");  
    $('.light').hide();
    nextCharacter();
    if(show_extra){
      show_extra=false;
      $("#extra").hide();
    }
  }, 4000);

  
}

var game_status = t_s;

function refreshGame(){
  $("#confirm_container > div").removeAttr('style');
  $("#game_character").removeAttr('style');
  $("#display_lives").empty();
  $("#display_lives").append('<span id=\'on_question\'></span>');
  $(".bg").removeAttr('style');
  $("#ground").removeAttr('style');
  $(".choice").removeAttr('style');
  $(".answer").removeAttr('style');
  $("#howto_cont > span").removeAttr('style');
  $("#victory_code > #code_text").text(" = ");
  $(".code_answer_img").remove();
  $("#hintbox_cont").empty();
  $(".question_box").remove();
  $("#hintbox_cont").removeAttr('style');
  $("#howto_cont").removeAttr('style');
  $("#victory_cont").removeAttr('style');
  $("#howto_cont").find('span:first').remove();
  $("#victory-base-timer-path-remaining").removeClass("orange");
  $("#victory-base-timer-path-remaining").removeClass("red");
  $("#death-base-timer-path-remaining").removeClass("orange");
  $("#death-base-timer-path-remaining").removeClass("red");
  $("#death_container").css('backgroundColor','#2b5754');
  $("#enter").removeClass('unclickable');
  wrongAnswers = 0;
  currQuestion = 0;
}

/********************
 *                  *
 *    CHARACTER     *
 *    SELECTION     *
 *                  *
 ********************/

/**** FUNCTIONS ****/

function colorDot(stat, curr_val, stat_val, anim_time){
  stat.eq(curr_val).animate({
    'background-position-x': '0%'
  }, anim_time, function(){
    if (curr_val < stat_val){
      colorDot(stat, curr_val+1, stat_val, anim_time);
    }
  });
}

function clearDots(stat){
  stat.stop();
  stat.removeAttr('style');
  stat.css('background-position-x','100%');
}

function createStat(stat_class,stat_value){
  stat = $('#' + stat_class + ' > span');
  anim_time = (2000 / stat_value); // 2 seconds for full animation to complete
  clearDots(stat);
  colorDot(stat, 0, stat_value-1, anim_time);
}

var char_status = game_status;

function nextCharacter(){
  thisCharacter = chars[currChar];
  name = thisCharacter.name;

  $("#sel_character").css('background-image','url(img/chars/prof-pic/' + thisCharacter.image + ')');
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

function generateLoadBar(soundDuration){
  $('#loadbar').animate({
    width: "100%"
  }, {
    queue: false,
    duration: soundDuration * 1000,
    complete: function() {
      $('#conf_answer > span').show();
      $('#loadbar').css('transform','skewX(0deg)');
    }
  });
}

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
        }, ((enterTime - howto_load_time) / 3));


        howtos.eq(counter).fadeIn((enterTime / 3), function() {
          counter++;
          if (counter < howtos.length){
            fadeHowTos();
          } else{
            allow_keys = true;
          }
        });
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

var conf_status = char_status;


  

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
    }
    
    $("#game_character").css('background-position',thisCharacter.gameBackgroundPosX[xPos % xLength] + ' ' + thisCharacter.gameBackgroundPosY);
  }, sTime);
}

function characterDie(){
  xPos = 0;
  xLength = thisCharacter.gameDeathPosX.length;

  var deathAnimation = window.setInterval(function(){
    xPos++;
    if(xPos == xLength){
      xPos = 0;
      clearInterval(deathAnimation);
    } else {
      $("#game_character").css('background-position',thisCharacter.gameDeathPosX[xPos] + ' ' + thisCharacter.gameBackgroundPosY);
    }
  }, dieSpeed);
}

// TODO: instead of +=1 px, animate slide to left=25vw on enter
//                                           left=100vw on exit
function characterChangePos(sTime, wTime, stPoint, dist){
  characterWalk(sTime, wTime, stPoint);
  $("#game_character").animate({
    left: dist
  }, {
    queue: false,
    duration: wTime
  });
  // setTimeout(function() {
  //   characterWalk(sTime, wTime, enterStoppingPoint);
  //   var slideCharacter = window.setInterval(function() {
  //     $("#game_character").css('left', '+=1');
  //   }, pixelSlideTime);
  //   setTimeout(function() {
  //     clearInterval(slideCharacter);
  //   }, wTime);
  // }, 2000);
}

function slideDBs(dist){
  var interval_time = 1000 / dist;

  var bg_slide_time = 0;

  var slideAcross = window.setInterval(function(){
    bg_slide_time++;
    if(bg_slide_time == dist){
      $(".d_b").remove();
      clearInterval(slideAcross);
    } else {
      $('.d_b').each(function(){
        var db_left = $(this).offset().left;
        $(this).css('left',(db_left - 2) + 'px');
      });
    }
  }, interval_time);
}

function generateDB(){

  var num_chars_used = $.cookie('chars_used');

  if(num_chars_used == 10){
    num_dbs = 100;
    for (var db = 0; db < num_dbs; ++ db){
      var db_top = (Math.random() * $(window).height()) - 125;
      var db_left = (Math.random() * 1200) + $(window).width();
      $("#game_container").append('<img alt=\'d_b\' class=\'d_b\' src=\'img/d_b.gif\' style=\'top: ' + db_top + 'px; left: ' + db_left + 'px;\'>');
    }

    slideDBs($(window).width() + 1200)
  } else{
    if(num_chars_used < 6){
      // At least 1, at most the number of characters used
      num_dbs = Math.max(Math.random() * num_chars_used, 1);
    } else if(num_chars_used > 5 && num_chars_used < 10){
      // At least the number of characters used, at most 20
      num_dbs = Math.max(Math.random() * 20, num_chars_used);
    }

    for (var db = 0; db < num_dbs; ++ db){
      var db_top = Math.random() * ($(window).height() - 250);
      var db_left = (Math.random() * 600) + $(window).width();
      $("#game_container").append('<img alt=\'d_b\' class=\'d_b\' src=\'img/d_b.gif\' style=\'top: ' + db_top + 'px; left: ' + db_left + 'px;\'>');
    }

    slideDBs($(window).width() + 600);
  }
}

function uniqueEntrance(char){
  if(char == 'zombie'){
    var enterLength = thisCharacter.gameEnterPosX.length;

    $("#game_character").css('background-position',thisCharacter.gameEnterPosX[0] + ' ' + thisCharacter.gameBackgroundPosY);
    $("#game_character").css('left',characterPosition);

    var enterAnimation = window.setInterval(function(){
      xPos++;

      if(xPos == enterLength){
        xPos = 0;
        $("#game_character").css('background-position',thisCharacter.gameBackgroundPosX[0] + ' ' + thisCharacter.gameBackgroundPosY);
        clearInterval(enterAnimation);
      } else {
        $("#game_character").css('background-position',thisCharacter.gameEnterPosX[xPos] + ' ' + thisCharacter.gameBackgroundPosY);
      }
    }, stepTime);
  }
}

var in_game_status = igs = conf_status;

function generateCharacter(){
  var prevCookie = $.cookie('chars_used');
  $.cookie('chars_used',(parseInt(prevCookie) + 1));

  thisCharacter = chars.find(element => element.name == name);
  //thisCharacter = chars[currCharTesting];
  xLength = thisCharacter.gameBackgroundPosX.length;
  stepTime = thisCharacter.stepTime;

  // Update animation time so character finishes at rest

  // enterTime is the assigned length of time to run the animation when the game begins
  // questionSlideTime is the assigned length of time to move on to the next question in-game
  // 
  // Here, I'm updating these values for each character so that the character will finish each 'animation' 
  // at rest.  Each image has a certain number of postures to replicate a walking step for the character. 
  // stepTime reflects the time in ms beteen each of these postures.  xLength is the total number of postures 
  // for that character.
  // 
  // enterTime / stepTime               => how many individual postures will be shown within the enterTime.
  // (enterTime / stepTime) / xLength   => the number of total cycles for the character within enterTime
  // Math.ceil((e/s) / xL)              => first full cycle taking time >= enterTime
  // 
  // enterStoppingPoint, questionStoppingPoint   => character is `at rest` in this position and should stop
  // 
  // update enterTime and questionSlideTime to reflect the revised time necessary to reach `at rest` position
  enterStoppingPoint = Math.ceil((enterTime / stepTime) / xLength) * xLength;
  enterTime = stepTime * enterStoppingPoint;
  questionStoppingPoint = Math.ceil((questionSlideTime / stepTime) / xLength) * xLength;
  questionSlideTime = stepTime * questionStoppingPoint;

  $("#game_character").css('background-image','url(img/chars/game-pic/' + thisCharacter.image + ')');
  $("#game_character").css('background-position',thisCharacter.gameBackgroundPosX[xPos] + ' ' + thisCharacter.gameBackgroundPosY);
  //$("#game_character").css('left',thisCharacter.left[xPos]);
  $("#game_character").css('background-size',thisCharacter.gameBackgroundSize);
  $("#game_character").css('height',thisCharacter.height);
  $("#game_character").css('width',thisCharacter.width);
  $("#game_character").css('left','-' + thisCharacter.width);

  exitTime = ($(window).width() + $("#game_character").width()) * pixelSlideTime;
  exitStoppingPoint = Math.ceil(exitTime / stepTime);


  if(thisCharacter.image == "zombie.png"){
    uniqChar = 'zombie';

    setTimeout(function() {
      uniqueEntrance('zombie');
    }, (enterTime - (stepTime * thisCharacter.gameEnterPosX.length)));
    

    $(".bg").css("filter","grayscale(80%)");
    $(".bg").css("-webkit-filter","grayscale(80%)");

    $(".choice").css('background-color','#8fb9a8');
    $(".answer").css('background-color','#8fb9a8');
    $(".answer").css('border-color','#8fb9a8');
  } else {
    characterChangePos(stepTime, enterTime, enterStoppingPoint, characterPosition);
    if(thisCharacter.image == "santa.png" || thisCharacter.image == "yeti.png"){
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
      uniqChar = 'jack';
      $("#bg5").hide();
    } else{
      uniqChar = '';
    }
  }
}

function generateCode(){
  $("#this_char_code_img").attr('src','img/chars/prof-pic/' + thisCharacter.image);
  if(Array.isArray(thisCharacter.victory_code)){
    thisCharacter.victory_code.forEach(function(img){
      $("#victory_code").append('<img class=\'code_img code_answer_img\' alt=\'code_img\' src=\'img/chars/prof-pic/' + img + '\'>');
    });
  } else {
    $("#victory_code > #code_text").append(thisCharacter.victory_code);
  }
}

function startConfirmation(){
  // Load confirm

  showConts("confirm_container","game_container");
  $('#char_sound').attr('src','sound/char/' + thisCharacter.sound);
  $('#conf_character').attr('src','img/chars/prof-pic/' + thisCharacter.image);

  var q_start = currChar * numQs;

  questions = questionsFull.slice(q_start, q_start + numQs);
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

      // Answer Enter Button
      q_div.append('<button class=\'text-enter\'>&#x21AA; Enter</button>');

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
          '<img src=\'img/tools/lightbulb.png\' alt=\'hint1\' class=\'hint hint_avail hint1\'>' + 
          '<img src=\'img/tools/lightbulb.png\' alt=\'hint2\' class=\'hint hint_avail hint2\'>' + 
          '<img src=\'img/tools/lightbulb.png\' alt=\'hint3\' class=\'hint hint_avail hint3\'>' + 
        '</div>'
      );
    } else if(question.type == "caption"){
      // Image (contains question)
      q_div.append('<img class=\'q_img q_img_cpt\' alt=\'img ' + currQuestion + '\' src=\'img/questions/' + question.image + '\'>');
      
      // Question
      q_div.append('<div class=\'question question_cpt\'>' + question.image_caption + '</div>');

      // Answer Input Form
      q_div.append('<textarea class=\'answer answer_cpt\' placeholder=\'> Your Guess Here <\'>');

      // Answer Enter Button
      q_div.append('<button class=\'text-enter\'>&#x21AA; Enter</button>');

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
          '<img src=\'img/tools/lightbulb.png\' alt=\'hint1\' class=\'hint hint_avail hint1\'>' + 
          '<img src=\'img/tools/lightbulb.png\' alt=\'hint2\' class=\'hint hint_avail hint2\'>' + 
          '<img src=\'img/tools/lightbulb.png\' alt=\'hint3\' class=\'hint hint_avail hint3\'>' + 
        '</div>'
      );
    }
    $('#game_container').append(q_div);
    q_div.addClass('question_box');
  });
}

function playMulaney(){
  john_count++;

  if(john_count % 7 == 0){
    // It's Not Unusual
    $('#unusual')[0].play();
  } else {
    // What's New Pussycat?
    $('#pussycat')[0].playbackRate=playback_speed;
    $('#pussycat')[0].play();
    playback_speed = Math.pow(1.1, john_count);
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

function startGame(){
  currContainer = "game_container";
  
  numLives = maxDifficulty - userDifficulty + 1;
  if(userDifficulty == maxDifficulty){
    maxWrongAnswersText = maxWrongAnswersMC = 1;
  } else if(userDifficulty < 4){
    maxWrongAnswersMC = 3;
  } else if(userDifficulty >= highDifficulty){
    maxWrongAnswersText = 2;
    maxWrongAnswersMC = 1;
  }
  numLivesRemaining = numLives;
  showLives();

  if(name.indexOf(' ') > -1){
    $("#howto_cont").prepend("<span>welcome,<br>" + name.substr(0,name.indexOf(' ')).toLowerCase() + "</span>");
  } else {
    $("#howto_cont").prepend("<span>welcome,<br>" + name.toLowerCase() + "</span>");
  }

  $("#howto_cont").show();
  
  hideConfirm();
  generateCharacter();
  generateCode();

  if(userDifficulty < highDifficulty){
    if(playMusic){
      playMusic == false;
      // TODO: gradual fadeIn
      //$('#music')[0].animate({volume: 1.0}, 2000);
      $('#music')[0].play();
    }
  } else {
    if(!playMusic){
      playMusic == false;
      $('#music')[0].pause();
    }
    //playMulaney();
  }
}

function showLives(){
  // place numLives worth of char prof images top left
  for (var l = 0; l < numLives; ++ l)
    $('#display_lives').append('<img class=\'charLifeImage\' alt=\'LIFE\' src=\'img/chars/prof-pic/' + thisCharacter.image + '\'>');

}

function outOfLives(){
  characterDie();
  $('#death_music')[0].play();
  window.setTimeout(function() {
    showCont("death_container");
    startTimer(DEATH_TIME_LIMIT, "death", DEATH_COLOR_CODES);
    $("#death_container").animate({
      backgroundColor: '#000000'
    }, 5000);
  }, (dieSpeed * (thisCharacter.gameDeathPosX.length) + 1000));
}

function loseLife(lastQuestion){
  numLivesRemaining--;
  // grey out character life
  $(".charLifeImage").eq(numLivesRemaining).css('filter','brightness(15%)');

  if(numLivesRemaining == 0){
    outOfLives();
  } else {
    if(!lastQuestion){
      skip_question = true;
      nextQuestion();
    }
  }
}

var cc = igs;

function nextQuestion(){
  
  if(currQuestion > 0){
    // For questions 13-15, 1/12 chance of occurring:
    if(currQuestion > 11 && ((Math.random() * 12) < 1)){
      generateDB();
    }
    
    var correct_answer = questions[currQuestion - 1].answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

    if (user_answer == correct_answer) {
      $("#correct_answer")[0].play();
      allow_keys = false;
      //$('.question_box').eq(currQuestion - 1).find('.choice').unbind();

      skip_question = true;
      if(questions[currQuestion - 1].type == 'mc'){
        user_answer_choice.css('border-color','#54ff29');
        $('.question_box').eq(currQuestion - 1).find('.choice').addClass('unclickable');
      } else {
        $('.question_box').eq(currQuestion - 1).find('.answer').css('border-color','#54ff29');
        $('.question_box').eq(currQuestion - 1).find('.answer').addClass('unclickable');
      }
    }

    if (skip_question){
      skip_question = false;

      if(currQuestion < numQs){
        wrongAnswers = 0;
        characterWalk(stepTime, questionSlideTime, questionStoppingPoint);

        $("#on_question").text((currQuestion + 1) + "/15");

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
              if(questions[currQuestion - 1].type == 'text' || questions[currQuestion - 1].type == 'caption'){
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
        gameBackgroundScroll(questionSlideTime);
        characterWalk(stepTime, (questionSlideTime * 1.5), questionStoppingPoint);
        $('#victory_music')[0].play();

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
              characterChangePos(stepTime, exitTime, exitStoppingPoint, '100vw');
              startTimer(VICTORY_TIME_LIMIT, "victory", VICTORY_COLOR_CODES);
            }
          });
        }, 500);
      }
    } else {
      wrongAnswers++;

      $("#wrong_answer")[0].play();

      if(questions[currQuestion - 1].type == 'mc'){
        user_answer_choice.css('border-color','red');
        user_answer_choice.addClass('unclickable');
      } else if(questions[currQuestion - 1].type == 'text' || questions[currQuestion - 1].type == 'caption'){
        $('.question_box').eq(currQuestion - 1).find('.answer').css('border-color','red');
        $('.question_box').eq(currQuestion - 1).children('.wrong_cont').children('.wrong' + wrongAnswers).css('display','inline');
      }
      if(wrongAnswers==maxWrongAnswers){
        allow_keys = false;
        if(currQuestion < numQs){
          loseLife();
        } else {
          loseLife(true);
        }
      }
    }
  } else {
    characterWalk(stepTime, questionSlideTime, questionStoppingPoint);
    if(userDifficulty >= highDifficulty){
      playMusic = false;
      $('#music')[0].pause();
      playMulaney();
    }
    $("#on_question").text((currQuestion + 1) + "/15");
    setTimeout(function(){
      gameBackgroundScroll(questionSlideTime);
      $('.question_box').eq(currQuestion).animate({
        left: "70vw"
      }, questionSlideTime, function() {
        // Animation complete
        currQuestion++;
        if(questions[currQuestion - 1].type == 'text' || questions[currQuestion - 1].type == 'caption'){
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
  $('#click')[0].play();
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

      if(get_a(user_code) == get_c(cc)){

      //if(user_code == get_c(cc)){
        console.log('WIN');
        window.location.href = "ine_1203984jq98wehq9230";
        //TODO: showCont("answer_container");
      } else {
        console.log("Donald Trump: \"WRONG!\"");
      }
    }
});

$('#enter_code_container').on('click', '#return', function(){
  showCont("start_container");
  $('#click')[0].play();
});

$('#character_selection_container').on('mouseenter', '#left_arrow,#right_arrow', function(){
    $(this).attr('src','img/tools/arrow_hover.png');
});

$('#character_selection_container').on('mouseleave', '#left_arrow,#right_arrow', function(){
    $(this).attr('src','img/tools/arrow.png');
});

$('#character_selection_container').on('click', '#left_arrow', function(){
    currChar = (currChar + numCs - 1) % numCs;
    nextCharacter();
    $('#click')[0].play();
});

$('#character_selection_container').on('click', '#right_arrow', function(){
    currChar = (currChar + 1) % numCs;
    nextCharacter();
    $('#click')[0].play();
});

$('#character_selection_container').on('click', '#select', function(){
  startConfirmation();
  $('#click')[0].play();
}); 

$('#difficultySlider').on('change', function(){
  userDifficulty = parseInt($('#difficultySlider').val());
});

$('#confirm_container').on('click', '#yes', function(){
  startGame();
  $('#click')[0].play();
});

$('#confirm_container').on('click', '#no', function(){
  enter_to_start = false;
  $('#click')[0].play();

  // Load character_selection
  showCont("character_selection_container");
  $('#conf_answer > span').hide();
  nextCharacter();
  $('#loadbar').width(0);
  $('#loadbar').css('transform','skewX(-25deg)');
});

$('#game_container').on('mouseenter', '.hint_avail', function(){
  $(this).attr('src','img/tools/lightbulb_inv.png');
});


$('#game_container').on('mouseleave', '.hint_avail', function(){
  $(this).attr('src','img/tools/lightbulb.png');
});

$('#game_container').on('click', '.hint_avail', function(){
  $(this).removeClass('hint_avail');
  $(this).attr('src','img/tools/lightbulb_off.png');
  addHint();
});

$('.mulaney').on('ended', function(){
  playMulaney();
});

$('#char_sound').on('ended', function(){
  enter_to_start = true;
});

$('#char_sound').on("canplay", function () {
  // charSoundDuration = Math.min(maxSoundDuration, $('#char_sound')[0].duration);
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

$('#game_container').on('click', '.text-enter', function(){
  if(allow_keys){
    if(currQuestion != 0){
      user_answer = $('.question_box').eq(currQuestion - 1).find('.answer').val().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    }
    nextQuestion()
  }
});

$('#enter').on('click', function(event){
  if(!$(this).hasClass('unclickable')){
    nextQuestion();
    $('#click')[0].play();
    $(this).addClass('unclickable');
  }
});

$('#game_container').on('click', '.choice', function(){
  if(!$(this).hasClass('unclickable')){
    user_answer_choice = $(this);
    user_answer = user_answer_choice.text().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    nextQuestion();
  }
});

$('#death_container').on('click', 'svg', function(){
  clearInterval(timerInterval);
  showCont("start_container");
  refreshGame();
  $('#click')[0].play();
});

$('#victory_cont').on('click', 'svg', function(){
  clearInterval(timerInterval);
  showCont("start_container");
  refreshGame();
  $('#click')[0].play();
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
    updateHandle($handle[0], this.value);
    updateState($handle[0], this.value);
  } }).

on('input', function () {
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
  if (!_.contains(currentState.range, parseInt(val))) {
    updateState(el, val);
  }
}

// Change the state of the slider
function updateState(el, val) {
  if(val < maxDifficulty){
    for (var j = 0; j < sliderStates.length; j++) {if (window.CP.shouldStopExecution(0)) break;
      if (_.contains(sliderStates[j].range, parseInt(val))) {
        currentState = sliderStates[j];
        // updateSlider();
      }
    }
  } else {
    currentState = sliderStates[2]; // if max difficulty, set to high difficulty
  }

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
  refreshGame();
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
    classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
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







