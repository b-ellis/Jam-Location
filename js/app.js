var map;
var marker;
var infoWindow;


var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.730610, lng: -73.935242},
       	zoom: 8
    });
    var input = document.getElementById('search');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
};

function getInfoCallback(map, content) {
    var infowindow = new google.maps.InfoWindow({
    	content: content
    });
    return function() {
        infowindow.setContent(content); 
        infowindow.open(map, this);
    };
}

function setMarker(latlong, artist, venue, venueUrl, address){
	marker = new google.maps.Marker({
		position: new google.maps.Marker(latlong),
		animation: google.maps.Animation.DROP,
		map: map
	});
	var contentString = '<div>'+ artist + '<br /><a href='+venueUrl +'>'+ venue +'</a><br />' + address + '<br />Concert Info Provided By <a href="http://www.JamBase.com" target="_top" title="JamBase Concert Search">JamBase<span style="font-size: 12px; white-space: normal;" _mce_style="font-size: 12px; white-space: normal;"> </span></a></div>';
	google.maps.event.addListener(marker, 'click', getInfoCallback(map, contentString));
};

var getEvents = function(location) {

	var myData = {
		zipCode: location,
		radius: 30,
		page: 0,
		api_key: "vrchjvtc2yyx7wzs56hsuprd",
		o: "json"
	};

	$.ajax({
		url: "https://www.google.com/search?q=http://api.jambase.com/events",
		data: myData,
		type: "GET",
		'Access-Control-Allow-Origin': 'http://api.jambase.com/events',
		'Access-Control-Allow-Methods': "GET",
		'Access-Control-Allow-Headers': "Content-Type"
	})

	.done(function(result){
		$.each(result.Events, function(index, event){
			var artist = event.Artists[0].Name;
			var venue = event.Venue.Name;
			var venueUrl = event.Venue.Url;
			var address = event.Venue.Address + ", " + event.Venue.City + ", " + event.Venue.State + ", " + event.Venue.CountryCode + ", " + event.Venue.ZipCode;
			var latlong = {lat: event.Venue.Latitude, lng: event.Venue.Longitude};
			setMarker(latlong, artist, venue, venueUrl, address);
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

$(function(){
	$("#search").submit(function(event){
		event.preventDefault();
		var location = $(this).find("input[name='location']").val();
		getEvents(location);
		relocate(location)
	});
});