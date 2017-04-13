var map;
var marker;
var markers = [];
var infoWindow;


var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.730610, lng: -73.935242},
       	zoom: 8,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER
		}
    });
    var input = document.getElementById('search');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input); 
};

function geoloacte(){
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
	    	};
	    	// infoWindow.setPosition(pos);
	    	map.setCenter(pos);
	    	var geocoder = new google.maps.Geocoder;
	    	geocoder.geocode({'location': pos}, function(results, status) {
	    		var zip = results[0].address_components[6].short_name;
	    		getEvents(zip);
	    	});
	    },function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
}

function getInfoCallback(map, content) {
    var infowindow = new google.maps.InfoWindow({
    	content: content
    });
    return function() {
        infowindow.setContent(content); 
        infowindow.open(map, this);
    };
}

function setMarker(latlong, artist, venue, venueUrl, address, date){
	marker = new google.maps.Marker({
		position: new google.maps.Marker(latlong),
		animation: google.maps.Animation.DROP,
		map: map,
	});
	var contentString = '<div>'+ artist + '<br />' + date + '<br /><a href='+venueUrl +'>'+ venue +'</a><br />' + address + '<br />Concert Info Provided By <a href="http://www.JamBase.com" target="_top" title="JamBase Concert Search">JamBase<span style="font-size: 12px; white-space: normal;" _mce_style="font-size: 12px; white-space: normal;"> </span></a></div>';
	google.maps.event.addListener(marker, 'click', getInfoCallback(map, contentString));
	markers.push(marker);
};

function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

function clearMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
	clearMarkers();
	markers = [];
}

var getEvents = function(location) {

	var myData = {
		zipCode: location,
		radius: 30,
		page: 0,
		api_key: "vrchjvtc2yyx7wzs56hsuprd",
		o: "jsonp"
	};

	$.ajax({
		url: "http://api.jambase.com/events",
		data: myData,
		type: "GET"
	})

	.done(function(result){
		$.each(result.Events, function(index, event){
			var date = event.Date.split('T')[0];
			var artist = event.Artists[0].Name;
			var venue = event.Venue.Name;
			var venueUrl = event.Venue.Url;
			var address = event.Venue.Address + ", " + event.Venue.City + ", " + event.Venue.State + ", " + event.Venue.CountryCode + ", " + event.Venue.ZipCode;
			var latlong = {lat: event.Venue.Latitude, lng: event.Venue.Longitude};
			setMarker(latlong, artist, venue, venueUrl, address, date);
		});
	});
}

function relocate(location){
	var lat = '';
    var lng = '';
    var address = location;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			lat = results[0].geometry.location.lat();
			lng = results[0].geometry.location.lng();
			var latlng = new google.maps.LatLng(lat, lng);
			map.setZoom(9);		
			map.panTo(latlng);
	    } else {
			alert("Geocode was not successful for the following reason: " + status);
		}
    });
}

function isNumber(event) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

$(function(){
	$("#search").submit(function(event){
		event.preventDefault();
		deleteMarkers();
		var location = $(this).find("input[name='location']").val();
		getEvents(location);
		relocate(location);
	});
	$('.find').on('click', function(event){
		event.preventDefault();
		geoloacte();
	});
	$('.concert-search').on('click', function(event){
		event.preventDefault();
		$('#search').show();
	})
});