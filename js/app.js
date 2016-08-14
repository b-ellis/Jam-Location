var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.730610, lng: -73.935242},
       	zoom: 5
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
		dataType: "json",
		type: "GET"
	})

	.done(function(result){
		console.log(result);
		var latitude = result.events.object.Venue.Latitude
		var longitude = result.events.Object.Venue.Longitude
		$.each(latitude, longitude, function(i, items){
			console.log(this);
		});
	});

}

var map = function(map){

	var myData = {
		key: "maps.googleapis.com/maps/api/geocode/json"
	}
}

$(function(){
	initMap();
	$(".search").submit(function(event){
		event.preventDefault();
		var location = $(this).find("input[name='location']").val();
		getEvents(location);
	});
});