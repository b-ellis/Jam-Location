var map;
var marker;
var infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.730610, lng: -73.935242},
       	zoom: 8
    });
    var input = document.getElementById('search');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    getLocation();
};

function getLocation(){
	var infoWindow = new google.maps.InfoWindow({map: map});
    if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
      	var pos = {
        	lat: position.coords.latitude,
        	lng: position.coords.longitude
      	};

      	console.log(pos);

    	infoWindow.setPosition(pos);
    	infoWindow.setContent('Location found.');
    	map.setCenter(pos);
    	}, function() {
      		handleLocationError(true, infoWindow, map.getCenter());
    	});
  	} else {
    	// Browser doesn't support Geolocation
    	handleLocationError(false, infoWindow, map.getCenter());
  	}	
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function setMarker(latlong){
	marker = new google.maps.Marker({
		position: new google.maps.Marker(latlong),
		animation: google.maps.Animation.DROP,
		map: map
	});
	displayInfo();
};

var displayInfo = function(){
	infoWindow = new google.maps.InfoWindow({
		content: "event info"
	});
	marker.addListener(marker, 'click', function(marker, infoWindow) {
    	infoWindow.open(marker, map);
    	windows.push(infoWindow);
  	});
}

var getEvents = function(location) {

	var myData = {
		zipCode: location,
		radius: 30,
		page: 0,
		api_key: "vrchjvtc2yyx7wzs56hsuprd",
		o: "json"
	};

	$.ajax({
		url: "http://api.jambase.com/events",
		data: myData,
		type: "GET"
	})

	.done(function(result){
		$.each(result.Events, function(index, event){
			var artist = event.Artists.Name;
			var venue = event.Venue.Name;
			var venueUrl = event.Venue.Url;
			var address = event.Venue.Address + ", " + event.Venue.City + ", " + event.Venue.State + ", " + event.Venue.CountryCode + ", " + event.Venue.ZipCode;
			var latlong = {lat: event.Venue.Latitude, lng: event.Venue.Longitude};
			setMarker(latlong);
		});
	});
}

$(function(){
	$("#search").submit(function(event){
		event.preventDefault();
		var location = $(this).find("input[name='location']").val();
		getEvents(location);
	});
});