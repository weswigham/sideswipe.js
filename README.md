sideswipe.js
============

Sideswipe.js is a utility for automatically ajaxifying your traditionally-designed pages with fancy touch gestures. 

Depends on hammer.js and jQuery (sorry).

How to start using sideswipe.js
-------------------------------

```js
$(document).ready(function() {
    var swipe = Sideswipe(".content", ["/", "/about/"]);
    //The first argument (".content") is the selector for the common 
    //section between the pages for sideswipe to transition between
    //The second argument is an array of the pages to transition between.
    
    
    swipe.onStartTransition = function(selector, url, direction, duration) {
        //selector is the selector you passed to the sideswipe function
        //url is the url sideswipe is transitioning to
        //direction is either 'left' or 'right'
        //duration is the time the transition has to complete 
        //    (determined by the velocity of the swipe gesture)
        //called whenever a transition to another page is triggered, so you can 
        //update any elements in your page that sideswipe may leave out
        //   (say, the selected element in your navbar)
    };
    swipe.onEndTransition = function() {
        //Called whenever a transition between pages finishes, 
        // useful for calling javascript that needs to be on the new page 
    };
    swipe.onLeftBound = function() {
        //Called whenever the swipe gesture is triggered to go left, but 
        // the left boundary page is already active
    };
    swipe.onRightBound = function() {
        //Same as the left bound, but for the right bound
    };
    
    swipe.left(); //Emulate a left swipe transition
    swipe.right(); //Emulate a right swipe transition
}
```
