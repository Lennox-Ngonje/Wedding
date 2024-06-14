/* Skrollr Init
------------------------------------------------*/
if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
	
	
( function( $ ) {
    // Init Skrollr
    var s = skrollr.init({
        render: function(data) {
            //Debugging - Log the current scroll position.
            console.log(data.curTop);
        }
    });
} )( jQuery );
	
console.log('desktop');

var s = skrollr.init({
		edgeStrategy: 'set',
		smoothScrolling: true,
		// mobileDeceleration: 0.004,
		forceHeight: true,
		easing: {
			WTF: Math.random,
			inverted: function(p) {
				return 1-p;
		}
	}
});

}