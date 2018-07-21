$("#back").on("click", function(){
	window.open("index.html#main", "_self");
});
$("#divNearme").on("click", function(){
	/// This will fetch location of user and show list of hotels
	alert("Fetching Location");
});

$("#slctRooms").on("click", function(){
	$.mobile.changePage("#pickRoom");
});

$("#pickRoom").on("pageshow", function(){
	$("#pickedRooms").text($("#noofrooms").val()+", "+$("#noofguests").val());
});