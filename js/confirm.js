var name;

var chars = [
  {
    "name":"Terk",
    "image":"ape.png"
  }, {
    "name":"Zelda",
    "image":"link.png"
  }, {
    "name":"Mike",
    "image":"cyclops.png"
  }, {
    "name":"Jack Lumberton",
    "image":"jack.png"
  }, {
    "name":"Other Jack",
    "image":"skel.png"
  }, {
    "name":"Satan Claws",
    "image":"santa.png"
  }, {
    "name":"Girl Zelda",
    "image":"zelda.png"
  }, {
    "name":"Baloo",
    "image":"bear.png"
  }, {
    "name":"Bumble",
    "image":"yeti.png"
  }, {
    "name":"Zombae",
    "image":"zombie.png"
  }
];

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

thisCharacter = chars.find(element => element.name.replace(/ /g,'') == name);


$("#character").attr('src','img/chars/profile/' + thisCharacter.image);


$("#yes").on('click', function(){
  window.location.href = "game?char=" + name;
});

$("#no").on('click', function(){
  window.location.href = "character_selection";
});





