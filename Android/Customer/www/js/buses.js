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
		/*$("input[type='text']").css('border', 'none');
		var busFrom = $("input[type='text'][name='bus-from']").val();
		var busTo = $("input[type='text'][name='bus-to']").val();
		if(busFrom == ""){
			$("input[type='text'][name='bus-from']").css('border', '1px solid red');
			return;
		}
		if(busTo == ""){
			$("input[type='text'][name='bus-to']").css('border', '1px solid red');
			return;
		}*/
		$.mobile.changePage("#page-buses", { transition: "slide", changeHash: false});	
	});
});

function selectCity(elem){
	var elemIs = $(elem).attr('name');
	//console.log("Element is "+elemIs);
	window.sessionStorage.setItem('elemIs', elemIs);
	$.mobile.changePage("#page-cities", { transition: "slideup", changeHash: false});
}

function takeCity(elem){
	var city = $(elem).text().trim();
	var elemIs = window.sessionStorage.getItem('elemIs');
	if(elemIs != null){
		if(elemIs == "bus-from"){
			$("input[type='text'][name='bus-from']").val(city);		
		}else{
			$("input[type='text'][name='bus-to']").val(city);
		}
	}
	$.mobile.changePage("#bus-search-form", { transition: "slidedown", changeHash: false});
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