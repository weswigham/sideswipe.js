var swipe = null;

$(document).ready(function () {
  'use strict';
  
  swipe = Sideswipe('.container', ['/', '/pages/1.html', '/pages/2.html', '/pages/3.html']);
  //swipe will be null if this is called on a page not in the array
  
  swipe.onStartTransition = function(selector, url, dir, dur) {
    $('.left').removeClass('disabled');
    $('.right').removeClass('disabled');
    if (url=='/') {
      $('.left').addClass('disabled');
    }
    if (url=='/pages/3.html') {
      $('.right').addClass('disabled');
    }
  }
});

function left() {
  swipe.right();
};

function right() {
  swipe.left();
}