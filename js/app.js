var map;
var marker;
var markers = [];
var infoWindow;
var artLink = $('.artistTD').children();
var currWindow = false;


var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.730610, lng: -73.935242},
       	zoom: 8,
		zoomControlOptions: {
			position: google.maps.ControlPosition.LEFT_CENTER
		}
    });
    var input = document.getElementById('search');
    var display = document.getElementById('display');
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input); 
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(display);
};

function getInfoCallback(map, content) {
    var infowindow = new google.maps.InfoWindow({
    	content: content
    });
    return function() {
    	 if( currWindow ) {
           currWindow.close();
        }

        currWindow = infowindow;
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
	var contentString = '<div>Artist: '+ artist + '<br />Date: ' + date + '<br />Venue: <a href='+venueUrl +'>'+ venue +'</a><br />Address: ' + address + '<br />Concert Info Provided By <a href="http://www.JamBase.com" target="_top" title="JamBase Concert Search">JamBase<span style="font-size: 12px; white-space: normal;" _mce_style="font-size: 12px; white-space: normal;"> </span></a></div>';
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

var getEvents = function(location, radius) {

	var myData = {
		zipCode: location,
		radius: radius,
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
			displayList(artist, date);
		});
		$('.artistTD').children().on('click', function(){
			var self = $(this).text();
			for(var i=0; i<result.Events.length; i++){
				var artist = result.Events[i].Artists[0].Name;
				var date = result.Events[i].Date.split('T')[0];
				var venue = result.Events[i].Venue.Name;
				var venueUrl = result.Events[i].Venue.Url;
				var address = result.Events[i].Venue.Address + ", " + result.Events[i].Venue.City + ", " + result.Events[i].Venue.State + ", " + result.Events[i].Venue.CountryCode + ", " + result.Events[i].Venue.ZipCode;
				var latlong = {lat: result.Events[i].Venue.Latitude, lng: result.Events[i].Venue.Longitude};
				if(self === artist){
					clearMarkers();
					setMarker(latlong, artist, venue, venueUrl, address, date);
				}
			}
		})
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

function displayList(artist, date) {
	var list = '<tr><td class="artistTD"><a class="artist '+ artist +'" style="cursor:pointer;">' + artist + '</a></td><td>' + date + '</td></tr>';
	$('#tbody').append(list);
}

$(function(){
	$('#map').hide();
	$('#search').hide();
	$('#display').hide();
	$('.info').hide();

	$("#search").submit(function(event){
		event.preventDefault();
		deleteMarkers();
		var location = $(this).find("input[name='location']").val();
		var radius = $(this).find("input[name='rangeInputName']").val();
		getEvents(location, radius);
		relocate(location);
		$('#display').show();
	});

	$('button').on('click', function(){
		$('#search').show();
		$('#map').show();
		initMap();
		$('.landing').hide();
		$('.info').show();
	});

	$('.artistTD').children().on('click', function(){
		console.log(this)
	})
});