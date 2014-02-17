/* jshint browser: true, jquery: true */
/* global Hammer: false */

(function() {
  'use strict';
  
  var tend_evt = "transitionend webkitTransitionEnd oTransitionEnd msTransitionEnd";

  function transitionTo(selector, url, dir, speed, easing, onend) {
    speed = speed || 800;
    easing = easing || "ease-in-out 0s";
    dir = dir==="right" ? "right" : "left";
    
    $.get(url, function(data) {
    
      var xmldoc = $.parseHTML(data);
      var title = $('<div />').html(decodeURIComponent(data.match(/<title>([\s\S]*?)<\/title>/)[1].trim())).text();
      document.title = title;
      
      var element = $(selector);
      var copy = element.clone().html($(selector, xmldoc).html());
      var offset = element.position();
      copy.offset(offset);
      copy.css("position","absolute"); //Now they're exactly on top of one another...
      var dist = element.parent().width();
      
      if (dir==="right") {
        dist = dist * -1;
      }
      copy.css("left", "+="+dist);
      element.after(copy);
      
      var original_left = element.get(0).style.left;
      var original_pos = element.get(0).style.position;
      var original_trans = element.get(0).style.transition;
      var original_width = element.get(0).style.width;
      var width = element.width();
      element.css("position", "relative");
      element.css("left", "0");
      element.css("width", width);
      copy.css("width", width);
      
      //jQuery animations are slow and choppy by comparison to CSS ones.
      /*
      copy.animate({left: "-="+dist}, speed, function() {
      
      });
      element.animate({left: "-="+dist}, speed, function() {
        element.html(copy.html());
        element.css("left", original_left);
        element.css("position", original_pos);
        copy.remove();
      });*/
      
      var cleaned = false;
      var cleanup = function(){
        if (cleaned) { return; }
        element.html(copy.html());
        element.css("transition", original_trans);
        element.css("left", original_left);
        element.css("position", original_pos);
        element.css("width", original_width);
        copy.remove();
        cleaned = true;
        if (onend) {
          onend();
        }
      };
      
      element.one(tend_evt, cleanup);
      
      var trans = "left "+speed+"ms "+easing;
      var cssChanges = {
        left: "-="+dist,
        WebkitTransition : trans,
        MozTransition    : trans,
        MsTransition     : trans,
        OTransition      : trans,
        transition       : trans
      };
      
      element.css(cssChanges);
      copy.css(cssChanges);
      
      
      setTimeout(function() {
        cleanup();
      }, speed + 5);
      
    });
  }
  
  function activate(selector, linklist) {
    var curpage = linklist.indexOf(window.location.pathname);
    if (curpage<0) { return; } //we're apparently not on a path we're supposed to be, ignore the request
    
    var returns = {
      onStartTransition: function() {},
      onEndTransition: function() {},
      onLeftBound: function() {},
      onRightBound: function() {},
      left: function(duration) {

        var pos = linklist.indexOf(window.location.pathname);
        if (pos<0) { return; } //we're apparently not on a path we're supposed to be
        if (pos===(linklist.length-1)) { //On the boundary already. Do a bounce animation? Expand a sidebar?
                returns.onRightBound();
                return;
        }
          
        returns.onStartTransition(selector, linklist[pos+1], "left", duration);
        transitionTo(selector, linklist[pos+1], "left", duration, null, returns.onEndTransition);
        history.pushState({contentarea: selector, link: linklist[pos+1], dir: "left"}, "Swipeleft page", linklist[pos+1]);
      },
      right: function(duration) {
        var pos = linklist.indexOf(window.location.pathname);
        if (pos<0) { return; } //we're apparently not on a path we're supposed to be
        if (pos===0) { //On the boundary already. Do a bounce animation? Expand a sidebar?
          returns.onLeftBound();
          return;
        }
        
        returns.onStartTransition(selector, linklist[pos-1], "right", duration);
        transitionTo(selector, linklist[pos-1], "right", duration, null, returns.onEndTransition);
        history.pushState({contentarea: selector, link: linklist[pos-1], dir: "right"}, "Swiperight page", linklist[pos-1]);
      }
    };

    var element = document.querySelector(selector);
    var pos = linklist.indexOf(window.location.pathname);
    
    history.pushState({contentarea: selector, link: linklist[pos]}, document.title, window.location.pathname);
    
    (new Hammer.Instance(element, { 
      prevent_default: true,
      no_mouseevents: true
    })).on("swipeleft swiperight", function(ev) {
    
      if (!ev.gesture) { return; }
      
      var velocity = Math.abs(ev.gesture.distance/ev.gesture.deltaTime);
      var duration = (1/velocity)*800;
      
      var pos = linklist.indexOf(window.location.pathname);
      if (pos<0) { return; } //we're apparently not on a path we're supposed to be
      if (ev.type === "swipeleft") {
        returns.left(duration);
      } else { //swiperight
        returns.right(duration);
      }
    });
    
    window.onpopstate = function(data) {
      returns.onStartTransition(data.state.contentarea, data.state.link, data.state.dir, 800);
      transitionTo(data.state.contentarea, data.state.link, data.state.dir, null, null, returns.onEndTransition);
    };
  
    return returns;
  }
    
  window.Sideswipe = activate;

})(this);
