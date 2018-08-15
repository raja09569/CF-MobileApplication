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

$("#back").click(function(){
	window.open('index.html#main','_self');
});

var options = {
    date: new Date(),
    mode: 'date',
	allowOldDates: false,
	androidTheme:'THEME_DEVICE_DEFAULT_LIGHT',
	minDate:new Date().getTime(),
	titleText:"Select Date" 
};
 
function onSuccess(date) {
	console.log(date);
	var dt = date.toString();
	dt = dt.split(" ");
	var dates = dt[0]+" "+dt[1]+" "+dt[2];
	$("#departureDate").val("   "+dates);
}
 
function onError(error) { // Android only 
    alert('Error: ' + error);
}
 
$("#departureDate").click(function(){
	datePicker.show(options, onSuccess, onError);
});

$("#on_lfrm").click(function(){
    $.mobile.changePage( "#leaving_frm", { transition: "slideup", changeHash: false });
});

$("#on_gto").click(function(){
	$.mobile.changePage( "#going_to", { transition: "slideup", changeHash: false });
});

$("#bus-search-form").on("pageshow", function(){
	$.mobile.loading("hide");
	/* $("#autocompletePlace")
	.geocomplete()
	.bind("geocode:result", function(event, result){
		$("#on_lfrm").val(result.address_components[0].short_name);
		$.mobile.changePage( "#bus-search-form", { transition: "slideup", changeHash: false });
	});
	$("#autocompletePlace2")
	.geocomplete()
	.bind("geocode:result", function(event, result){
		$("#on_gto").val(result.address_components[0].short_name);
		$.mobile.changePage( "#bus-search-form", { transition: "slideup", changeHash: false });
	}); */
});


$('#seats input[name=radio-choice-h-2]').on('change', function() {
   //alert($('#seats input[name=radio-choice-h-2]:checked').val()); 
   //alert("hello");
});
$("#btn_fndBus").on("click", function(){
	var lfrom = $("#on_lfrm").val();
	var gto = $("#on_gto").val();
	var ddate = $("#departureDate").val();
	var noofseats = $("#seats input[name=radio-choice-h-2]").val();
	if(lfrom == ""){
		alert("From where you want to Leave?");
		$("#on_lfrm").focus();
	}else if(gto == ""){
		alert("where you want to GO?");
		$("#on_gto").focus();
	}else if(ddate == ""){
		alert("when you want to Leave?");
		$("#departureDate").focus();
	}else if($('#seats input[name=radio-choice-h-2]').is(':checked') == false){
		alert("How many seats Requeired?");
		$('#seats input[id=radio-choice-h-2a]').focus();
	}else{
		//alert("OK");
		$.mobile.changePage("#busListPage");
	}
});

/// Bus list page 

$("#busListPage").on("pageshow", function(){
	$("#busListTitle").text($("#on_lfrm").val()+" - "+$("#on_gto").val());
	$("#noseats").text($("#seats input[name=radio-choice-h-2]").val()+" Seat(s)");
	
	$("#slctd_date").text($("#departureDate").val());
	
});
$("#slctd_date").on("click", function(){
	var options = {
		date: new Date(),
		mode: 'date',
		allowOldDates: false,
		androidTheme:'THEME_DEVICE_DEFAULT_LIGHT',
		minDate:new Date().getTime(),
		titleText:"Select Date" 
	};
	 
	function onSuccess(date) {
		alert(date);
		var dt = date.toString();
		dt = dt.split(" ");
		var dates = dt[0]+" "+dt[1]+" "+dt[2];
		$("#slctd_date").val(dates);
	}
	 
	function onError(error) { // Android only 
		alert('Error: ' + error);
	}
	datePicker.show(options, onSuccess, onError);
});
$("#busesList li a").on("click", function(){
	$.mobile.changePage("#pickSeatsPage");
});

/// End of bus list page

//// pick seats page

$("#pickSeatsPage").on("pageshow", function(){
	$("#pickSeat").text($("#seats input[name=radio-choice-h-2]").val()+" Seat(s)");
	
});
$("#pick_proceed").on("click", function(){
	$.mobile.changePage("#boardingPage");
});

/// End of pick seats page 

/// Boarding page 

$("#boardingPage").on("pageshow", function(){
	/// list of boarding points will come
	
});
$("#boardingList li a").on("click", function(){
	var loggedin = window.localStorage.getItem('loggedIn');
	if (loggedin == "yes") {
		/// will see what to do
		
	} else {
		$.mobile.changePage('index.html#login');
	}
});

/// End of Boarding page

///