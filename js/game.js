// JS file for animation, generating questions

/********************
 *                  *
 *    CHARACTER     *
 *                  *
 *                  *
 ********************/

var chars = [
  {
    // 10
    "name":"Terk",
    "image":"ape.png",
    "backgroundPosX":["-1%", "10.75%", "22%", "33.25%", "44.5%", "55.5%", "66.25%", "77.5%", "89.75%", "100%"],
    "backgroundPosY":"75%",
    "backgroundSize":"auto 105%",
    "height":"20vw",
    "width":"20vw",
    "stepTime":200
  }, {
    // 14
    "name":"Zelda",
    "image":"link.png",
    "backgroundPosX":["0.5%","8%","15.75%","23%","31%","38.5%","46%","53.5%","60.5%","67.5%","75.5%","83.5%","90.5%","98%"],
    "backgroundPosY":"100%",
    "backgroundSize":"auto 110%",
    "height":"15vw",
    "width":"14vw",
    "stepTime":100
  }, {
    // 10
    "name":"Mike",
    "image":"cyclops.png",
    "backgroundPosX":["-0.5%", "10.25%", "21.5%", "32.75%", "44.5%", "55%", "65.25%", "76.5%", "87.75%", "99%"],
    "backgroundPosY":"75%",
    "backgroundSize":"auto 100%",
    "height":"20vw",
    "width":"25vw",
    "stepTime":300
  }, {
    // 14 
    "name":"Jack Lumberton",
    "image":"jack.png",
    "backgroundPosX":["-0.5%","7%","15%","22%","29%","37%","44%","52%","59.5%","67.5%","75.5%","83%","91%","99%"],
    "backgroundPosY":"75%",
    "backgroundSize":"auto 100%",
    "height":"20vw",
    "width":"22vw",
    "stepTime":200
  }, {
    // 12
    "name":"Other Jack",
    "image":"skel.png",
    "backgroundPosX":["0%","9%","18%","27%","37%","46%","54.5%","63.5%","72.5%","81.75%","91.25%","100.75%"],
    "backgroundPosY":"75%",
    "backgroundSize":"auto 100%",
    "height":"20vw",
    "width":"20vw",
    "stepTime":200
  }, {
    // 12
    "name":"Satan Claws",
    "image":"santa.png",
    "backgroundPosX":["-0.5%","8%","17%","27%","37%","46%","55%","64.5%","74%","83.5%","92.5%","101.25%"],
    "backgroundPosY":"75%",
    "backgroundSize":"auto 100%",
    "height":"20vw",
    "width":"13vw",
    "stepTime":200
  }, {
    // 4
    "name":"Girl Zelda",
    "image":"zelda.png",
    "backgroundPosX":["0%","33%","66%","98%"],
    "backgroundPosY":"75%",
    "backgroundSize":"auto 100%",
    "height":"20vw",
    "width":"20vw",
    "stepTime":200
  }, {
    // 13
    "name":"Baloo",
    "image":"bear.png",
    "backgroundPosX":["0%","8%","16.25%","25%","33.25%","42.5","51%","59.5%","67.5%","76.5%","84.75%","94.5","100.75%"],
    "backgroundPosY":"75%",
    "backgroundSize":"auto 100%",
    "height":"20vw",
    "width":"18vw",
    "stepTime":200
  }, {
    // 11
    "name":"Bumble",
    "image":"yeti.png",
    "backgroundPosX":["-1%","9%","19.5%","30.5%","39.75%","48.75%","58.75%","67.5%","78%","87.5%","97.5%"],
    "backgroundPosY":"75%",
    "backgroundSize":"auto 100%",
    "height":"20vw",
    "width":"18vw",
    "stepTime":200
  }, {
    // 14
    "name":"Zombae",
    "image":"zombie.png",
    "backgroundPosX":["-0.5%","6.5%","13.25%","21%","28.5%","36%","44.25%","52.5%","60%","68%","76%","84.5%","92.5%","100.5%"],
    "backgroundPosY":"75%",
    "backgroundSize":"auto 100%",
    "height":"20vw",
    "width":"15vw",
    "stepTime":300
  }
];

// var walkSpeedBeta = 800;
// var currCharTesting = 9;

var name;
var thisCharacter;
var xPos = 0;
var xLength;
var stepTime;

function qs() {
    var character = window.location.search.substring(1);
    var pos = character.indexOf('=');
    if (pos > 0 && character.substring(0, pos) == "char"){
        name = character.substring(pos + 1);
    } else {
        window.location.href = "/";
    }
}

qs();

// stepSpeed = 500; // in milliseconds



function characterWalk(sTime, wTime){
  var stoppingPoint = Math.ceil((wTime / sTime) / xLength) * xLength;

  var walkingAnimation = window.setInterval(function(){
    xPos++;

    if(xPos == stoppingPoint){
      xPos = 0;
      clearInterval(walkingAnimation);
    }
    
    $("#character").css('background-position',thisCharacter.backgroundPosX[xPos % xLength] + ' ' + thisCharacter.backgroundPosY);
  }, sTime);


  // ws / ss = projected # of steps
  // Math.ceil((ws / ss) / x_len) * x_len



}

function characterEnter(sTime, wTime){
  characterWalk(sTime, wTime);
  var slideCharacter = window.setInterval(function() {
    $("#character").css('left', '+=1');
  }, 20);
  setTimeout(function() {
    clearInterval(slideCharacter);
  }, wTime);
}

function generateCharacter(){
  thisCharacter = chars.find(element => element.name.replace(/ /g,'') == name);
  //thisCharacter = chars[currCharTesting];
  xLength = thisCharacter.backgroundPosX.length;
  stepTime = thisCharacter.stepTime;
  var enterTime = 8000; // in milliseconds
  // Update animation time so character finishes at rest
  var stoppingPoint = Math.ceil((enterTime / stepTime) / xLength) * xLength;
  enterTime = stepTime * stoppingPoint;

  $("#character").css('background-image','url(img/chars/walking/' + thisCharacter.image + ')');
  $("#character").css('background-position',thisCharacter.backgroundPosX[xPos] + ' ' + thisCharacter.backgroundPosY);
  //$("#character").css('left',thisCharacter.left[xPos]);
  $("#character").css('background-size',thisCharacter.backgroundSize);
  $("#character").css('height',thisCharacter.height);
  $("#character").css('width',thisCharacter.width);
  $("#character").css('left','-' + thisCharacter.width);
  characterEnter(stepTime, enterTime);

  // Add grayscale for zombie (she doesn't have enough contrast with background)
  if(thisCharacter.image == "zombie.png"){
    $(".bg").css("filter","grayscale(80%)");
    $(".bg").css("-webkit-filter","grayscale(80%)");
  }
}





generateCharacter();





// function characterWalkBeta(){
//   $("#character").css('left',thisCharacter.width);
//   window.setInterval(function(){
//     xPos = (xPos + 1) % xLength;

//     $("#character").css('background-position',thisCharacter.backgroundPosX[xPos] + ' ' + thisCharacter.backgroundPosY);
//     //$("#character").css('left',thisCharacter.left[xPos]);
//   }, walkSpeedBeta);
// }

// characterWalkBeta();

/********************
 *                  *
 *     PARALLAX     *
 *    BACKGROUND    *
 *                  *
 ********************/

$(window).scroll(function() {
  var windowScroll = this.scrollX / $(window).width();
  $('#bg3').css('transform','translateX(-' + windowScroll*.5 + '%');
  $('#bg4').css('transform','translateX(-' + windowScroll*1.2 + '%');
  $('#bg5').css('transform','translateX(-' + windowScroll*2 + '%');
  $('#ground').css('transform','translateX(-' + windowScroll*4 + '%');
});

function backgroundScroll(bgSlideTime) {
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




// var slideCharacter = window.setInterval(function() {
        //   $("#character").css('left', '+=1');
        // }, 20);
        // setTimeout(function() {
        //   clearInterval(slideCharacter);
        // }, questionSlideTime);
//}



/********************
 *                  *
 *    QUESTIONS     *
 *                  *
 *                  *
 ********************/

var content = [
  {
    "name":"Santa has hidden a secret message on one of the escape room presents. Can you find a clue hidden on the package? What is the secret message?",
    "answer":"merryxmas",
    "image":"img/questions/christmas.jpg",
    "hints":["This is the easiest one if you need a hint this could be a rough time","Seriously this is going to be a grind if you're struggling already","I can just give you the final code it's no big deal"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"aninsideman",
    "image":"img/questions/inside_man.gif",
    "hints":["Hopefully you like Rebus puzzles because I leaned into this","The color is unimportant","movie starring Jodie Foster: cover model of Coppertone & the inspiration of Reagan shooters"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"foreignfilm",
    "image":"img/questions/foreign.gif",
    "hints":["Samarth couldn't solve this but he also didn't know how to spell the word","Parasite is one","City of God is another"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"foronceinmylife",
    "image":"img/questions/my_life.jpg",
    "hints":["Count the number of numbers","Stevie Wonder song","Michael Buble did a cover but AFAIK it's not a Christmas song"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"forbiddenfruit",
    "image":"img/questions/forbidden_fruit.png",
    "hints":["It's 'bidden' not 'Biden'","they're grapes but more generically they are...","apples, snakes, etc."]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"topsecret",
    "image":"img/questions/top_secret.jpg",
    "hints":["not middle","not bottom","Great Val Kilmer parody movie"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"afriendinneedisafriendindeed",
    "image":"img/questions/friend_in_need.jpg",
    "hints":["includes pronouns of course","sort of a glass-half-full kind of expression","https://gogetfunding.com/wp-content/uploads/2017/04/5193622/img/IMG_1553.JPG"]
  }, {
    "name":"Almost done!!",
    "answer":"forthecommondefense",
    "image":"img/questions/forthecommondefense.gif",
    "hints":["lawyers would know this","maybe criminals too","geez read To Kill A Mockingbird or something"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"onceinabluemoon",
    "image":"img/questions/once_in_a_blue_moon.jpg",
    "hints":["color","for those speaking the Queen's English, colour","think of a certain Belgian-style witbier"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"whatgoesupmustcomedown",
    "image":"img/questions/what_goes_up.jpg",
    "hints":["this is in a song","would be an appropriate if unexpected song to be used for elevator music","you should probably give up if you can't solve this"]
  }, {
//    "name":"We received this mysterious message in the mail from an unknown source, urging us to discontinue using the thorium reactor we got such a sweet deal on. This message is more that it appears. Can you unlock the hidden message?",
//    "answer": "ifyoufounditkeephissecretshidden",
//    "image":"img/questions/urgent_request.jpg",
//    "hints":["think back to 6th grade","specifically, keyboarding class"]
//  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"greenpeace",
    "image":"img/questions/greenpeace.jpg",
    "hints":["like Green Day but also not","it's a humanitarian group","hint 3"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"nowayjose",
    "image":"img/questions/no_way_jose.jpg",
    "hints":["I think going right-to-left is easier?","the first part is the toughest","it's a `no way` sign"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"birdseyeview",
    "image":"img/questions/birdseyeview.jpg",
    "hints":["not Twitter-related","bird's the word","BIIIIIIIIRD"]
  }, {
    "name":"There is a common phrase hidden here in this text. Can you solve this rebus puzzle and solve the hidden message?",
    "answer":"istandcorrected",
    "image":"img/questions/i_stand_corrected.jpg",
    "hints":["when you've been proven wrong","i don't know a second hint","https://giphy.com/gifs/season-3-the-simpsons-3x24-xT5LMLpjVEE0kOoPyo"]
  }, {
    "name":"Which school has a better alma mater - UNC or Cornell?",
    "answer":"they're the same",
    "image":"img/questions/unc.png",
    "hints":["Admiral Ackbar","IT'S A TRAP","the answer is: (THEY'RE THE SAME)"]
  }, {
    "name":"You find a riddle and know its answer may hold a clue to the key to your escape. The riddle reveals a story that seems to be an impossibility. How could all the players gain and none of them lose?",
    "answer":"musicians",
    "image":"img/questions/four_jolly_men.jpg",
    "hints":["the background will throw you off","what were they playing?","they were playing, but not a game"]
  }
];

var currQuestion = 0;
var numQs = content.length;
var wrongAnswers = 0;
var numHints = 0;
var questionSlideTime = 8000;
// Update animation time so character finishes at rest
var stoppingPoint = Math.ceil((questionSlideTime / stepTime) / xLength) * xLength;
questionSlideTime = stepTime * stoppingPoint;


// Generate all question boxes and position off-screen
content.forEach(function(question, index){
	var q_div = $('<div>' + 
    //'<div class=\'q_text\'>' + question.name + '</div>' + 
    '<img class=\'q_img\' alt=\'img ' + currQuestion + '\' src=\'' + question.image + '\'>' + 
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
	$('#container').append(q_div);
	q_div.addClass('question_box');
	// if(index % 2 == 0){
	// 	q_div.addClass('even');
	// }
	
});



function nextQuestion(){
  if(currQuestion > 0){
    var user_answer = $('.answer').eq(currQuestion - 1).val().toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    var correct_answer = content[currQuestion - 1].answer.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');

    if (user_answer == correct_answer) {

      if(currQuestion < numQs){
        characterWalk(stepTime, questionSlideTime);

        setTimeout(function(){
          backgroundScroll(questionSlideTime);
          
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

      }

      
      $("#hintbox_cont").empty();
      
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
    $("#howto_cont").css('display','none');
    characterWalk(stepTime, questionSlideTime);
    setTimeout(function(){
      backgroundScroll(questionSlideTime);
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

$(window).keypress(function(event){
  // Enter key = `13`, right arrow = '39'
  if(event.which == 13 || event.which == 39){
    nextQuestion();
  }
});


// TODO: on hover, change lightbulb to lightbulb_inv
// on click, change lightbulb to lightbulb_off.  make unclickable.  provide hint
$('body').on('mouseenter', '.hint_avail', function(){
    $(this).attr('src','img/lightbulb_inv.png');
});


$('body').on('mouseleave', '.hint_avail', function(){
    $(this).attr('src','img/lightbulb.png');
});

$("body").on('click', '.hint_avail', function(){
    $(this).removeClass('hint_avail');
    $(this).attr('src','img/lightbulb_off.png');
    addHint();
  }
);



































