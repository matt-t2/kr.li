var doc = window.document,
  context = doc.querySelector('#img-wheel'),
  disableScroll = false,
  //scrollWidth = (($(window).height() * 20 * 80) / 100),
  scrollWidth = 0.0,
  scrollPos = 0.0,
  clonesWidth = 1.0 * scrollWidth,
  i = 0,
  exp_imgs = false,
  mainImgBox;

$('#click')[0].volume=0.1;

function setVisibility(){
  $(".content").each(function(){
      if($(this).visible( true )){
        $(this).animate({
          opacity: 1.0
        }, {
          queue: false,
          duration: 100
        });
      }
    });
}

function expandImg(img){
  var $dup_img = img.clone();
  $("#main-img").html($dup_img);
  exp_imgs = true;
}

function fillWheel(callback){
  $('.timeline img').clone().appendTo('#img-wheel');
  $('.timeline img').clone().appendTo('#img-wheel').addClass('is-clone');
  
}

function setWheelPos(img){

  $('#img-wheel img').each(function(){
    if($(this).attr('src') == img.attr('src')){
      mainImgBox = $(this)[0].getBoundingClientRect();
      return false;
    }
  });

  // position = (img x pos relative to container) + (window.width / 2) - (img width / 2)
  console.log(mainImgBox);
  console.log("x: " + mainImgBox.x);
  console.log("window: " + $(window).width());
  console.log("img width: " + mainImgBox.width);
  console.log("clonesWidth: " + clonesWidth);
  var setXPos = parseInt(mainImgBox.x - ($(window).width() / 2) + (mainImgBox.width / 2));

  console.log("---------- " + setXPos + " ---------");
  setXPos = parseInt((setXPos+clonesWidth)%clonesWidth);

  setScrollPos(setXPos);
}


function getScrollPos () {
  return (context.pageXOffset || context.scrollLeft) - (context.clientLeft || 0);
}

function setScrollPos (pos) {
  $('#img-wheel').scrollLeft(pos);
  console.log("setScrollPos: " + pos);
}

function getClonesWidth () {
  clonesWidth = 0;

  $('.is-clone').each(function(){
    clonesWidth = clonesWidth + $(this)[0].getBoundingClientRect().width + parseFloat($(this).css('margin-left'));
  });

  return clonesWidth;
}

function reCalc () {
  scrollPos = getScrollPos();
  if(context.scrollWidth != 0){
    scrollWidth = context.scrollWidth;
  }
  scrollWidth = context.scrollWidth;
  clonesWidth = getClonesWidth();

  if (scrollPos <= 0) {
    setScrollPos(1); // Scroll 1 pixel to allow upwards scrolling
    scrollPos = 1;
  }
}

function scrollUpdate () {
  if (!disableScroll) {
    scrollPos = getScrollPos();

    if (clonesWidth + scrollPos >= scrollWidth) {
      // Scroll to the left when you’ve reached the right
      setScrollPos(1); // Scroll right 1 pixel to allow left scrolling
      disableScroll = true;
    } else if (scrollPos <= 0) {
      // Scroll to the right when you reach the left
      setScrollPos(scrollWidth - clonesWidth);
      disableScroll = true;
    }
  }

  if (disableScroll) {
    // Disable scroll-jumping for a short time to avoid flickering
    window.setTimeout(function () {
      disableScroll = false;
    }, 40);
  }
}

function init () {
  reCalc();
  
  context.addEventListener('scroll', function () {
    window.requestAnimationFrame(scrollUpdate);
  }, false);

  window.addEventListener('resize', function () {
    window.requestAnimationFrame(reCalc);
  }, false);
}

if (document.readyState !== 'loading') {
  init()
} else {
  doc.addEventListener('DOMContentLoaded', init, false)
  $(this).scrollTop(0);
}




/********************
 *                  *
 *      EVENT       *
 *    LISTENERS     *
 *                  *
 ********************/

$(window).scroll(function(){
  setVisibility();
});

$('.timeline').on('click', 'img', function(){
  var expImg = $(this);
  expandImg(expImg);

  $('#expand-images').show(0,function(){
    reCalc();
    setWheelPos(expImg);
  });


  // $('#expand-images').show();
  // setWheelPos($(this));

  // fillWheel(function() {
  //   console.log('finished wheel');
  //   reCalc();

  // });
});

$(document).on('keydown', function(event){
  if(exp_imgs){
    var main_src = $('#main-img img').attr('src');

    if(event.keyCode == '37'){ // left arrow key
      $('#img-wheel img').each(function(){
          if($(this).attr('src') == main_src){
            expandImg($(this).prev());
            return false;
          }
        });
    } else if(event.keyCode == '39'){ // right arrow key
      $('#img-wheel img').each(function(){
          if($(this).attr('src') == main_src){
            expandImg($(this).next());
            return false;
          }
        });
    }
  }
});

$('#img-wheel').on('click', 'img', function(){
  expandImg($(this));
});

$('#expand-images').on('mouseenter', '#left_arrow,#right_arrow', function(){
    $(this).attr('src','img/tools/arrow_hover.png');
});

$('#expand-images').on('mouseleave', '#left_arrow,#right_arrow', function(){
    $(this).attr('src','img/tools/arrow.png');
});

$('#expand-images').on('mouseenter', '#ex', function(){
    $(this).attr('src','img/tools/ex_hover.png');
});

$('#expand-images').on('mouseleave', '#ex', function(){
    $(this).attr('src','img/tools/ex.png');
});

$('#expand-images').on('click', '#left_arrow', function(){
    var main_src = $('#main-img img').attr('src');
    $('#img-wheel img').each(function(){
      if($(this).attr('src') == main_src){
        expandImg($(this).prev());
        return false;
      }
    });
    $('#click')[0].play();
});

$('#expand-images').on('click', '#right_arrow', function(){
    var main_src = $('#main-img img').attr('src');
    $('#img-wheel img').each(function(){
      if($(this).attr('src') == main_src){
        expandImg($(this).next());
        return false;
      }
    });
    $('#click')[0].play();
});

$('#expand-images').on('click', '#ex', function(){
    setScrollPos(1);
    $('#expand-images').hide();
    $('#click')[0].play();
});


// TODO:  x button,  move img far left in wheel onclick




setVisibility();
fillWheel();
