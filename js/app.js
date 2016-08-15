var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.730610, lng: -73.935242},
       	zoom: 4
       });
};

var getEvents = function(location) {
	
	var myData = {
		zipCode: location,
		radius: 50,
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
		console.log(result);
	});

}

var geoLocate = function(map){

	var myData = {
		key: "AIzaSyBV-gqXIAS-NqRH-VBSnNq7euAWE0vITOA"
	}

	.ajax({
		url: "maps.googleapis.com/maps/api/geocode/json",
		data: myData;
	})
}

$(function(){
	initMap();
	$(".search").submit(function(event){
		event.preventDefault();
		var location = $(this).find("input[name='location']").val();
		getEvents(location);
	});
});