// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
var drid, dist, fe;
var interval;
var mainMap;
var markers = [];
var is_loading = false;
var RIDE_LATER = false;
var wid, hght;
(function () {
    "use strict";
	
	wid = $(window).width()/100;
	hght = $(window).height()/100;
	
	$(".title").css("font-size", wid*4.3+"px");  //14px
	if(Math.round(window.devicePixelRatio) == 0.75) {
		$(".back-icon").attr('src', '../www/img/ldpi/back.png'); 
		$(".app-icon").attr('src', '../www/img/ldpi/logo.png');   
	}else if(Math.round(window.devicePixelRatio) == 1) {
		$(".back-icon").attr('src', '../www/img/mdpi/back.png');
		$(".app-icon").attr('src', '../www/img/mdpi/logo.png');   
	}else if(Math.round(window.devicePixelRatio) == 1.5) {
		$(".back-icon").attr('src', '../www/img/hdpi/back.png');
		$(".app-icon").attr('src', '../www/img/hdpi/logo.png');   
	}else if(Math.round(window.devicePixelRatio) == 2) {
		$(".back-icon").attr('src', '../www/img/xhdpi/back.png');
		$(".app-icon").attr('src', '../www/img/xhdpi/logo.png');  
	}else{
		$(".back-icon").attr('src', '../www/img/xxhdpi/back.png');
		$(".app-icon").attr('src', '../www/img/xxhdpi/logo.png');
	}
	
} )();

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
function onDeviceReady() {
	if(window.sessionStorage.getItem("From_My_bookings") != null){
		if(window.sessionStorage.getItem("From_My_bookings") == "RIDE_COMPLETION"){
			window.sessionStorage.removeItem("From_My_bookings");
			$.mobile.changePage("#ride_completion", { transition: "fade"});
		}else if(window.sessionStorage.getItem("From_My_bookings") == "BOOK_DETAILS"){
			window.sessionStorage.removeItem("From_My_bookings");
			$.mobile.changePage("#bookeddtlsPage", { transition: "fade"});
		}else{
			window.plugins.spinnerDialog.show("Getting your location","", true);
			
			// Handle the Cordova pause and resume events		
			function onRequestSuccess(success){
				var networkState = navigator.connection.type;
				if (networkState !== Connection.NONE) {
					window.plugins.spinnerDialog.hide();
					$.mobile.changePage("#bookridePage", { transition: "fade"});
					//$("#bookridePage").trigger("create");
				}else{
					window.plugins.spinnerDialog.hide();
					navigator.notification.confirm(
						'CamerounFacile.com Requires Internet, Would you like to Turn ON?', // message
						 onConfirm,            // callback to invoke with index of button pressed
						'Internet Connection',           // title
						['YES','NO']     // buttonLabels
					);	
				}
			}

			function onRequestFailure(error){
				if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
					if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
						window.plugins.spinnerDialog.hide();
						cordova.plugins.diagnostic.switchToLocationSettings();
					}else{
						window.plugins.spinnerDialog.hide();
						window.location = "index.html";
					}
				}else{
					window.plugins.spinnerDialog.hide();
					window.location = "index.html";
				}
			}

			cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure,
			cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
			//$.mobile.changePage("#bookridePage", { transition: "fade"});
		}
	}else if(window.sessionStorage.getItem("From_Booking_Notificatioin") != null){
		var fromBooking = window.sessionStorage.getItem("From_Booking_Notificatioin");
		if(fromBooking == "Booked"){
			window.sessionStorage.removeItem("From_Booking_Notificatioin");
			$.mobile.changePage("#bookeddtlsPage", { transition: "fade"});
		}else if (fromBooking == "Arrive"){
			window.sessionStorage.removeItem("From_Booking_Notificatioin");
			$.mobile.changePage("#bookeddtlsPage", { transition: "fade"});
		}else if (fromBooking == "Cancelled"){
			window.sessionStorage.removeItem("From_Booking_Notificatioin");
			$.mobile.changePage("#ride_completion", { transition: "fade"});
		}else if (fromBooking == "Started"){
			window.sessionStorage.removeItem("From_Booking_Notificatioin");
			$.mobile.changePage("#bookeddtlsPage", { transition: "fade"});
		}else if (fromBooking == "Finished"){
			window.sessionStorage.removeItem("From_Booking_Notificatioin");
			$.mobile.changePage("#ride_completion", { transition: "fade"});
		}else{
			window.plugins.spinnerDialog.show("Getting your location","", true);
			
			// Handle the Cordova pause and resume events		
			function onRequestSuccess(success){
				var networkState = navigator.connection.type;
				if (networkState !== Connection.NONE) {
					window.plugins.spinnerDialog.hide();
					$.mobile.changePage("#bookridePage", { transition: "fade"});
					//$("#bookridePage").trigger("create");
				}else{
					window.plugins.spinnerDialog.hide();
					navigator.notification.confirm(
						'CamerounFacile.com Requires Internet, Would you like to Turn ON?', // message
						 onConfirm,            // callback to invoke with index of button pressed
						'Internet Connection',           // title
						['YES','NO']     // buttonLabels
					);	
				}
			}

			function onRequestFailure(error){
				if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
					if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
						window.plugins.spinnerDialog.hide();
						cordova.plugins.diagnostic.switchToLocationSettings();
					}else{
						window.plugins.spinnerDialog.hide();
						window.location = "index.html";
					}
				}else{
					window.plugins.spinnerDialog.hide();
					window.location = "index.html";
				}
			}

			cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure,
			cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
			//$.mobile.changePage("#bookridePage", { transition: "fade"});
		}
	}else{
		//alert("hello");
		window.plugins.spinnerDialog.show("Getting your location","", true);
		
		// Handle the Cordova pause and resume events		
		function onRequestSuccess(success){
			var networkState = navigator.connection.type;
			if (networkState !== Connection.NONE) {
				window.plugins.spinnerDialog.hide();
				$.mobile.changePage("#bookridePage", { transition: "fade"});
				//$("#bookridePage").trigger("create");
			}else{
				window.plugins.spinnerDialog.hide();
				navigator.notification.confirm(
					'CamerounFacile.com Requires Internet, Would you like to Turn ON?', // message
					 onConfirm,            // callback to invoke with index of button pressed
					'Internet Connection',           // title
					['YES','NO']     // buttonLabels
				);	
			}
		}

		function onRequestFailure(error){
			if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
				if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
					window.plugins.spinnerDialog.hide();
					cordova.plugins.diagnostic.switchToLocationSettings();
				}else{
					window.plugins.spinnerDialog.hide();
					window.location = "index.html";
				}
			}else{
				window.plugins.spinnerDialog.hide();
				window.location = "index.html";
			}
		}

		cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure,
		cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
		//$.mobile.changePage("#bookridePage", { transition: "fade"});
	}
	document.addEventListener( 'pause', onPause.bind( this ), false );
	document.addEventListener( 'resume', onResume, false );
	
	function onResume() {
		// Handle the resume event
		if($.mobile.activePage.attr('id') == "bookridePage"){
			if(is_loading == true){				
				//alert("hello");
				var networkState = navigator.connection.type;
				if (networkState !== Connection.NONE) {
					is_loading = false;
					//$.mobile.changePage("#bookridePage", { transition: "fade", changeHash: false });
					LoadMap();
				}else{
					//is_loading = true;
					//cordova.plugins.diagnostic.switchToMobileDataSettings();
					window.location = "index.html";
				}
			}
		}
	}
};

function onConfirm(buttonIndex) {
	if(buttonIndex == 1){
		is_loading = true;
		cordova.plugins.diagnostic.switchToMobileDataSettings();
	}else{
		is_loading = true;
		window.location = "index.html";
	}
}

$(document).on('pageshow', '#bookridePage', function () {
	$("#map").css("height", $(window).height()/100+"px");
	$("#autocompletePlace")
	.geocomplete()
	.bind("geocode:result", function(event, result){
		$("#pickLatLng").val(result.geometry.location.lat()+","+result.geometry.location.lng());
		$("#pickLocation").text(result.formatted_address);
		$.mobile.changePage("#bookridePage", { transition: "slideup", changeHash: false });
	});
	
	$("#autocompletePlace2")
	.geocomplete()
	.bind("geocode:result", function(event, result){
		var from_ttlFare = window.sessionStorage.getItem("from_ttlFare");
		if(from_ttlFare == "yes"){
			$("#dropLatLng").val(result.geometry.location.lat()+","+result.geometry.location.lng());
			$("#slctddrplatlng").val(result.geometry.location.lat()+","+result.geometry.location.lng());
			$("#dropLocation").text(result.formatted_address);
			$("#slctddrpLocation p").text(result.formatted_address);
			$.mobile.changePage("#bookDetailspage", { transition: "slideup", changeHash: false });
		}else{
			$("#dropLatLng").val(result.geometry.location.lat()+","+result.geometry.location.lng());
			$("#dropLocation").text(result.formatted_address);
			$.mobile.changePage("#bookridePage", { transition: "slideup", changeHash: false });
		}
		/*$("#dropLatLng").val(result.geometry.location.lat()+","+result.geometry.location.lng());
		$("#dropLocation").text(result.formatted_address);
		$.mobile.changePage("#bookridePage", { transition: "slideup", changeHash: false });*/
	});
	
	LoadMap();
	
});

function LoadMap() {
	window.plugins.spinnerDialog.show("Getting your location","", true);
	$("#pickLocation").text("Fetching Location...");
	if($("#pickLatLng").val() != ""){
		var latlang = $("#pickLatLng").val();
		latlang = latlang.split(','); 
		window.plugins.spinnerDialog.hide();
		drawMap(parseFloat(latlang[0]) , parseFloat(latlang[1]));
	}else{
		if(navigator.geolocation){
			var watchID = navigator.geolocation.watchPosition(onSuccess, onError, 
			{ timeout: 1000, enableHighAccuracy:true });
			function onSuccess(position) {			
				// Add an overlay to the map of current lat/lng
				//alert(position.coords.accuracy);
				//navigator.geolocation.clearWatch(watchID);
				//window.plugins.spinnerDialog.hide();
				/*if(position.coords.accuracy < 50){
					window.plugins.spinnerDialog.hide();
					drawMap(position.coords.latitude, position.coords.longitude);
				}*/
				//alert("hello");
				window.plugins.spinnerDialog.hide();
				navigator.geolocation.clearWatch(watchID);
				drawMap(position.coords.latitude, position.coords.longitude);
			}
			
			function onError(error) {
				/*alert('code: '    + error.code    + '\n' +
					'message: ' + error.message + '\n');*/
				window.plugins.spinnerDialog.hide();
			}
			
			
			/*navigator.geolocation.getCurrentPosition(function(position){
				alert(position.coords.latitude);
				drawMap(position.coords.latitude, position.coords.longitude);
			
			}, function(error){
				/*alert('code: ' + error.code + '\n' +
					'message: ' + error.message + '\n');*//*
			});*/
		
		}else{
			//alert("else");
			window.plugins.spinnerDialog.hide();
			drawMap(34.0983425, -118.3267434);
		}
	}
}

	
$("#div_pickLocation").click(function(){
	$.mobile.changePage( "#pickupLocation", { transition: "slideup", changeHash: false });
});

$("#div_dropLocation").click(function(){
	$.mobile.changePage("#DropoffLocation", { transition: "slideup", changeHash: false });
});

function drawMap(lat, lon) {
	var latlng = new google.maps.LatLng(lat, lon);
	var myOptions = {
		zoom: 16,
		center: latlng,
		maxZoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	mainMap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	// Add an overlay to the map of current lat/lng
	var marker = new google.maps.Marker({
		position: latlng,
		map: mainMap,
		title: "Pick Location",
		animation: google.maps.Animation.DROP,
		icon: "img/greenmarker.png"
	});
	$("#div_cabs").hide();
	getAddress(marker.getPosition());
	mainMap.addListener('center_changed', function() {
		$("#pickLocation").text("Fetching Location...");
		$("#all_divs div").remove();
		$("#cabList").hide();
		window.setTimeout(function() {
			marker.setAnimation(google.maps.Animation.DROP);
			marker.setPosition(mainMap.getCenter());
			getAddress(marker.getPosition());
		}, 2000);
	});
}

function getAddress(latlng){
	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(null);
	}
	var lat = latlng.lat();
	var lng = latlng.lng();
	$("#pickLatLng").val(lat+","+lng);
	showCabs(lat, lng);
	var geocoder = geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'latLng': latlng }, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				//alert("Location: " + results[1].formatted_address);
				$("#pickLocation").text(results[1].formatted_address);
			}
		}
	});
}

function showCabs(lat, lng){
	$("#cab_dtls #cat_name").text("");
	$.ajax({
		url: server_url+'cabs/fetch_vehicles.php',
		cache: false,
		type: "POST",
		beforeSend: function(){
			$("#div_loader").show();
		},
		data: {
			lat: lat,
			lng: lng
		},
		complete: function(){
			$("#div_loader").hide();
		},
		success: function(responce){
			//alert(responce);
		   	var a = JSON.parse(responce);
			//$("#cabList ul").empty();
			$("#all_divs").empty();
			$("#cabList").show();
			if(a.length != 0){
				$("#div_cabs").show();
				for (var i = 0; i < a.length; i++) { 
					//text += cars[i] + "<br>";
					var cabs = a[i].cabs;
					if(cabs == "available"){
						var cab = a[i].cab;
						var cabfee = a[i].cabfee;
						var time = a[i].time;
						if(time == ""){
							showCabs(lat, lng);
						}
						var cabphoto = ad_attachment_url+a[i].cabphoto;
						var driverid = a[i].driverid;
						var cabID = a[i].cabID;
						var isRideLaterAvailable = a[i].isRideLaterAvailable;
						
						var data = '<li class="cab-type">';
						data += '<p>'+time+'</p>';
						data += '<div onclick="showvhcles(&quot;'+isRideLaterAvailable+'&quot;,&quot;'+driverid+'&quot;,&quot;'+time+'&quot;,&quot;'+cabID+'&quot;,&quot;'+lat+'&quot;,&quot;'+lng+'&quot;);">';
						data += '<img src="'+cabphoto+'" />';
						data += '</div>';
						data += '<p>'+cab+'</p>';
						data += '</li>';
					}else{
						var cab = a[i].cab;
						var cabphoto = ad_attachment_url+a[i].cabphoto;
						var data = '<li class="cab-type">';
						data += '<p>No Cabs</p>';
						data += '<div onclick="showvhcles(&quot;&quot;,&quot;&quot;,&quot;&quot;,&quot;&quot;,&quot;&quot;,&quot;&quot;)">';
						data += '<img src="'+cabphoto+'"/>';
						data += '</div>';
						data += '<p>'+cab+'</p>';
						data += '</li>';
					}
					$("#all_divs").append(data);
				}
			}else{
				$("#div_cabs").show();
			}
		},
		error: function(err){
			if(error.status == "0"){
				alert("Unable to connect server, Try again.");
			}else{
				alert("Something went wrong, Try again.");
			}
		}
	});
}
$("#chsfrmmap").on("click", function(){
	$.mobile.changePage("#pagedrpMap", { transition: "slideup", changeHash: false });
});

$("#pagedrpMap").on("pageshow", function(){
	if(navigator.geolocation){		
		navigator.geolocation.getCurrentPosition(function(position){
			MoveMarker(position.coords.latitude, position.coords.longitude);
		}, function(error){
			alert('code: ' + error.code + '\n' +
				'message: ' + error.message + '\n');
		});
	}else{
		//alert("else");
		MoveMarker(34.0983425, -118.3267434);
	}
});

function MoveMarker(lat, lon) {
	var latlng = new google.maps.LatLng(lat, lon);
	var myOptions = {
		zoom: 16,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	var map = new google.maps.Map(document.getElementById("drp_map"), myOptions);
	// Add an overlay to the map of current lat/lng
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		title: "Pick Location",
		animation: google.maps.Animation.DROP,
		icon: "img/redmarker.png"
	});
	showAddress(marker.getPosition());
	map.addListener('center_changed', function() {
		$("#drplocation p").text("Getting address...");
		window.setTimeout(function() {
			marker.setAnimation(google.maps.Animation.DROP);
			marker.setPosition(map.getCenter());
			showAddress(marker.getPosition());
		}, 2000);
	});
}

function showAddress(latlng){
	var lat = latlng.lat();
	var lng = latlng.lng();
	$("#drplatlng").val(lat+","+lng);
	var geocoder = geocoder = new google.maps.Geocoder();
	geocoder.geocode({ 'latLng': latlng }, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[1]) {
				$("#drplocation p").text(results[1].formatted_address);
			}
		}
	});
}

$("#slctLocation").on("click", function(){
	var from_ttlFare = window.sessionStorage.getItem("from_ttlFare");
	if(from_ttlFare == "yes"){
		$("#dropLatLng").val($("#drplatlng").val());
		$("#slctddrplatlng").val($("#drplatlng").val());
		$("#dropLocation").text($("#drplocation p").text());
		$("#slctddrpLocation p").text($("#drplocation p").text());
		$.mobile.changePage("#bookDetailspage", { transition: "slideup", changeHash: false });
	}else{
		if($("#drplocation p").text() != "Gettng address.."){
			$("#dropLatLng").val($("#drplatlng").val());
			$("#dropLocation").text($("#drplocation p").text());
			$.mobile.changePage("#bookridePage", { transition: "slide", changeHash: false });
		}
	}
});

$("#bookDetailspage").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var from_ttlFare = window.sessionStorage.getItem("from_ttlFare");
	if(from_ttlFare != null){
		window.sessionStorage.removeItem("from_ttlFare");	
		var currentdate = new Date(); 
		var datetime;
		var hours = currentdate.getHours() > 12 ? currentdate.getHours() - 12 : currentdate.getHours();
		var am_pm = currentdate.getHours() >= 12 ? "PM" : "AM";
		hours = hours < 10 ? "0" + hours : hours;
		var minutes = currentdate.getMinutes() < 10 ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
		var t = hours + ":" + minutes+ " " + am_pm;
		if((currentdate.getMonth()+1).toString().length == 1){
			datetime = currentdate.getDate() + "/0"
				+ (currentdate.getMonth()+1) + "/" 
				+ currentdate.getFullYear() + " " + t;
		}else{
			datetime = currentdate.getDate() + "/"
				+ (currentdate.getMonth()+1) + "/" 
				+ currentdate.getFullYear() + " " + t;
		}
		
		$("#pckTime span").text(datetime);
		
	}
	var cabID = $("#cab_dtls").attr("data-cabID");
	var p1 = $("#pickLatLng").val();
	p1 = p1.split(','); 
	p1 = new google.maps.LatLng(parseFloat(p1[0]) , parseFloat(p1[1]));
	
	if($("#dropLatLng").val() != ""){
		$("#ridFare span").show();
		$("#dv_gttlFare").hide();
		
		var p2 = $("#dropLatLng").val();
		p2 = p2.split(','); 
		p2 = new google.maps.LatLng(parseFloat(p2[0]) , parseFloat(p2[1]));
		
		$.ajax({
			url: server_url+"cabs/getRideFares.php",
			data:{
					pickLatLng:$("#pickLatLng").val(),
					dropLatLng:$("#dropLatLng").val(),
					isAcCab: isAcCab,
					cab_type:cabID
				},
			type: "POST",
			success: function(msg){
				//alert(msg);
				var a = JSON.parse(msg);
				var outp = a["msg"];
				if(outp == "success"){
					fe = a["charge"];
					$("#ridFare #rd_fare1").text(a["charge"]);
					$("#ridFare #rd_tx1").text(a["tax"]);
					$("#ridFare #rd_ttlFare1").text(a["total"]);
				}else{
					//alert(outp);
				}
			},
			error: function(err){
				//alert(err);
			}
		});
	}else{
		$("#ridFare span").hide();
		$("#dv_gttlFare").show();
	}
	$("#div_slctMap").css("height", $(window).height()-($("#slctdpickLocation").height()+
	$("#slctddrpLocation").height()+$("#ridFare").height()+$("#header").height()
	+$("#pckTime").height()+$("#footer").height()));
	
	var myOptions = {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	};
	
	var map = new google.maps.Map(document.getElementById("slctMap"), myOptions);
	var bounds = new google.maps.LatLngBounds();
	var position1 = $("#slctdpicklatlng").val();
	if(position1 != ""){	
		position1 = position1.split(','); 
		position1 = new google.maps.LatLng(parseFloat(position1[0]) , parseFloat(position1[1]));
		var marker1 = new google.maps.Marker({
			position: position1,
			map: map,
			title: "Pick Location",
			animation: google.maps.Animation.DROP,
			icon: "img/greenmarker.png"
		});
		bounds.extend(position1);
	}	
	
	var position2 = $("#slctddrplatlng").val();
	if(position2 != ""){				
		position2 = position2.split(','); 
		position2 = new google.maps.LatLng(parseFloat(position2[0]) , parseFloat(position2[1]));
		var marker2 = new google.maps.Marker({
			position: position2,
			map: map,
			title: "Drop Location",
			animation: google.maps.Animation.DROP,
			icon: "img/redmarker.png"
		});
		bounds.extend(position2);
	}
	map.fitBounds(bounds);
	window.plugins.spinnerDialog.hide();
})

$("#btn_cnfmbook").on("click", function(){
	function onConfirm(buttonIndex) {
		if(buttonIndex == 1){	
			window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
			var time = $("#pckTime span").text();
			time = time.split(" ");
			$.ajax({
				type: 'POST',
				url: server_url+"cabs/book_cab.php",
				data: {
						cust_id: window.localStorage.getItem('custid'),
						driver_id: drid,
						pick: $("#slctdpickLocation p").text(),
						pickLatLng: $("#slctdpicklatlng").val(),
						pick_date: time[0],
						pick_time: time[1]+" "+time[2],
						drop: $("#slctddrpLocation p").text(),
						dropLatLng: $("#slctddrplatlng").val(),
						isAcCab: isAcCab,
						RIDE_LATER: RIDE_LATER
					},
				success: function(response) {
					window.plugins.spinnerDialog.hide();
					//alert(response);
					var a = JSON.parse(response);
					if(a.msg == "success"){
						$("#bookedID").text(a.bookid);
						//alert(a.bookid);
						$("#pp_requesting_footer img").data("bookingID", a.bookid);
						window.plugins.spinnerDialog.hide();
						$.mobile.changePage("#pp_requesting", { transition: "pop", changeHash: false });
					}else{
						window.plugins.spinnerDialog.hide();
						alert(a.msg);
					}
				},
				error: function(error){
					window.plugins.spinnerDialog.hide();
					//alert(error);
				}
			});
		}else{
			window.plugins.spinnerDialog.hide();
			//alert("cancel");
		}
	}

	navigator.notification.confirm(
		'Are you sure, you want to bookthis ride on '+$("#pckTime span").text(), // message
		 onConfirm,            // callback to invoke with index of button pressed
		'Confirmation',           // title
		['OK','CANCEL']     // buttonLabels
	);
});

/*$("#pckTime span").on("click", function(){
	var options = {
		type: 'date',         // 'date' or 'time', required 
		date: new Date(),     // date or timestamp, default: current date 
		minDate: new Date(),  // date or timestamp 
		//maxDate: new Date()   // date or timestamp 
	};
	 
	window.DateTimePicker.pick(options, function (timestamp) {
		var options = {
			type: 'time',         // 'date' or 'time', required 
			date: new Date(),     // date or timestamp, default: current date 
			minDate: new Date(),  // date or timestamp 
			//maxDate: new Date()   // date or timestamp 
		};
		 
		window.DateTimePicker.pick(options, function (time) {
			
			var d = new Date(timestamp);
			var formattedDate;
			if((d.getMonth()+1).toString().length == 1){
				formattedDate = d.getDate() + "/0" + (d.getMonth() + 1) + "/" + d.getFullYear();
			}else{
				formattedDate = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
			}
			
			var d2 = new Date(time);
			var hours = d2.getHours() > 12 ? d2.getHours() - 12 : d2.getHours();
			var am_pm = d2.getHours() >= 12 ? "PM" : "AM";
			hours = hours < 10 ? "0" + hours : hours;
			var minutes = d2.getMinutes() < 10 ? "0" + d2.getMinutes() : d2.getMinutes();
			var formattedTime = hours + ":" + minutes+ " " + am_pm;
			
			formattedDate = formattedDate + " " + formattedTime;
			
			//alert(formattedDate);
			$("#pckTime span").text(formattedDate);
			
		});
	});
});*/
var dr_locationMarker, dr_locationMap;
$("#bookeddtlsPage").on("pageshow", function(){
	$("#dr_map").css("height", ($(window).height()/100)-($("#bokFooter").height())+"px");
	clearInterval(interval);
	var value = window.sessionStorage.getItem("BookingID");
	//var value = "CFCR0137";
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	if(value != null){
		$("#bookedID").text(value);
		$.ajax({
			url: server_url+"cabs/get_driverDetails.php",
			type: "POST",
			data:{bookingID:$("#bookedID").text()},
			success: function(responce){
				var a = JSON.parse(responce);
				var driverName = a["driverName"];
				var cab_regn_no = a["cab_regn_no"];
				var current_location = a["current_location"];
				var lattitude = a["lattitude"];
				var longitude = a["longitude"];
				var phone_no = a["phone_no"];
				var driver_photo = a["driver_photo"];
				var vehicle_photo = a["vehicle_photo"];
				var status = a["status"];
				var vehicle_name = a["vehicle_name"];
				window.sessionStorage.setItem("Ridestatus",status);
				$("#tm_left").text("....");
				$("#dist_left").text("....");
				$("#vhcl_name").text(vehicle_name);
				$("#reg_no").text(cab_regn_no);
				if(vehicle_photo == ""){
					$("#vhcl_photo").attr("src", "img/cab.png");
				}else{
					$("#vhcl_photo").attr("src", ad_attachment_url+vehicle_photo);
				}
				if(driver_photo == ""){
					$("#dr_photo").attr("src", "img/user.png");
				}else{
					$("#dr_photo").attr("src", ad_attachment_url+driver_photo);
				}
				
				$("#dv_drDtls_name").text(driverName);
				$("#dr_number").val(phone_no);
				
				var latlng = new google.maps.LatLng(parseFloat(lattitude) , parseFloat(longitude));
				var myOptions = {
					zoom: 16,
					center: latlng,
					maxZoom: 16,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
				};
				dr_locationMap = new google.maps.Map(document.getElementById("dr_locationMap"), myOptions);
				// Add an overlay to the map of current lat/lng
				dr_locationMarker = new google.maps.Marker({
					position: latlng,
					map: dr_locationMap,
					title: driverName,
				});
				window.plugins.spinnerDialog.hide();
				startDriverNavigation();
			},
			error: function(err){
				//alert(err);
				window.plugins.spinnerDialog.hide();
			}
		});
	}else{
		window.plugins.spinnerDialog.hide();
		window.sessionStorage.setItem("FROM_RIDE_COMPLETION", "YES");
		window.location = "index.html";
	}

});
function startDriverNavigation(){
	function onSuccess(position) {
		//alert(position.coords.latitude);
		$.ajax({
			url: server_url+"cabs/get_driverDetails.php",
			type: "POST",
			data:{
				custLat:position.coords.latitude,
				custLng:position.coords.longitude,
				bookingID:$("#bookedID").text()
				},
			success: function(responce){
				//alert(responce);
				var a = JSON.parse(responce);
				var current_location = a["current_location"];
				var lattitude = a["lattitude"];
				var longitude = a["longitude"];
				var status = a["status"];
				var distLeft = a["distLeft"];
				var timeLeft = a["timeLeft"];
				
				window.sessionStorage.setItem("Ridestatus",status);
				
				$("#tm_left").text(timeLeft);
				$("#dist_left").text(distLeft);
				
				var latlng = new google.maps.LatLng(parseFloat(lattitude) , parseFloat(longitude));
				dr_locationMarker.setPosition(latlng);
				dr_locationMap.panTo(latlng);
			},
			error: function(err){
				//alert(err);
			}
		});
	}

	function onError(error) {
		//alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
	}

	var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 20000 });

}

$("#ctnct_dtls").on("click", function(){
	window.plugins.CallNumber.callNumber(onSuccess, onError, $("#dr_number").val(), true);
});

function onSuccess(result){
  console.log("Success:"+result);
}
function onError(result) {
  console.log("Error:"+result);
}

$("#cncl_ride").on("click", function(){
	var status = window.sessionStorage.getItem("Ridestatus");
	if(status != null){
		if(status == "Boarded"){
			alert("You cant Cancel Ride!");
		}else{		
			$.post(server_url+'cabs/cancel_ride.php',
			{
				bookingID: $("#bookedID").text()
			}, function (responce, status) {
				//alert(responce);
				 window.sessionStorage.setItem("BookingID", $("#bookedID").text());
				 $.mobile.changePage("#ride_completion", {changeHash:false, transition:"slide"});
			});
		}
	}else{			
		$.post(server_url+'cancel_ride.php',
		{
			bookid: $("#bookedID").text()
		}, function (responce, status) {
			//alert(responce);
			 window.sessionStorage.setItem("BookingID", $("#bookedID").text());
			 $.mobile.changePage("#ride_completion", {changeHash:false, transition:"slide"});
		});
	}
});

$(".rid_back").on("click", function(){
	var value = window.sessionStorage.getItem("BookingID");
	if(value != null){
		window.sessionStorage.removeItem("BookingID");
		window.sessionStorage.setItem("FROM_RIDE_COMPLETION", "YES");
		window.location = "index.html";
	}
});

$("#ride_completion").on("pageshow", function(){
	$("#final_div").css("height", $(window).height()*0.35+"px");
	clearInterval(interval);
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var value = window.sessionStorage.getItem("BookingID");
	//var value = "CFCR0137";
	if(value != null){
		$("#rd_bookedID").text(value);
		$.post(server_url+'cabs/get_driverDetails.php',{
			bookingID: $("#rd_bookedID").text()	
		}, function (responce, status) {
			//alert(responce);
			var a = JSON.parse(responce);
			var driverName = a["driverName"];
			var cab_regn_no = a["cab_regn_no"];
			var phone_no = a["phone_no"];
			var driver_photo = a["driver_photo"];
			var vehicle_name = a["vehicle_name"];
			var startTime = a["startTime"];
			var endTime = a["endTime"];
			var startPlace = a["startPlace"];
			var endPlace = a["endPlace"];
			var totalFare = a["totalFare"];
			var pickTime = a["pickTime"];
			var status = a["status"];
			var startLatLng = a["startLatLng"];
			var endLatLng = a["endLatLng"];
			var drID = a["driverID"];
			var custID = a["custID"];
			var comment = a["comment"];
			
			//alert(pickTime);
			
			if(status == "Cancelled"){
				$("#cancelled_img").show();
				$("#rddrpLocation").hide();
			}else{
				$("#cancelled_img").hide();
				$("#rddrpLocation").show();
			}
			if(endPlace == ""){
				$("#rddrpLocation").hide();
				$("#rdFare").hide();
			}else{
				$("#rddrpLocation").show();
				$("#rdFare").show();
			}
			
			if(comment == ""){
				$("#shwCmnt").hide();
				$("#dv_wrtCmnt").show();
				$("#shwCmnt p").text("");
			}else{
				$("#dv_wrtCmnt").hide();
				$("#shwCmnt p").text(comment);
				$("#shwCmnt").show();
			}
			
			$("#rd_drID").text(drID);
			$("#rd_custID").text(custID);
			$("#rd_date").text(pickTime);
			$("#rd_drName").text(driverName);
			$("#rd_drMobile").text(phone_no);
			$("#rd_drImage").attr("src", ad_attachment_url+driver_photo);
			
			$("#rd_vhclName").text(vehicle_name+" - "+cab_regn_no);
			$("#rdpickLocation span").text(startTime);
			$("#rddrpLocation span").text(endTime);
			$("#rdpickLocation p").text(startPlace);
			$("#rddrpLocation p").text(endPlace);
			$("#rd_ttlFare").text(totalFare);
			
			var myOptions = {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
			};
			
			var map = new google.maps.Map(document.getElementById("final_map"), myOptions);
			
			var bounds = new google.maps.LatLngBounds();
			
			if(startLatLng != ""){
				
				startLatLng = startLatLng.split(','); 
				
				startLatLng = new google.maps.LatLng(parseFloat(startLatLng[0]) , parseFloat(startLatLng[1]));
				
				// Add an overlay to the map of current lat/lng
				var marker1 = new google.maps.Marker({
					position: startLatLng,
					map: map,
					title: "Pick Location",
					animation: google.maps.Animation.DROP,
					icon: "img/greenmarker.png"
				});
				bounds.extend(startLatLng);
			}	
			
			if(endLatLng != ""){				
				endLatLng = endLatLng.split(','); 
				
				endLatLng = new google.maps.LatLng(parseFloat(endLatLng[0]) , parseFloat(endLatLng[1]));
				
				var marker2 = new google.maps.Marker({
					position: endLatLng,
					map: map,
					title: "Drop Location",
					animation: google.maps.Animation.DROP,
					icon: "img/redmarker.png"
				});
				bounds.extend(endLatLng);
			}
			map.fitBounds(bounds);
			
			window.plugins.spinnerDialog.hide();
		});
	}else{
		window.plugins.spinnerDialog.hide();
		window.sessionStorage.setItem("FROM_RIDE_COMPLETION", "YES");
		window.location = "index.html";
	}
});

$("#btn_ttlFare").on("click", function(){
	window.sessionStorage.setItem("from_ttlFare","yes");
	
	var cabName = $("#cab_dtls #cat_name").text();
	var cabID = $("#cab_dtls").attr("data-cabID");
	var time = $("#cab_dtls").attr("data-time");
	
	$("#cab_dtls").hide();
	$("#condition_div").hide();
	$("#cab_dtls #cat_name").text("");
	
	$("#vehicleName").text(cabName+", "+time);
	$("#slctdpickLocation p").text($("#pickLocation").text());
	$("#slctddrpLocation p").text($("#dropLocation").text());
	$("#slctddrplatlng").val($("#dropLatLng").val());
	$("#slctdpicklatlng").val($("#pickLatLng").val());
	
	$.mobile.changePage("#DropoffLocation", { transition: "slide", changeHash: false });
});

$("#cab_dtls #cls").on("click", function(){
	$("#cab_dtls").hide();
	$("#condition_div").hide();	
});
$("#slctddrpLocation").on("click", function(){

	window.sessionStorage.setItem("from_ttlFare","yes");
	
	$.mobile.changePage("#DropoffLocation", { transition: "slideup", changeHash: false });
});

$("#btn_sbmt").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var cmnt = $("#rideCmnt").val();
	if(cmnt == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Comment");
	}else{
		$.ajax({
			type: 'POST',
			url: server_url+"cabs/write_comment.php",
			data:{
					driverID: $("#rd_drID").text(),
					custID: $("#rd_custID").text(),
					bookingID: $("#rd_bookedID").text(),
					comment: cmnt
			},
			success: function(response) {
				//alert(response);
				if(response == "Success"){
					window.plugins.spinnerDialog.hide();
					alert("Your review has been submitted successfully.");
					$.mobile.changePage("#bookridePage", { transition: "fadeout", changeHash: false });
				}else{
					window.plugins.spinnerDialog.hide();
					alert(response);
				}
			},
			error: function(error){
				window.plugins.spinnerDialog.hide();
				if(error.status == "0"){
					alert("Unable to connect server, Try again.");
				}else{
					alert("Something went wrong, Try again.");
				}
			}
		});
	}
});

$("#dv_gttlFare").on("click", function(){
	window.sessionStorage.setItem("from_ttlFare","yes");
	$.mobile.changePage("#DropoffLocation", { transition: "slideup", changeHash: false });
});

$("#rd_now").on("click", function(){
	
	var cabName = $("#cab_dtls #cat_name").text();
	var cabID = $("#cab_dtls").attr("data-cabID");
	var time = $("#cab_dtls").attr("data-time");
	
	$("#cab_dtls").hide();
	$("#condition_div").hide();
	$("#cab_dtls #cat_name").text("");
	
	if(cabName != ""){
		
		$("#vehicleName").text(cabName+", "+time);
		$("#slctdpickLocation p").text($("#pickLocation").text());
		$("#slctddrpLocation p").text($("#dropLocation").text());
		$("#slctddrplatlng").val($("#dropLatLng").val());
		$("#slctdpicklatlng").val($("#pickLatLng").val());
		
		var currentdate = new Date(); 
		var datetime;
		var hours = currentdate.getHours() > 12 ? currentdate.getHours() - 12 : currentdate.getHours();
		var am_pm = currentdate.getHours() >= 12 ? "PM" : "AM";
		hours = hours < 10 ? "0" + hours : hours;
		var minutes = currentdate.getMinutes() < 10 ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
		var t = hours + ":" + minutes+ " " + am_pm;
		if((currentdate.getMonth()+1).toString().length == 1){
			datetime = currentdate.getDate() + "/0"
				+ (currentdate.getMonth()+1) + "/" 
				+ currentdate.getFullYear() + " " + t;
		}else{
			datetime = currentdate.getDate() + "/"
				+ (currentdate.getMonth()+1) + "/" 
				+ currentdate.getFullYear() + " " + t;
		}
		
		$("#pckTime span").text(datetime);
		
		if(isAcCab != null){
			//alert(isAcCab);
		}
		
		RIDE_LATER = false;
		$.mobile.changePage("#bookDetailspage", { transition: "slide", changeHash: false });
	}		
});

$("#rd_ltr").on("click", function(){
	
	var cabName = $("#cab_dtls #cat_name").text();
	var cabID = $("#cab_dtls").attr("data-cabID");
	var time = $("#cab_dtls").attr("data-time");
	
	//alert(cabName);
	$("#vehicleName").text(cabName+", "+time);
	if(cabName != ""){
		
		var options = {
			type: 'date',         // 'date' or 'time', required 
			date: new Date(),     // date or timestamp, default: current date 
			minDate: new Date(),  // date or timestamp 
			//maxDate: new Date()   // date or timestamp 
		};
		 
		window.DateTimePicker.pick(options, function (timestamp) {
			var options = {
				type: 'time',         // 'date' or 'time', required 
				date: new Date(),     // date or timestamp, default: current date 
				minDate: new Date(),  // date or timestamp 
				//maxDate: new Date()   // date or timestamp 
			};
			 
			window.DateTimePicker.pick(options, function (time) {
				
				var d = new Date(timestamp);
				var formattedDate;
				if((d.getMonth()+1).toString().length == 1){
					formattedDate = d.getDate() + "/0" + (d.getMonth() + 1) + "/" + d.getFullYear();
				}else{
					formattedDate = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
				}
				
				var d2 = new Date(time);
				var hours = d2.getHours() > 12 ? d2.getHours() - 12 : d2.getHours();
				var am_pm = d2.getHours() >= 12 ? "PM" : "AM";
				hours = hours < 10 ? "0" + hours : hours;
				var minutes = d2.getMinutes() < 10 ? "0" + d2.getMinutes() : d2.getMinutes();
				var formattedTime = hours + ":" + minutes+ " " + am_pm;
				
				formattedDate = formattedDate + " " + formattedTime;
				
				//alert(formattedDate);
				
				/*currentdate = currentdate.toString();
				currentdate = currentdate.split(" ");
				currentdate = currentdate[1]+" "+currentdate[2]+" "+currentdate[3]+" "+currentdate[4];*/
			
				$("#slctdpickLocation p").text($("#pickLocation").text());
				$("#slctddrpLocation p").text($("#dropLocation").text());
				$("#slctddrplatlng").val($("#dropLatLng").val());
				$("#slctdpicklatlng").val($("#pickLatLng").val());
					
				$("#pckTime span").text(formattedDate);
				
				$("#cab_dtls").hide();
				$("#condition_div").hide();
				$("#cab_dtls #cat_name").text("");
				
				/*var p1 = $("#pickLatLng").val();
					
				p1 = p1.split(','); 
				
				p1 = new google.maps.LatLng(parseFloat(p1[0]) , parseFloat(p1[1]));
				
				if($("#dropLocation").text() != ""){
					
					var p2 = $("#dropLatLng").val();
			
					p2 = p2.split(','); 
					
					p2 = new google.maps.LatLng(parseFloat(p2[0]) , parseFloat(p2[1]));
					
					$.ajax({
						url: server_url+"getRideFares.php",
						data: {pickLatLng:$("#pickLatLng").val(),dropLatLng:$("#dropLatLng").val(),driverID:cabid},
						type: "POST",
						success: function(msg){
							//alert(msg);
							var a = JSON.parse(msg);
							var outp = a["msg"];
							if(outp == "success"){
								fe = a["charge"];
								$("#ridFare #rd_fare1").text(a["charge"]);
								$("#ridFare #rd_tx1").text(a["tax"]);
								$("#ridFare #rd_ttlFare1").text(a["total"]);
								
							}else{
								//alert(outp);
							}
						},
						error: function(err){
							//alert(err);
						}
					});
				
				}*/
				RIDE_LATER = true;
				$.mobile.changePage("#bookDetailspage", { transition: "slide", changeHash: false });
				
			});
		});
	}
});

$("#back").click(function(){
	window.location = 'index.html';
});

document.addEventListener("backbutton", function (e) {
	window.location = 'index.html';
}, false);

function onPause() {
	// TODO: This application has been suspended. Save application state here.
};
	
var isAcCab = false;
function showvhcles(isRideLaterAvailable, driverID, time, cabID, lat, lng){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	$(".cab-type div").css("background-color", "#DDD");
	$('#cab_dtls').attr('data-cabID', cabID);
	$('#cab_dtls').attr('data-time', time);
	
	for (var i = 0; i < markers.length; i++) {
	  markers[i].setMap(null);
	}
	
	drid = driverID;
	
	//alert(drid);
	
	$("#condition_div").hide();
	$("#cab_dtls").hide();
	//$("#car_ac").prop("checked", true);
	//$("input[type='radio'][name=car_condition]").checkboxradio("refresh");
	$("#condition_div #div_ac").css("background", "#FFFFFF");
	$("#condition_div #div_nonac").css("background", "#FFFFFF");
	
	if(cabID == ""){
		$("#rd_ltr").css("opacity", "0.9");
		$("#rd_now").css("opacity", "0.9");
		$("#rd_ltr").prop("disabled", true);
		$("#rd_now").prop("disabled", true);
		window.plugins.spinnerDialog.hide();
	}else{
		$(".cab-type div:active").css("background-color", "#fc9e1a");
		$("#rd_ltr").css("opacity", "1");
		$("#rd_now").css("opacity", "1");
		$("#rd_ltr").prop("disabled", false);
		$("#rd_now").prop("disabled", false);
		if(isRideLaterAvailable == "yes"){
			$("#rd_ltr").show();
			$("#rd_now").css("width", "49%");				
		}else{
			$("#rd_ltr").hide();
			$("#rd_now").css("width", "100%");
		}
		$.ajax({
			type: 'POST',
			url: server_url+"cabs/get_all_vehicles.php",
			data:{cabID: cabID, driverID: driverID, lat: lat, lng: lng},
			success: function(response) {
				//alert(response);
				var a = JSON.parse(response);
				if(a.length > 1){
					var condition = a[0].condition;
					if(condition == "yes"){
						$("#condition_div").show();						
						$("#cat_name").html(a[0].cab_type);
						var b = a[0].brands;
						if(b.length > 1){
							var brnds = "";
							for(var j=1; j<b.length; j++){
								if(brnds != ""){
									brnds += ",";
								}
								brnds += b[j].brand_name;
							}
							$("#cat_brands").html(brnds);
						}
						isAcCab = true;
						$("#cat_condition").html("AC Fare");
						$("#cat_minCharge").html(a[0].min_charge_with_ac+" ("+a[0].min_charge_km+")");
						$("#cat_rate_per_km").html(a[0].per_km_with_ac);
						$("#condition_div #div_ac").css("background", "#F9A825");
						$("#cab_dtls").show();
					}else{
						$("#condition_div").hide();
						$("#cat_name").html(a[0].cab_type);
						var b = a[0].brands;
						if(b.length > 1){
							var brnds = "";
							for(var j=1; j<b.length; j++){
								if(brnds != ""){
									brnds += ",";
								}
								brnds += b[j].brand_name;
							}
							$("#cat_brands").html(brnds);
						}
						isAcCab = false;
						$("#cat_condition").html("NON-AC Fare");
						$("#cat_minCharge").html(a[0].min_charge_without_ac+" ("+a[0].min_charge_km+")");
						$("#cat_rate_per_km").html(a[0].per_km_without_ac);
						$("#condition_div #div_nonac").css("background", "#F9A825");
						$("#cab_dtls").show();
					}	
					
					/*$('input[type=radio][name=car_condition]').change(function() {
						if (this.value == 'AC') {
							$("#cat_condition").html("AC Fare");
							$("#cat_minCharge").html(a[0].min_charge_with_ac+" ("+a[0].min_charge_km+")");
							$("#cat_rate_per_km").html(a[0].per_km_with_ac);
							isAcCab = true;							
						}else if (this.value == 'NONAC') {
							$("#cat_condition").html("NON-AC Fare");
							$("#cat_minCharge").html(a[0].min_charge_without_ac+" ("+a[0].min_charge_km+")");
							$("#cat_rate_per_km").html(a[0].per_km_without_ac);
							isAcCab = false;
						}
					});*/
					
					$('#condition_div #div_nonac').on("click", function() {
						$("#condition_div #div_ac").css("background", "#FFFFFF");
						$("#condition_div #div_nonac").css("background", "#F9A825");
						$("#cat_condition").html("NON-AC Fare");
						$("#cat_minCharge").html(a[0].min_charge_without_ac+" ("+a[0].min_charge_km+")");
						$("#cat_rate_per_km").html(a[0].per_km_without_ac);
						isAcCab = false;
					});
					
					$('#condition_div #div_ac').on("click", function() {
						$("#condition_div #div_nonac").css("background", "#FFFFFF");
						$("#condition_div #div_ac").css("background", "#F9A825");
						$("#cat_condition").html("AC Fare");
						$("#cat_minCharge").html(a[0].min_charge_with_ac+" ("+a[0].min_charge_km+")");
						$("#cat_rate_per_km").html(a[0].per_km_with_ac);
						isAcCab = true;	
					});
					
					for(var i=1; i<a.length; i++){
						var lat = a[i].lat;
						var lng = a[i].lng;
						var pic = a[i].cabphoto;
						
						//alert(lat+","+lng);
						
						var LatLng = new google.maps.LatLng(lat,lng);
						var marker = new google.maps.Marker({
						  position: LatLng,
						  map: mainMap,
						  icon: "img/car_top_view.png"
						});
						markers.push(marker);
					}
					window.plugins.spinnerDialog.hide();
				}else{
					window.plugins.spinnerDialog.hide();
				}
			},
			error: function(error){
				window.plugins.spinnerDialog.hide();
				if(error.status == "0"){
					alert("Unable to connect server, Try again.");
				}else{
					alert("Something went wrong, Try again.");
				}
			}
		});
	}
}
function MoveBookRide(time, name, cabid, cabfee, fee, currency) {
	
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	drid = cabid;
	
	$("#vehicleName").text("");
	$("#slctdpickLocation p").text("");
	$("#slctddrpLocation p").text("");
	$("#slctdpicklatlng").val("");
	$("#slctddrplatlng").val("");
	$("#ridFare #rd_fare1").val("");
	$("#ridFare #rd_tx1").val("");
	$("#ridFare #rd_ttlFare1").val("");
	
	if($("#dropLocation").text() == "Choose dropoff location"){
				window.plugins.spinnerDialog.hide();
		$.mobile.changePage("#DropoffLocation", { transition: "slide", changeHash: false });
	}else{
		
		$("#vehicleName").text(name+", "+time);
		$("#slctdpickLocation p").text($("#pickLocation").text());
		$("#slctddrpLocation p").text($("#dropLocation").text());
		$("#slctdpicklatlng").val($("#pickLatLng").val());
		$("#slctddrplatlng").val($("#dropLatLng").val());
	
		var currentdate = new Date(); 
		var datetime;
		var hours = currentdate.getHours() > 12 ? currentdate.getHours() - 12 : currentdate.getHours();
		var am_pm = currentdate.getHours() >= 12 ? "PM" : "AM";
		hours = hours < 10 ? "0" + hours : hours;
		var minutes = currentdate.getMinutes() < 10 ? "0" + currentdate.getMinutes() : currentdate.getMinutes();
		var t = hours + ":" + minutes+ " " + am_pm;
		if((currentdate.getMonth()+1).toString().length == 1){
			datetime = currentdate.getDate() + "/0"
                + (currentdate.getMonth()+1) + "/" 
                + currentdate.getFullYear() + " " + t;
		}else{
			datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1) + "/" 
                + currentdate.getFullYear() + " " + t;
		}	
		$("#pckTime span").text(datetime);
		
		var p1 = $("#pickLatLng").val();
			
		p1 = p1.split(','); 
		
		p1 = new google.maps.LatLng(parseFloat(p1[0]) , parseFloat(p1[1]));
		
		var p2 = $("#dropLatLng").val();
	
		p2 = p2.split(','); 
		
		p2 = new google.maps.LatLng(parseFloat(p2[0]) , parseFloat(p2[1]));
		
		$.ajax({
			url: server_url+"getRideFares.php",
			data: {pickLatLng:$("#pickLatLng").val(),dropLatLng:$("#dropLatLng").val(),driverID:cabid},
			type: "POST",
			success: function(msg){
				//alert(msg);
				var a = JSON.parse(msg);
				var outp = a["msg"];
				if(outp == "success"){
					fe = a["charge"];
					$("#ridFare #rd_fare1").text(a["charge"]);
					$("#ridFare #rd_tx1").text(a["tax"]);
					$("#ridFare #rd_ttlFare1").text(a["total"]);
					window.plugins.spinnerDialog.hide();
				}else{
					window.plugins.spinnerDialog.hide();
					alert(outp);
				}
			},
			error: function(err){
				//alert(err);
				window.plugins.spinnerDialog.hide();
			}
		});
		
		//alert(currency+""+fee);
		$.mobile.changePage("#bookDetailspage", { transition: "slide", changeHash: false });
	}
}

//calculates distance between two points in km's
function calcDistance(p1, p2) {
  return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
}

$("#pp_requesting").on("pageshow", function(){
	var elem = document.getElementById("showProgress");
	var step =  0;
	interval = setInterval(function () {
        step += 1;
		//alert(step);
        //$('#page-wrap span').animate({width: step+"%"}, {duration: 1000, easing: 'linear'});
        //$('#page-wrap span').css('width', width + "%");
		elem.style.width = step + '%';
		if(step === 100){
			clearInterval(interval);
			function onConfirm(buttonIndex) {
				if(buttonIndex == 1){	
					window.plugins.toast.showLongBottom("Thank You.", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
					$.mobile.changePage("#bookridePage", { transition: "fadeout", changeHash: false });
				}
			}
			navigator.notification.confirm(
				'Sorry for inconvenience, Driver unable to accept Request.Pick another!', // message
				 onConfirm,            // callback to invoke with index of button pressed
				'Confirmation',           // title
				['OK']     // buttonLabels
			);
		}
    }, 1000);
});
$("#pp_requesting_footer img").on("click", function(){
	var elem = document.getElementById("showProgress");
	//alert($("#pp_requesting_footer img").data("bookingID"));
	window.plugins.spinnerDialog.show("Request Cancel","Wait while cancelling request..", true);
	$.ajax({
		type: 'POST',
		url: server_url+"cabs/cancel_ride.php",
		data: {bookingID: $("#pp_requesting_footer img").data("bookingID"),notification:"no"},
		success: function(response) {
			//alert(response);
			if(response == "success"){
				window.plugins.toast.showLongBottom("You cancelled Ride", "center",
					function(a){console.log("toast success: "+a)}, 
					function(err){console.log("toast error "+err)});
				window.plugins.spinnerDialog.hide();
				clearInterval(interval);
				//$('#page-wrap span').animate({width: "0%"}, {duration: 0, easing: 'linear'});
				elem.style.width = '0%';
				$.mobile.changePage("#bookridePage", { transition: "slideup", changeHash: false });
			}else{
				window.plugins.spinnerDialog.hide();
				alert(responses);
			}
		},
		error: function(error){
			window.plugins.spinnerDialog.hide();
			//console.log(error);
		}
	});
});
$("#frm_pickupLoc,#frm_dropOff,#frm_bookDtls").on("click", function(){
	$.mobile.changePage("#bookridePage", { transition: "slide", reverse:true, changeHash: false });
});