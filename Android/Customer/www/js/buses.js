(function () {
	"use strict";
	document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind(this), false );
        document.addEventListener( 'resume', onResume.bind(this), false );
		//$.mobile.loading("show");	
    };

} )();

function onPause(){
	console.log("On Pause called");
}

function onResume(){
	console.log("On Resume called");
}

$(document).on("pageinit", "#bus-search-form", function(event){
	//console.log(" Bus search form page is opened");
	$("#btn_fndBus").on("click", function(){
		$("input[type='text']").css('border', 'none');
		var busFrom = $("input[type='text'][name='bus-from']").val();
		var busTo = $("input[type='text'][name='bus-to']").val();
		if(busFrom == ""){
			$("input[type='text'][name='bus-from']").css('border', '1px solid red');
			return;
		}
		if(busTo == ""){
			$("input[type='text'][name='bus-to']").css('border', '1px solid red');
			return;
		}
		$.mobile.changePage("#page-buses", { transition: "slide", changeHash: false});	
	});
});

$(document).on("pageinit", "#page-boarding", function(event){
	var type = "board_point";
	loadCities(type, "");
	$("input[type='search'][name='search-boarding']").on('input', function(){
		var query = $(this).val();
		loadCities(type, query);
	});
});

$(document).on("pageinit", "#page-dropping", function(event){
	var type = "drop_point";
	loadCities(type, "");
	$("input[type='search'][name='search-dropping']").on('input', function(){
		var query = $(this).val();
		loadCities(type, query);
	});
});

function loadCities(type, term){
	$.ajax({
		url: server_url+"bus/search_city.php",
		type: "POST",
		data: {type: type, term: term},
		success: function(msg){
			//console.log("Message is "+JSON.stringify(msg));
			$(".search-results ul").empty();
			msg = JSON.parse(msg);
			if(msg.length > 0){
				for(var i=0; i<msg.length; i++){
					var data = "<li>";
					data += "<a onclick='takeCity(this, &quot;"+type+"&quot;)'>";
					data += "<img src='img/city.png' alt='city-name' class='ui-li-icon'>";
					data += msg[i].label;
					data += "</a>";
					data += "</li>";
					//console.log(data);
					if(type == "board_point"){
						$("#boardingList").append(data);
						$("#boardingList").listview("refresh");
					}else{
						$("#droppingList").append(data);
						$("#droppingList").listview("refresh");
					}
				}
			}else{
				var data = "<li> No Records found </li>";
				if(type == "board_point"){
					$("#boardingList").append(data);
					$("#boardingList").listview("refresh");
				}else{
					$("#droppingList").append(data);
					$("#droppingList").listview("refresh");
				}
			}
		},
		error: function(err){
			if(err.status == "0"){
				alert("Unable to connect server, Try again.");
			}else{
				alert("Something went wrong, Try again.");
			}
		}
	});
}

function selectCity(elem){
	var elemIs = $(elem).attr('name');
	if(elemIs == "bus-from"){
		$.mobile.changePage("#page-boarding", { transition: "slideup", changeHash: false });
	}else{
		$.mobile.changePage("#page-dropping", { transition: "slideup", changeHash: false });
	}
}

function takeCity(elem, type){
	var city = $(elem).text().trim();
	if(type == "board_point"){
		$("input[type='text'][name='bus-from']").val(city);		
	}else{
		$("input[type='text'][name='bus-to']").val(city);
	}
	$.mobile.changePage("#bus-search-form", { transition: "slide", changeHash: false, reverse: true});
}

function showBusDetails(elem) {
	$.mobile.changePage("#page-bus-details", { transition: "slide", changeHash: false});
}
function selectSeats(elem) {
	$.mobile.changePage("#page-boarding-points", { transition: "slide", changeHash: false});
}
function loadboardingPlaces(){
	$("#dropping-places").hide();
	$("#boarding-places").show();
}
function loaddropingPlaces(){
	$("#boarding-places").hide();
	$("#dropping-places").show();
}
function movetoDropping(elem) {
	$("li a[href='#boarding-places']").removeClass('ui-btn-active');
	$("li a[href='#dropping-places']").addClass('ui-btn-active');
	$("#boarding-places").hide();
	$("#dropping-places").show();
}
function continueBooking(elem) {
	$.mobile.changePage("#page-passenger-details", { transition: "slide", changeHash: false});
}
function nexttravelDetails() {
	$.mobile.changePage("#travel-details", { transition: "slide", changeHash: false});
}
function activeType(elem){
	$(".debit-section img").attr("src", "img/radio_uncheck.png");
	$(elem).find('img').attr("src", "img/radio_check.png");
	$(".debit-section .debit-card").hide();
	$(elem).parent().find('div.debit-card').show();
}
function backtoPassengerDtls() {
	$.mobile.changePage("#page-passenger-details", { transition: "slide", changeHash: false, reverse: true});
}
function backtoboardingPoints() {
	$.mobile.changePage("#page-boarding-points", { transition: "slide", changeHash: false, reverse: true});
}
function backtobusDtls() {
	$.mobile.changePage("#page-bus-details", { transition: "slide", changeHash: false, reverse: true});
}
function backtoBuses() {
	$.mobile.changePage("#page-buses", { transition: "slide", changeHash: false, reverse: true});
}