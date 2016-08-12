var getEvents = function(location) {
	
	var myData = {
		zipCode: location,
		radius: 50,
		page: 0,
		api_key: "vrchjvtc2yyx7wzs56hsuprd",
		o: "json"
	};

	$.ajax({
		url: "http://api.jambase.com/events?",
		data: myData,
		type: "GET"
	});

	console.log(myData);
}

$(function(){
	$(".search").submit(function(event){
		event.preventDefault();
		var location = $(this).find("input[name='location']").val();
		getEvents(location);
	});
});