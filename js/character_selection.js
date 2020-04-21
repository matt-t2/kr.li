// var $name = $('.name'),
//     $img = $('.img'),
//     $generate = $('.generate'),
//     $result = $('.results'),
//     $thanks = $('.thanks'),
//     $options = $('.options');

var chars = [
  {
    "name":"Terk",
    "image":"ape.png",
    "backgroundPosition":"50% 30%",
    "backgroundSize":"80%",
    "attack":6,
    "defense":5,
    "speed":3,
    "special":2
  }, {
    "name":"Zelda",
    "image":"link.png",
    "backgroundPosition":"50% 90%",
    "backgroundSize":"40%",
    "attack":7,
    "defense":0,
    "speed":7,
    "special":2
  }, {
    "name":"Mike",
    "image":"cyclops.png",
    "backgroundPosition":"50% 75%",
    "backgroundSize":"100%",
    "attack":8,
    "defense":4,
    "speed":0,
    "special":4
  }, {
    //"name":"Jack",
    "name":"Jack Lumberton",
    "image":"jack.png",
    "backgroundPosition":"50% 115%",
    "backgroundSize":"100%",
    "attack":6,
    "defense":6,
    "speed":2,
    "special":2
  }, {
    "name":"Other Jack",
    "image":"skel.png",
    "backgroundPosition":"50% 80%",
    "backgroundSize":"45%",
    "attack":6,
    "defense":0,
    "speed":1,
    "special":8
  }, {
    //"name":"Satan",
    "name":"Satan Claws",
    "image":"santa.png",
    "backgroundPosition":"70% 95%",
    "backgroundSize":"60%",
    "attack":1,
    "defense":1,
    "speed":7,
    "special":7
  }, {
    "name":"Girl Zelda",
    "image":"zelda.png",
    "backgroundPosition":"60% 150%",
    "backgroundSize":"50%",
    "attack":1,
    "defense":6,
    "speed":8,
    "special":2
  }, {
    "name":"Baloo",
    "image":"bear.png",
    "backgroundPosition":"45% 90%",
    "backgroundSize":"65%",
    "attack":3,
    "defense":0,
    "speed":6,
    "special":8
  }, {
    "name":"Bumble",
    "image":"yeti.png",
    "backgroundPosition":"50% 100%",
    "backgroundSize":"80%",
    "attack":8,
    "defense":8,
    "speed":0,
    "special":0
  }, {
    "name":"Zombae",
    "image":"zombie.png",
    "backgroundPosition":"65% 85%",
    "backgroundSize":"65%",
    "attack":1,
    "defense":7,
    "speed":1,
    "special":8
  }
];

var currChar = 0;
var numCs = chars.length;
var stat_max = 8;
var name;

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

  $("#character").css('background-image','url(img/chars/profile/' + thisCharacter.image + ')');
  $("#character").css('background-position',thisCharacter.backgroundPosition);
  $("#character").css('background-size',thisCharacter.backgroundSize);
  $("#name").html(name);
  createStat('attack',thisCharacter.attack);
  createStat('defense',thisCharacter.defense);
  createStat('speed',thisCharacter.speed);
  createStat('special',thisCharacter.special);

  




}

nextCharacter();

$("#right_arrow").on('click', function(){
  currChar = (currChar + 1) % numCs;
  nextCharacter();
});

$("#left_arrow").on('click', function(){
  currChar = (currChar - 1) % numCs;
  if(currChar == -1){ currChar += numCs; }
  nextCharacter();
});

$("#select").on('click', function(){
  window.location.href = "confirm?char=" + name.replace(/ /g,'');
  // window.location.href = "file2
  // // TODO: character selected.  Should they confirm?
  // $("#div1").load("file2.html");
  // window.location = 'page2.html?somval=' + somval;

});

$("#left_arrow,#right_arrow").hover(
  function(){
    $(this).attr('src','img/arrow_hover.png');
  }, function() {
    $(this).attr('src','img/arrow.png');
  }
);