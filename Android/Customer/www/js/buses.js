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

		$("#page-buses .head-title").text(busFrom+" to "+busTo);

		var selectedDate = new Date().toString();
		var dates = selectedDate.split(" ");
		selectedDate = dates[0]+" "+dates[1]+" "+dates[2]+" "+dates[3];
		$("#selectedDate").text(selectedDate);
		$.mobile.changePage("#page-buses", { transition: "slide", changeHash: false});
	});
});


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


$(document).on("pageinit", "#page-buses", function(event){
	loadBuses();
});

function preDate(){
	var activeDate = $("#selectedDate").text();
	activeDate = new Date(activeDate).getTime();
	var now = new Date().getTime();
	if(activeDate <= now){
		return;
	}
	activeDate = new Date(activeDate);
	activeDate.setDate(activeDate.getDate() - 1);
	activeDate = activeDate.toString();
	var dates = activeDate.split(" ");
	activeDate = dates[0]+" "+dates[1]+" "+dates[2]+" "+dates[3];
	$("#selectedDate").text(activeDate);
	loadBuses();
}

function nextDate(){
	var activeDate = $("#selectedDate").text();
	activeDate = new Date(activeDate);
	activeDate.setDate(activeDate.getDate() + 1);
	activeDate = activeDate.toString();
	var dates = activeDate.split(" ");
	activeDate = dates[0]+" "+dates[1]+" "+dates[2]+" "+dates[3];
	$("#selectedDate").text(activeDate);
	loadBuses();
}

function loadBuses(){
	var route = $("#page-buses .head-title").text();
	var routes = route.split(" ");
	var busFrom = routes[0];
	var busTo = routes[2];
	var booking_date = $("#selectedDate").text();
	$.ajax({
		url: server_url+"bus/select_bus.php",
		type: "POST",
		data: {board_point: busFrom, drop_point: busTo, booking_date: booking_date},
		success: function(msg){
			var a = JSON.parse(msg);
			$("#bus_list").empty();
			if(a.length > 0){
				for(var i=0; i<a.length; i++){
					var data = '<li onclick="showBusDetails(&quot;'+a[i].busId+'&quot;, &quot;'+a[i].busName+'&quot;, &quot;'+a[i].busType+'&quot;, &quot;'+booking_date+'&nbsp;'+a[i].board_time+'&quot;)">';
					data += '<p class="ui-li-aside bus-arr-time">';
					data += '<strong>'+a[i].board_time+'</strong>';
					data += '</p>';
					data += '<p class="ui-li-aside bus-dep-time">';
					data += a[i].drop_time;
					data += '</p>';
					data += '<h2>'+a[i].busName+'</h2>';
					data += '<p>'+a[i].busType+'</p>';
					data += '<p>';
					data += a[i].leftSeat+' seats';
					data += '&nbsp;&bull;&nbsp;'+a[i].timeDuration+' Hrs';
					if(a[i].timeDuration != "0"){
						data += '&nbsp;&bull;&nbsp;'+a[i].timeDuration+' Rest stop';
					}
					data += '</p>';
					data += '<p class="ui-li-aside bus-price">';
					data += 'From &#x24; '+a[i].fare+'';
					data += '</p>';
					data += '<p>';
					if(a[i].average != "0"){
						data += '<span class="rating-btn">'+a[i].average+'</span>';
					}
					data += '&nbsp;';
					if(a[i].noofRatings != "0"){
						data += '<span><strong>'+a[i].noofRatings+' Ratings</strong></span>';
					}
					data += '</p>';
					data += '</li>';
					$("#bus_list").append(data);
					$("#bus_list").listview("refresh");
				}
			}else{
				var data = '<li class="text-center"> No Bus Found </li>';
				$("#bus_list").append(data);
				$("#bus_list").listview("refresh");
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

function showBusDetails(busId, name, type, time) {
	$(".selectedTime").text(time);
	$(".selectedBusName").text(name);
	$(".selectedBusType").text(type);
	$(".selectedBusType").attr("data-busId", busId);
	$.mobile.changePage("#page-bus-details", { transition: "slide", changeHash: false});
}

$(document).on('pageinit', "#page-bus-details", function(event){
	//return;
	var busId = $(".selectedBusType").attr("data-busId");
	$.ajax({
		url: server_url+"bus/bus-details.php",
		type: "POST",
		data: {busId: busId},
		success: function(msg){
			//console.log("Message is "+msg);
			var a = JSON.parse(msg);
			var fare = a[0].fare;
			var layout = JSON.parse(a[0].layout);
			var zero = layout["0"];
			var one = layout["1"];
			var two = layout["2"];
			var three = layout["3"];
			var four = layout["4"];
			if(zero.length > 0){
				$(".seat-one").empty();
				for(var i=0; i<zero.length; i++){
					var data = '<div class="bus-seat" onclick="selectSeat(this, '+fare+')">';
					if(zero[i].type == "sleeeper"){
						data += '<img src="img/sleeper-seat-icon.png" alt="'+zero[i].seat_no+'" />';
					}else{
						data += '<img src="img/seat-icon.png" alt="'+zero[i].seat_no+'" />';
					}
					data += '</div>';
					$(".seat-one").append(data);	
				}
			}
			if(one.length > 0){
				$(".seat-two").empty();
				for(var i=0; i<one.length; i++){
					var data = '<div class="bus-seat" onclick="selectSeat(this, '+fare+')">';
					if(one[i].type == "sleeeper"){
						data += '<img src="img/sleeper-seat-icon.png" alt="'+one[i].seat_no+'" />';
					}else{
						data += '<img src="img/seat-icon.png" alt="'+one[i].seat_no+'" />';
					}
					data += '</div>';
					$(".seat-two").append(data);	
				}
			}
			if(two.length > 0){
				$(".seat-three").empty();
				for(var i=0; i<two.length; i++){
					var data = '<div class="bus-seat" onclick="selectSeat(this, '+fare+')">';
					if(two[i].type == "sleeeper"){
						data += '<img src="img/sleeper-seat-icon.png" alt="'+two[i].seat_no+'" />';
					}else{
						data += '<img src="img/seat-icon.png" alt="'+two[i].seat_no+'" />';
					}
					data += '</div>';
					$(".seat-three").append(data);	
				}
			}
			if(three.length > 0){
				$(".seat-four").empty();
				for(var i=0; i<three.length; i++){
					var data = '<div class="bus-seat" onclick="selectSeat(this, '+fare+')">';
					if(three[i].type == "sleeeper"){
						data += '<img src="img/sleeper-seat-icon.png" alt="'+three[i].seat_no+'" />';
					}else{
						data += '<img src="img/seat-icon.png" alt="'+three[i].seat_no+'" />';
					}
					data += '</div>';
					$(".seat-four").append(data);	
				}
			}
			if(four.length > 0){
				$(".seat-five").empty();
				for(var i=0; i<four.length; i++){
					var data = '<div class="bus-seat" onclick="selectSeat(this, '+fare+')">';
					if(four[i].type == "sleeeper"){
						data += '<img src="img/sleeper-seat-icon.png" alt="'+four[i].seat_no+'" />';
					}else{
						data += '<img src="img/seat-icon.png" alt="'+four[i].seat_no+'" />';
					}
					data += '</div>';
					$(".seat-five").append(data);	
				}
			}
			
		},
		error: function(err){
			if(err.status == "0"){
				console.log("Unable to connect to server, Try again");
			}else{
				console.log("Something went wrong, Try again");
			}
		}
	});
});

var selectedSeats = [];
function selectSeat(elem, fare){
	if($(elem).hasClass('selected-seat')){
		$(elem).removeClass("selected-seat");
		var index = selectedSeats.indexOf($(elem).find('img').attr('alt'));
		if (index > -1) {
			selectedSeats.splice(index, 1);
		}
		$(".selected-seats .seat-numbers").text(selectedSeats.toString());
		var price = selectedSeats.length * fare;
		$(".selected-seats .seat-price").html("&#x24;"+price);
	}else{
		$(elem).addClass("selected-seat");
		selectedSeats.push($(elem).find('img').attr('alt'));
		$(".selected-seats .seat-numbers").text(selectedSeats.toString());
		var price = selectedSeats.length * fare;
		$(".selected-seats .seat-price").html("&#x24;"+price);
	}
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