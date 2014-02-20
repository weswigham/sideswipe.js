var swipe = null;

$(document).ready(function () {
  'use strict';
  
  swipe = Sideswipe('.container', ['/sideswipe.js/', '/sideswipe.js/pages/1.html', '/sideswipe.js/pages/2.html', '/sideswipe.js/pages/3.html']);
  //swipe will be null if this is called on a page not in the array
  
  swipe.onStartTransition = function(selector, url, dir, dur) {
    $('.left').removeClass('disabled');
    $('.right').removeClass('disabled');
    if (url=='/sideswipe.js/') {
      $('.left').addClass('disabled');
    }
    if (url=='/sideswipe.js/pages/3.html') {
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