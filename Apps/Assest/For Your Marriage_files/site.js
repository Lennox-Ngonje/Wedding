/////////////////////////////////////////////////////////////////////////////////////
// Crosby Start Theme - Child Theme - site.js - add your javascript functions here //
/////////////////////////////////////////////////////////////////////////////////////
// Site.js v0.0.1
//
// TABLE OF CONTENTS
//

// 2. Freeze Element from Scrolling
// 3. Slick Carousel (v1.7.1), https://github.com/kenwheeler/slick
// 4. Set Page Cover Height for Primary Menu
// 5. jQuery UI select menu
// 6. Popover (backup)




//  2. "fixed-element" is the class of the overlay (fixed element) what has "position: fixed", Call disableScroll() and enableScroll() to toggle
var freeze = function(e) {
  if (!document.getElementsByClassName("fixed-element")[0].contains(e.target)) {
    e.preventDefault();
  }
}

var disableScroll = function() {
  console.log('scrolling is disabled');

  // Only accept touchmove from fixed-element
  document.addEventListener('touchmove', freeze, false);

  // Prevent background scrolling
  document.getElementsByClassName("fixed-element")[0].addEventListener("touchmove", function(e) {
    var top = this.scrollTop,
      totalScroll = this.scrollHeight,
      currentScroll = top + this.offsetHeight;

    if (top === 0 && currentScroll === totalScroll) {
      e.preventDefault();
    } else if (top === 0) {
      this.scrollTop = 1;
    } else if (currentScroll === totalScroll) {
      this.scrollTop = top - 1;
    }
  });
}

var enableScroll = function() {
  document.removeEventListener("touchmove", freeze);
  document.body.style.overflow = "";
}


// 3. Slick Sliders
jQuery( document ).ready(function() {

  jQuery(".de-slider").slick({
  
    // normal options...
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    dots: true,
    arrows: true,
  
    // the magic
    responsive: [
       {
  
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
          arrows: true,
        }
  
      }, {
  
        breakpoint: 830,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        }
  
      }
  ]

  });


/* Toggle scrollbar when the menu expands */
/*
jQuery('.navbar-toggle').click( function() {

  var scrollAmount = jQuery('body').scrollTop();
  jQuery('body').css('overflow','hidden').scrollTop(scrollAmount);

  jQuery( 'body' ).toggleClass( "overflow-hidden" );
  jQuery( '.custom-container' ).toggleClass( "menu-open" );

  // disableScroll();
  // jQuery( '.navbar-toggle' ).toggleClass( "navbar-margin-right" );
});
*/

/* Toggle scrollbar when the menu expands, toggle freeze scroll of browser */
var x = false;
jQuery('.navbar-toggle').on('click', function(){

  var scrollAmount = jQuery('body').scrollTop();
  // jQuery('body').css('overflow','hidden').scrollTop(scrollAmount);

  jQuery( 'body' ).toggleClass( "overflow-hidden" );
  jQuery( '.custom-container' ).toggleClass( "menu-open" );
  jQuery( '.utility-navbar' ).toggleClass( "hidden" );
  jQuery( '.navbar-toggle' ).toggleClass( "active" );
  jQuery( '.navbar-marriage' ).toggleClass( "position-static" );
  jQuery( '.box-shadow' ).toggleClass( "margin-top-zero" );

  


 if (!x){
  //function
  x = true;
  jQuery('.small-menu').text('CLOSE');

  //disableScroll();
 }
 else {
  //function
  x = false;
  jQuery('.small-menu').text('MENU');

  //enableScroll();
 }
});


/***********************************************/
/* set page cover height on load and resize
/***********************************************/
function setPageCoverSize() {
	
	// 1. Homepage Height Scaler
  var winWidth = jQuery(window).width();
  var winHeight = jQuery(window).height();
  
  // 2. Set the primary menu container height
  /*
  jQuery('#fym-primary-menu')
  .slideDown( 3200, 'easeOutBounce',  function() {
    // Animation complete.
  }).css('height', winHeight+'px' );
  */

  // jQuery('#fym-primary-menu').css('width', winWidth+'px' );
  jQuery('#fym-primary-menu').css('height', winHeight+'px' );

}
setPageCoverSize();

// this runs the function when the window loads and if it is resized.
jQuery(document).ready(setPageCoverSize); // When the page first loads
jQuery(window).resize(setPageCoverSize); // When the browser changes size



/* Search Button :: Expand Search Field
---------------------------------------------------------*/
jQuery('button.searchbox-toggle').click( function() {
  jQuery( 'div.searchbox-collapse' ).toggleClass( "in" );
  jQuery( ".search-field" ).focus();
});


jQuery( function() {
  jQuery( "#stateAbbr" )
  .selectmenu()
  .selectmenu( "menuWidget" )
    .addClass( "overflow" );
});


});


/* Search Button :: form-validation */
const inputs = document.querySelectorAll("input.search-field");

inputs.forEach(input => {
  input.addEventListener(
    "invalid",
    event => {
      input.classList.add("error");
    },
    false
  );

});


/* 6. Popover (backup) */
/*
jQuery(document).ready(function(){
  jQuery('[data-toggle="popover"]').popover();	
});
*/