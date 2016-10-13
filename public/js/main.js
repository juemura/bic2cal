jQuery(function($) {'use strict',

	//Countdown js
	 $("#countdown").countdown({
			date: "18 october 2016 00:00:00",
			format: "on"
		},

		function() {
			// callback function
		});



	//Scroll Menu

	function menuToggle()
	{
		var windowWidth = $(window).width();

		if(windowWidth > 767 ){
			$(window).on('scroll', function(){
				if( $(window).scrollTop()>405 ){
					$('.main-nav').addClass('fixed-menu animated slideInDown');
				} else {
					$('.main-nav').removeClass('fixed-menu animated slideInDown');
				}
			});
		}else{

			$('.main-nav').addClass('fixed-menu animated slideInDown');

		}
	}

	menuToggle();


	// Carousel Auto Slide Off
	$('#event-carousel, #twitter-feed, #sponsor-carousel ').carousel({
		interval: false
	});


	// Contact form validation
	var form = $('.contact-form');
	form.submit(function () {'use strict',
		$this = $(this);
		$.post($(this).attr('action'), function(data) {
			$this.prev().text(data.message).fadeIn().delay(3000).fadeOut();
		},'json');
		return false;
	});

	$( window ).resize(function() {
		menuToggle();
	});

	$('.main-nav ul').onePageNav({
		currentClass: 'active',
	    changeHash: false,
	    scrollSpeed: 900,
	    scrollOffset: 0,
	    scrollThreshold: 0.3,
	    filter: ':not(.no-scroll)'
	});

});


// Google Map Customization
(function(){

	var map;

	map = new GMaps({
		el: '#gmap',
		lat: 37.872035,
		lng: -122.258218,
		scrollwheel:false,
		zoom: 16,
		zoomControl : false,
		panControl : false,
		streetViewControl : false,
		mapTypeControl: false,
		overviewMapControl: false,
		clickable: false
	});

	var image = 'images/map-icon.png';
	map.addMarker({
		lat: 37.872035,
		lng: -122.258218,
		icon: image,
		animation: google.maps.Animation.DROP,
		verticalAlign: 'bottom',
		horizontalAlign: 'center',
		backgroundColor: '#3e8bff',
	});


	var styles = [

	{
		"featureType": "road",
		"stylers": [
		{ "color": "#b4b4b4" }
		]
	},{
		"featureType": "water",
		"stylers": [
		{ "color": "#d8d8d8" }
		]
	},{
		"featureType": "landscape",
		"stylers": [
		{ "color": "#f1f1f1" }
		]
	},{
		"elementType": "labels.text.fill",
		"stylers": [
		{ "color": "#000000" }
		]
	},{
		"featureType": "poi",
		"stylers": [
		{ "color": "#d9d9d9" }
		]
	},{
		"elementType": "labels.text",
		"stylers": [
		{ "saturation": 1 },
		{ "weight": 0.1 },
		{ "color": "#000000" }
		]
	}

	];

	map.addStyle({
		styledMapName:"Styled Map",
		styles: styles,
		mapTypeId: "map_style"
	});

	map.setStyle("map_style");
}());

// Google Analytics tracker
(function () {
	var trackOutboundLink = function(eventLabel, url) {
	   ga('send', 'event', 'outbound', 'click', eventLabel, {
	     'transport': 'beacon',
	     'hitCallback': function(){document.location = url;}
	   });
	}

	$('a[href^="https://itunes.apple.com/"]').on('click', function () {
		trackOutboundLink('Emission iOS App', 'https://itunes.apple.com/us/app/emission/id1084198445');
		return false;
	});

	$('a[href^="https://play.google.com/"]').on('click', function () {
		trackOutboundLink('Emission Android App', 'https://play.google.com/store/apps/details?id=edu.berkeley.eecs.emission');
		return false;
	});

	$('.about_app a[href]').on('click', function () {
		trackOutboundLink('More Information', 'https://e-mission.eecs.berkeley.edu/');
		return false;
	});
}())
