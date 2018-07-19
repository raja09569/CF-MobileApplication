document.addEventListener('deviceready', onDeviceReady.bind(this), false);	
document.addEventListener("backbutton", backClick, false);
var wid, hght;
$(document).ready(function(){
	var win_wid = $(window).width()/100;
	var win_height = $(window).height()/100;
	
	wid = $(window).width()/100;
	hght = $(window).height();
	/*$(".title").css("font-size", wid*4.3+"px");  //14px
	if(Math.round(window.devicePixelRatio) == 0.75) {
		$(".back-icon").attr('src', '../www/img/ldpi/back.png'); 
		$(".app-icon").attr('src', '../www/img/ldpi/logo.png');   
		$(".meuu-icon").attr('src', '../www/img/ldpi/menu.png');   
	}else if(Math.round(window.devicePixelRatio) == 1) {
		$(".back-icon").attr('src', '../www/img/mdpi/back.png');
		$(".app-icon").attr('src', '../www/img/mdpi/logo.png'); 
		$(".menu-icon").attr('src', '../www/img/mdpi/menu.png');  
	}else if(Math.round(window.devicePixelRatio) == 1.5) {
		$(".back-icon").attr('src', '../www/img/hdpi/back.png');
		$(".app-icon").attr('src', '../www/img/hdpi/logo.png'); 
		$(".menu-icon").attr('src', '../www/img/hdpi/menu.png');  
	}else if(Math.round(window.devicePixelRatio) == 2) {
		$(".back-icon").attr('src', '../www/img/xhdpi/back.png');
		$(".app-icon").attr('src', '../www/img/xhdpi/logo.png'); 
		$(".menu-icon").attr('src', '../www/img/xhdpi/menu.png'); 
	}else{
		$(".back-icon").attr('src', '../www/img/xxhdpi/back.png');
		$(".app-icon").attr('src', '../www/img/xxhdpi/logo.png');
		$(".menu-icon").attr('src', '../www/img/xxhdpi/menu.png');
	}
	*/
	$("#et_fmobile").intlTelInput({
	  initialCountry: "auto",
	  geoIpLookup: function(callback) {
		$.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
		  var countryCode = (resp && resp.country) ? resp.country : "";
		  callback(countryCode);
		  //alert(countryCode);
		});
	  },
	  utilsScript: "build/js/utils.js" // just for formatting/placeholders etc
	});
	
	$("#et_uname").intlTelInput({
	  initialCountry: "auto",
	  geoIpLookup: function(callback) {
		$.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
		  var countryCode = (resp && resp.country) ? resp.country : "";
		  callback(countryCode);
		  //alert(countryCode);
		});
	  },
	  utilsScript: "build/js/utils.js" // just for formatting/placeholders etc
	});
	
});

// iOS 
function onNotificationAPN (event) {
  if ( event.alert )
  {
    navigator.notification.alert(event.alert);
  }
 
  if ( event.sound )
  {
    var snd = new Media(event.sound);
    snd.play();
  }
 
  if ( event.badge )
  {
    pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
  }
}
function onDeviceReady() {
	
	var pushNotification = window.plugins.pushNotification;
	
	onNotification = function(e) {
	  //alert(e.event);
	  switch( e.event ){
	  case 'registered':
		if ( e.regid.length > 0 ){
			window.localStorage.setItem("regID", e.regid);
			var uname = window.localStorage.getItem("username");
			if(uname != null){
				var networkState = navigator.connection.type;
				if (networkState !== Connection.NONE) {
					$.ajax({
						type: 'POST',
						url: server_url+"update_regID.php",
						data:{
								driverID: window.localStorage.getItem("driverID"),
								regID: e.regid
							},
						success: function(response) {
							//alert(response);
							var a = JSON.parse(response);
							if(a['msg'] == "success"){
								window.localStorage.setItem("regID", e.regid);
							}
						},
						error: function(error){
							
						}
					});
				}					
			}
		}
	  break;
	 
	  case 'message':
		if ( e.foreground ){ 
			if(e.payload.type == "booking"){
				if(e.payload.response == "Cancelled"){
					if($.mobile.activePage.find("#regPop").parent().hasClass("ui-popup-active") == true){
						$("#regPop").popup().popup("close");
						$("#regPop").css("display", "none");
					}
					if($.mobile.activePage.attr("id") == "page_main"){
						window.localStorage.removeItem("latlng");
						window.localStorage.removeItem("location");
						window.localStorage.removeItem("bookStatus");
						$.mobile.changePage(window.location.href, { allowSamePageTransition: true, changeHash: true });
					}else{
						window.localStorage.setItem("bookStatus", "cancelled");
						$.mobile.changePage("#page_main", { transition: "fadeout", changeHash: false });
					}
					//alert("Booking("+e.payload.bookingID+") has been Cancelled.");
				}else{
					$("#rqBokId span").html(e.payload.bookingID);
					$("#pckLocVal").html(e.payload.pickLocation);
					
					$("#regPop").popup().popup("open");
					$("#regPop").css("display", "block");
				}				
			}
		}else{  // otherwise we were launched because the user touched a notification in the notification tray. 
			if( e.coldstart ){
				if(e.payload.type == "booking"){
					
					if(e.payload.response == "Cancelled"){
						if($.mobile.activePage.find("#regPop").parent().hasClass("ui-popup-active") == true){
							$("#regPop").popup().popup("close");
							$("#regPop").css("display", "none");
						}
						window.localStorage.setItem("bookStatus", "cancelled");
						//alert("Booking("+e.payload.bookingID+") has been Cancelled.");
					}else{						
						$("#rqBokId span").html(e.payload.bookingID);
						$("#pckLocVal").html(e.payload.pickLocation);
						window.sessionStorage.setItem("notification", "yes");
					}
				}
			}else{
				if(e.payload.type == "booking"){
					if(e.payload.response == "Cancelled"){
						if($.mobile.activePage.find("#regPop").parent().hasClass("ui-popup-active") == true){
							$("#regPop").popup().popup("close");
							$("#regPop").css("display", "none");
						}
						if($.mobile.activePage.attr("id") == "page_main"){
							window.localStorage.removeItem("latlng");
							window.localStorage.removeItem("location");
							window.localStorage.removeItem("bookStatus");
							$.mobile.changePage(window.location.href, { allowSamePageTransition: true, changeHash: true });
						}else{
							window.localStorage.setItem("bookStatus", "cancelled");
							$.mobile.changePage("#page_main", { transition: "fadeout", changeHash: false });
						}
					}else{						
						$("#rqBokId span").html(e.payload.bookingID);
						$("#pckLocVal").html(e.payload.pickLocation);
						window.sessionStorage.setItem("notification", "yes");
					}
				}
			}
		}
		 //Only works on Amazon Fire OS 
		 //console.log('MESSAGE -> TIME: ' + e.payload.timeStamp);
	  break;
	 
	  case 'error':
		console.log('ERROR -> MSG:' + e.msg);
	  break;
	 
	  default:
		console.log('EVENT -> Unknown, an event was received and we do not know what it is');
	  break;
	  }
	}

	if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
		pushNotification.register(
		successHandler,
		errorHandler,
		{
			"senderID":"91045960160",
			"ecb":"onNotification"
		});
	} else {
		pushNotification.register(
		tokenHandler,
		errorHandler,
		{
			"badge":"true",
			"sound":"true",
			"alert":"true",
			"ecb":"onNotificationAPN"
		});
	}
	
	var uuid = device.uuid;
	//alert(uuid);
	if(uuid != null){
		if(uuid != ""){
			window.localStorage.setItem("deviceID", uuid);
		}
	}	
	
	var counter = 30;
	var media = new Media(getMediaUrl('media/1.mp3'),
					function() {
						console.log("playAudio():Audio Success");
					},
					// error callback
					function(err) {
						console.log("playAudio():Audio Error: "+err.code);
					}
				);
	var interval;
	/*$( "#regPop" ).bind({
		popupafteropen: function(event, ui) { 
			
			var d = new Date();
			var hours = d.getHours();
			var minuts = d.getMinutes();
			if(hours.toString().length == 1){
				hours = "0"+hours;
			}
			if(minuts.toString().length == 1){
				hours = "0"+minuts;
			}
			$("#crntTime").text(hours+":"+minuts);
			
			var yy = d.getFullYear().toString().substr(-2);
			d =d.toString();
			
			var parts = d.split(" ");
			$("#crntDate").text(parts[2]+'-'+parts[1]+'-'+yy);
			
			interval = setInterval(function() {
				media.play();
				$("#timeLeft").fadeOut(400, function () {
				  $(this).html(counter+" Seconds").fadeIn(400);
				});
				if (counter == 0) {
					$("#regPop").popup().popup("close");
					$("#regPop").css("display", "none");
					clearInterval(interval);
				}
				counter--;
			}, 1500);
		},
		popupafterclose: function(event, ui) { 
			media.stop();
			clearInterval(interval);
		}
	});*/
	$("#btn_reject").on("click", function(){
		media.stop();
		clearInterval(interval);
		function onConfirm(buttonIndex) {
			if(buttonIndex == "1"){
				window.plugins.spinnerDialog.show("Cancel","Wait while cancelling..", true);
				var networkState = navigator.connection.type;
				if (networkState !== Connection.NONE) {
					$.ajax({
						type: 'POST',
						url: server_url+"driverResponse.php",
						data:{
								driverID: window.localStorage.getItem('driverID'),
								bookingID: $("#rqBokId span").text(),
								response: "Cancelled"
							},
						success: function(response) {
							window.plugins.spinnerDialog.hide();
							var a = JSON.parse(response);
							var msg = a["msg"];
							if(msg == "success"){
								$("#regPop").popup().popup("close");
								$("#regPop").css("display", "none");
								window.sessionStorage.removeItem("notification");
								/*jQuery.mobile.changePage(window.location.href, {
									allowSamePageTransition: true,
									transition: 'none',
									reloadPage: true
								});*/
								if($.mobile.activePage.attr("id") == "page_main"){
									$.mobile.changePage(window.location.href, { allowSamePageTransition: true, changeHash: true });
								}else{
									$.mobile.changePage("#page_main", { transition: "fadeout", changeHash: false });
								}
								alert("you Cancelled Booking!");
							}else{
								//$("#regPop").popup().popup("close");
								//$("#regPop").css("display", "none");
								alert(msg);
							}
						},
						error: function(error){
							if(error.status == "0"){
								window.plugins.spinnerDialog.hide();
								alert("Unable to connect server, Try again.");
							}else{
								window.plugins.spinnerDialog.hide();
								alert("Something went wrong, Try again.");
							}
						}
					});
				}else{					
					window.plugins.spinnerDialog.hide();
					alert("Check your internet connection, Try again.");
				}									
			}
		}

		navigator.notification.confirm(
			'Are you sure you want to Cancel Booking ', // message
			 onConfirm,            // callback to invoke with index of button pressed
			'Confirmation',           // title
			['YES','NO']     // buttonLabels
		);
	});

	$("#btn_accept").on("click", function(){
		media.stop();
		clearInterval(interval);
		function onConfirm(buttonIndex) {
			if(buttonIndex == "1"){
				window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
				var networkState = navigator.connection.type;
				if (networkState !== Connection.NONE) {
					$.ajax({
						type: 'POST',
						url: server_url+"driverResponse.php",
						data:{
								driverID: window.localStorage.getItem('driverID'),
								bookingID: $("#rqBokId span").text(),
								response: "Booked"
							},
						success: function(response) {
							window.plugins.spinnerDialog.hide();
							//alert(response);
							var a = JSON.parse(response);
							var msg = a["msg"];
							if(msg == "success"){
								var location = a["location"];
								var latlng = a["latlng"];
								var cName = a["cName"];
								var cPic = a["cPic"];
								var cMobile = a["cMobile"];
								window.localStorage.setItem("bookStatus", "booked");
								window.localStorage.setItem("bookingID", $("#rqBokId span").text());
								window.localStorage.setItem("location", location);
								window.localStorage.setItem("latlng", latlng);
								window.localStorage.setItem("cName", cName);
								window.localStorage.setItem("cPic", cPic);
								window.localStorage.setItem("cMobile", cMobile);
								$("#regPop").popup().popup("close");
								$("#regPop").css("display", "none");
								
								$("#d_marker").attr("src", "img/greenmarker.png");
								$("#rd_bokId").text("BID: "+window.localStorage.getItem("bookingID"));
								$("#p_cName").text(window.localStorage.getItem("cName"));
								$("#p_Mobile").text(window.localStorage.getItem("cMobile"));
								if(window.localStorage.getItem('cPic') != ""){
									$("#cst_pc").attr("src", "http://travel.crescom.in/"+window.localStorage.getItem("cPic"));
								}else{
									$("#cst_pc").attr("src", "img/user.png");
								}
								$("#c_dtls2 p").text(window.localStorage.getItem("location"));
								window.sessionStorage.removeItem("notification");
								$("#c_dtls").show();
								$("#d_marker").attr("src", "img/greenmarker.png");
								$("#c_dtls").show();
								$("#btn_On").hide();
								$("#btn_Off").hide();
								$("#reached").text("ARRIVED");
								$("#reached").show();
								if($.mobile.activePage.attr("id") == "page_main"){
									$.mobile.changePage(window.location.href, { allowSamePageTransition: true, changeHash: true });
								}else{
									$.mobile.changePage("#page_main", { transition: "fadeout", changeHash: false });
								}
							}else{
								alert(msg);
							}
						},
						error: function(error){
							if(error.status == "0"){
								window.plugins.spinnerDialog.hide();
								alert("Unable to connect server, Try again.");
							}else{
								window.plugins.spinnerDialog.hide();
								alert("Something went wrong, Try again.");
							}
						}
					});
				}else{
					window.plugins.spinnerDialog.hide();
					alert("Check your internet connection, Try again.");
				}
			}
		}

		navigator.notification.confirm(
			'Are you sure? you are ready to take Booking ', // message
			 onConfirm,            // callback to invoke with index of button pressed
			'Confirmation',           // title
			['YES','NO']     // buttonLabels
		);
	});
	
	$("#reached").on("click", function(){
		var bookStatus = window.localStorage.getItem("bookStatus");
		if(bookStatus == "Arrived"){
			window.plugins.spinnerDialog.show("Start","Please wait..", true);
			var networkState = navigator.connection.type;
			if (networkState !== Connection.NONE) {
				$.ajax({
					type: 'POST',
					url: server_url+"startRide.php",
					data:{
							bookingID: window.localStorage.getItem("bookingID")
						},
					success: function(response) {
						//alert(response);
						window.plugins.spinnerDialog.hide();
						if(response == "success"){
							window.localStorage.setItem("bookStatus", "onBoarded");
												
							$("#d_marker").attr("src", "img/redmarker.png");
							$("#c_dtls").show();
							$("#btn_On").hide();
							$("#btn_Off").hide();
							$("#reached").text("STOP");
							$("#reached").show();
							if($.mobile.activePage.attr("id") == "page_main"){
								$.mobile.changePage(window.location.href, { allowSamePageTransition: true, changeHash: true });
							}else{
								$.mobile.changePage("#page_main", { transition: "fadeout", changeHash: false });
							}
						}else{
							window.plugins.spinnerDialog.hide();
							alert(response);
						}
					},
					error: function(error){
						if(error.status == "0"){
							window.plugins.spinnerDialog.hide();
							alert("Unable to connect server, Try again.");
						}else{
							window.plugins.spinnerDialog.hide();
							alert("Something went wrong, Try again.");
						}
					}
				});
			}else{
				window.plugins.spinnerDialog.hide();
				alert("Check your internet connection, Try again.");
			}	
		}else if(bookStatus == "onBoarded"){
			window.plugins.spinnerDialog.show("Finishing","Please wait..", true);
			var networkState = navigator.connection.type;
			if (networkState !== Connection.NONE) {
				$.ajax({
					type: 'POST',
					url: server_url+"finishRide.php",
					data:{
							bookingID: window.localStorage.getItem("bookingID")
						},
					success: function(response) {
						//alert(response);
						window.plugins.spinnerDialog.hide();
						if(response == "success"){						
							window.localStorage.removeItem("latlng");
							window.localStorage.removeItem("location");
							window.localStorage.setItem("bookStatus", "Finished");
							$.mobile.changePage("#page_myRideDtls", {transition:"flip"});
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
			}else{
				window.plugins.spinnerDialog.hide();
				alert("Check your internet connection, Try again.");
			}
			
		}else {
			$('#dialog_vCode').popup().popup('open');
		}
	});
	$("#verify_bookOTP").on("click", function(){
		window.plugins.spinnerDialog.show("Confirming","Please wait..", true);
		var otp = $("#vcode").val();
		if(otp == ""){
			window.plugins.spinnerDialog.hide();
			alert("Enter OTP");
		}else{	
			var networkState = navigator.connection.type;
			if (networkState !== Connection.NONE) {
				$.ajax({
					type: 'POST',
					url: server_url+"verifyCode.php",
					data:{
							bookingID: window.localStorage.getItem("bookingID"),
							otp: otp
						},
					success: function(response) {
						var a = JSON.parse(response);
						var msg = a["msg"];
						if(msg == "success"){
							var splace = a["startPlace"];
							var eplace = a["endPlace"];
							var endPlaceLatLng = a["endPlaceLatLng"];
							var tfee = a["totalFee"];
							if(endPlaceLatLng != ""){
								window.localStorage.setItem("latlng", endPlaceLatLng);
								window.localStorage.setItem("location", eplace);
								$("#d_marker").attr("src", "img/redmarker.png");								
							}else{
								$("#d_marker").attr("src", "img/greenmarker.png");
							}
							window.localStorage.setItem("bookStatus", "Arrived");
							window.plugins.spinnerDialog.hide();
							$("#c_dtls").show();
							$("#btn_On").hide();
							$("#btn_Off").hide();
							$("#reached").text("START");
							$("#reached").show();
							if($.mobile.activePage.attr("id") == "page_main"){
								$.mobile.changePage(window.location.href, { allowSamePageTransition: true, changeHash: true });
							}else{
								$.mobile.changePage("#page_main", { transition: "fadeout", changeHash: false });
							}
						}else{
							window.plugins.spinnerDialog.hide();
							alert(msg);
						}
					},
					error: function(error){
						//window.plugins.spinnerDialog.hide();
						if(error.status == "0"){
							window.plugins.spinnerDialog.hide();
							alert("Unable to connect server, Try again.");
						}else{
							window.plugins.spinnerDialog.hide();
							alert("Something went wrong, Try again.");
						}
					}
				});
			}else{
				window.plugins.spinnerDialog.hide();
				alert("Check your internet connection, Try again.");
			}
			
		}
	});
		
	var status = window.localStorage.getItem("vehicle_status");
	if(status != null){
		if(status == "on"){
			startFetchingLocation();
		}else{
			stopFetchingLocation();
		}
	}
	
	function onRequestSuccess(success){
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {			
			var uname = window.localStorage.getItem("username");
			if(uname == null){
				navigator.splashscreen.hide();
				$.mobile.changePage("#login");
			}else{
				navigator.splashscreen.hide();
				$.mobile.changePage("#page_main", {transition:"slide", reverse:false});
			}
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
				cordova.plugins.diagnostic.switchToLocationSettings();
			}else{
				navigator.app.exitApp();
			}
		}else{
			navigator.app.exitApp();
		}
	}

	cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure,
	cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
	
	document.addEventListener( 'pause', onPause.bind( this ), false );
	document.addEventListener( 'resume', onResume.bind( this ), false );
};

function onConfirm(buttonIndex) {
	if(buttonIndex == 1){
		is_loading = true;
		cordova.plugins.diagnostic.switchToMobileDataSettings();
	}else{
		is_loading = true;
		navigator.app.exitApp();
	}
}

$(document).on('click', '#open_menu', function() {              
	$('#panel').panel({ position: "left"});       
	$('#panel').panel("open");          
});  
function getMediaUrl(s){
	if(device.platform.toLowerCase() == "android"){
		return "/android_asset/www/"+s;
	}
	return s;
}

function successHandler (result) {
  //alert('result = ' + result);
}

function errorHandler (error) {
  //alert('error = ' + error);
}

$("#btn_On").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		$.ajax({
			type: 'POST',
			url: server_url+"changeStatus.php",
			data:{
					driverID: window.localStorage.getItem('driverID'),
					status: "on"
				},
			success: function(response) {
				//alert(response);
				if(response == "success"){
					window.localStorage.setItem("vehicle_status", "on");
					startFetchingLocation();
					$("#btn_On").hide();
					$("#btn_Off").show();
					alert("Your are Online!");
					window.plugins.spinnerDialog.hide();
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
	}else{
		window.plugins.spinnerDialog.hide();
		alert("Check your internet connection, Try again.");
	}	
});
$("#btn_Off").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		$.ajax({
			type: 'POST',
			url: server_url+"changeStatus.php",
			data:{
					driverID: window.localStorage.getItem('driverID'),
					status: "off"
				},
			success: function(response) {
				//alert(response);
				if(response == "success"){
					window.localStorage.setItem("vehicle_status", "off");
					stopFetchingLocation();
					$("#btn_Off").hide();
					$("#btn_On").show();
					alert("Your are Offline!");
					window.plugins.spinnerDialog.hide();
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
	}else{
		window.plugins.spinnerDialog.hide();
		alert("Check your internet connection, Try again.");
	}
	
});

$("#page_start").on("pageshow", function(){
	
});

function onPause() {
	// TODO: This application has been suspended. Save application state here.
};

function onResume() {
	// TODO: This application has been reactivated. Restore application state here.
};

$("#link_frgtPword, #setPword").on("click", function(){
	$.mobile.changePage("#page_forgotpassword", {transition:"slide", reverse:false, changeHash:false});
});

$("#back_fpword").on("click", function(){
	$.mobile.changePage("#login", {transition:"slide", reverse:true, changeHash:false});
});

$("#btn_fPword").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	
	var mobile = $("#et_fmobile").val();
	
	if(mobile == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter your Registered Mobile Number!");
	}else if($("#et_fmobile").intlTelInput("isValidNumber") == false){
		window.plugins.spinnerDialog.hide();
		alert("Enter valid Mobile Number!");
	}else{
		//alert(mobile);
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {
			$.ajax({
				url: server_url+"sendOTP.php",
				type: "post",
				data: {mobile: mobile},
				success: function(msg){
					if(msg == "success"){
						//alert(msg);
						window.sessionStorage.setItem("mobile", mobile);
						window.plugins.spinnerDialog.hide();
						$.mobile.changePage("#page_otp", {transition:"slide", reverse:false, changeHash:false});
					}else{
						window.plugins.spinnerDialog.hide();
						alert(msg);
					}
				},error:function(err){
					window.plugins.spinnerDialog.hide();
					//alert('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
					if(error.status == "0"){
						alert("Unable to connect server, Try again.");
					}else{
						alert("Something went wrong, Try again.");
					}
				}
			});
		}else{
			window.plugins.spinnerDialog.hide();
			alert("Check your internet connection, Try again.");
		}
	}
});

$("#back_otp").on("click", function(){
	$.mobile.changePage("#page_forgotpassword", {transition:"slide", reverse:true, changeHash:false});
});

$("#btn_otp").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var otp = $("#et_otp").val();
	if(otp == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter OTP!");
	}else{
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {
			$.ajax({
				url: server_url+"verifyOTP.php",
				type: "post",
				data: {mobile: window.sessionStorage.getItem("mobile"), otp: otp},
				success: function(msg){
					if(msg == "success"){
						//alert(msg);
						window.plugins.spinnerDialog.hide();
						$.mobile.changePage("#page_setNewpword", {transition:"slide", reverse:false, changeHash:false});
					}else{
						window.plugins.spinnerDialog.hide();
						alert(msg);
					}
				},error:function(err){
					window.plugins.spinnerDialog.hide();
					//alert('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
					if(error.status == "0"){
						alert("Unable to connect server, Try again.");
					}else{
						alert("Something went wrong, Try again.");
					}
				}
			});
		}else{
			window.plugins.spinnerDialog.hide();
			alert("Check your internet connection, Try again.");
		}
	}
});

$("#back_stNewPword").on("click", function(){
	$.mobile.changePage("#page_otp", {transition:"slide", reverse:true, changeHash:false});
});

$("#btn_stNewPword").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var pword = $("#et_stnpword").val();
	var repword = $("#et_strpword").val();
	
	if(pword == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Password!");
	}else if(repword == ""){
		window.plugins.spinnerDialog.hide();
		alert("Repeat Password!");
	}else if(pword != repword){
		window.plugins.spinnerDialog.hide();
		alert("Passwords should match!");
	}else{
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {
			$.ajax({
				url: server_url+"setNewPassword.php",
				type: "post",
				data: {
						mobile: window.sessionStorage.getItem("mobile"),
						pword: pword,
						deviceID: window.localStorage.getItem("deviceID")
					},
				success: function(msg){
					//alert(msg);
					if(msg == "success"){
						window.plugins.spinnerDialog.hide();
						$.mobile.changePage("#login", {transition:"none", changeHash:false});
					}else{
						window.plugins.spinnerDialog.hide();
						alert(msg);
					}
				},error:function(err){
					window.plugins.spinnerDialog.hide();
					if(error.status == "0"){
						alert("Unable to connect server, Try again.");
					}else{
						alert("Something went wrong, Try again.");
					}
				}
			});
		}else{
			window.plugins.spinnerDialog.hide();
			alert("Check your internet connection, Try again.");
		}
	}
});

$("#btn_signIn").on("click", function(){
	//alert(window.localStorage.getItem("regID"));
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	
	var uname = $("#et_uname").val();
	var pword = $("#et_upwrd").val();
	
	if(uname == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Registered Mobile Number");
	}else if($("#et_uname").intlTelInput("isValidNumber") == false){
		window.plugins.spinnerDialog.hide();
		alert("Enter valid Mobile Number");
	}else if(pword == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter password");
	}else{
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {
			$.ajax({
				type: 'POST',
				url: server_url+"driverLogin.php",
				data:{
						mobile: uname,
						pword: pword,
						regID: window.localStorage.getItem("regID"),
						deviceID: window.localStorage.getItem("deviceID")
					},
				success: function(response) {
					//alert(response);
					var a = JSON.parse(response);
					if(a.length != 0){
						if(a[0].msg == "success"){
							$("#et_uname").val("");
							$("#et_upwrd").val("");
							window.localStorage.setItem("username", uname);
							window.localStorage.setItem("driverID", a[0].driverID);
							window.localStorage.setItem("name", a[0].driverName);
							window.localStorage.setItem("vehicleno", a[0].vehicleNo);
							window.localStorage.setItem("pic", a[0].pic);
							window.localStorage.setItem("vehicle_status", a[0].vehicle_status);
							
							if(a[0].vehicle_status == "on"){
								$("#reached").hide();
								$("#btn_On").hide();
								$("#btn_Off").show();
								startFetchingLocation();
								window.plugins.spinnerDialog.hide();
								$.mobile.changePage("#page_main", {transition:"slide", reverse:false, changeHash:false});
							}else{
								$("#reached").hide();
								$("#btn_Off").hide();
								$("#btn_On").show();
								window.plugins.spinnerDialog.hide();
								$.mobile.changePage("#page_main", {transition:"slide", reverse:false, changeHash:false});
							}
							
						}else{
							window.plugins.spinnerDialog.hide();
							alert(a[0].msg);
						}
						
					}
				},
				error: function(error){
					if(error.status == "0"){
						window.plugins.spinnerDialog.hide();
						alert("Unable to connect server, Try again.");
					}else{
						window.plugins.spinnerDialog.hide();
						alert("Something went wrong, Try again.");
					}
				}
			});
			
		}else{
			window.plugins.spinnerDialog.hide();
			alert("Check your internet connection, Try again.");
		}
		
	}
	
});

$("#li_myRides").on("click", function(){
	$("[data-role=panel]").panel().panel("close");
	$.mobile.changePage("#page_myRides", {transition:"slide", reverse:false, changeHash:false});
});

$("#li_amntDtls").on("click", function(){
	$("[data-role=panel]").panel().panel("close");
	$.mobile.changePage("#page_amntDtls", {transition:"slide", reverse:false, changeHash:false});
});

$("#li_myCmnts").on("click", function(){
	$("[data-role=panel]").panel().panel("close");
	$.mobile.changePage("#page_Cmnts", {transition:"slide", reverse:false, changeHash:false});
});

$("#li_logout").on("click", function(){
	if(window.localStorage.getItem("vehicle_status") == "on"){
		window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {
			$.ajax({
				type: 'POST',
				url: server_url+"changeStatus.php",
				data:{
						driverID: window.localStorage.getItem('driverID'),
						status: "off"
					},
				success: function(response) {
					if(response == "success"){
						window.plugins.spinnerDialog.hide();
						window.localStorage.clear();
						$("[data-role=panel]").panel().panel("close");
						$.mobile.changePage("#login", {transition:"slide", reverse:true, changeHash:false});
					}else{
						window.plugins.spinnerDialog.hide();
						alert(response);
					}
				},
				error: function(error){
					if(error.status == "0"){
						window.plugins.spinnerDialog.hide();
						alert("Unable to connect server, Try again.");
					}else{
						window.plugins.spinnerDialog.hide();
						alert("Something went wrong, Try again.");
					}
				}
			});
		}else{
			window.plugins.spinnerDialog.hide();
			alert("Check your internet connection, Try again.");
		}
		
	}else{
		window.localStorage.clear();
		$("[data-role=panel]").panel().panel("close");
		$.mobile.changePage("#login", {transition:"slide", reverse:true, changeHash:false});
	}
});

$("#back_myRides, #back_cmnts, #back_amntDtls").on("click", function(){
	$.mobile.changePage("#page_main", {transition:"slide", reverse:true, changeHash:false});
});

$("#page_myRides").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		$.ajax({
			type: 'POST',
			url: server_url+"getDriverRides.php",
			data:{
					driverID: window.localStorage.getItem('driverID')
					//driverID: "CBDR0001"
				},
			success: function(response) {
				//alert(response);
				var a = JSON.parse(response);
				$("#list_myRides").empty();
				if(a.length != 0){
					for(var i=0; i<a.length; i++){
						var data = '<li style="padding:5px;" data-id="'+a[i].bookingID +'">';
						data += '<div id="dv1">';
						if(a[i].pic != ""){
							data += '<img src="http://travel.crescom.in/'+a[i].pic+'" style="width:100%;" />';
						}else{
							data += '<img src="img/user.png" style="width:100%;" />';
						}
						data += '</div>';
						data += '<div id="dv2">';
						data += '<h3>'+a[i].date+'</h3>';
						data += '<span>'+a[i].custName+', '+a[i].bookingID+'</span>';
						data += '<div id="frm_plc">';
						data += '<img src="img/round.png" /><p>'+a[i].startPlace+'</p>';
						data += '</div>';
						data += '<div id="to_plc">';
						data += '<img src="img/round.png" /><p>'+a[i].endplace+'</p>';
						data += '</div>';
						data += '</div>';
						data += '<div id="dv3">';
						data += '<h3>'+a[i].amount+'</h3>';
						data += '</div>';
						data += '</li>';
						
						$("#list_myRides").append(data);
					}
					window.plugins.spinnerDialog.hide();
				}else{
					$("#list_myRides").append("<li style='padding: 10px;text-align: center;font-size: 1em;'>"+
					"No Records Found!</li>");
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
	}else{
		window.plugins.spinnerDialog.hide();
		alert("Check your internet connection, Try again.");
	}	
});
var bookID = null;
$(document).on('vclick', '#list_myRides li', function () {
	bookID = $(this).attr('data-id');
	$.mobile.changePage('#page_myRideDtls', { reverse: false, transition: "flip" });
});
$("#page_myRideDtls").on("pageshow", function(){
	
	window.localStorage.removeItem("location");
	window.localStorage.removeItem("latlng");
	
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var bokID;
	if(bookID != null){
		bokID = bookID;
	}else{
		bokID = window.localStorage.getItem("bookingID");
	}
	
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		$.ajax({
			type: 'POST',
			url: server_url+"getRideDetails.php",
			data:{			
					bookingID: bokID
				},
			success: function(response) {
				//alert(response);
				var a = JSON.parse(response);
				if(a.length != 0){
					
					$("#map_div").css("height", $(window).height()*0.3+"px");
					
					var myOptions = {
						mapTypeId: google.maps.MapTypeId.ROADMAP,
					};
					
					var map = new google.maps.Map(document.getElementById("rideDtlMap"), myOptions);
					
					var bounds = new google.maps.LatLngBounds();
					
					var position1 = a[0].startPlaceLatLng;
					if(position1 != ""){
						
						position1 = position1.split(','); 
						
						position1 = new google.maps.LatLng(parseFloat(position1[0]) , parseFloat(position1[1]));
						//position1 = new google.maps.LatLng(17.368306, 78.524340);
						//alert(position1);
						
						// Add an overlay to the map of current lat/lng
						var marker1 = new google.maps.Marker({
							position: position1,
							map: map,
							title: "Pick Location",
							animation: google.maps.Animation.DROP,
							icon: "img/greenmarker.png"
						});
						bounds.extend(position1);
					}	
					
					var position2 = a[0].endPlaceLatLng;
					if(position2 != ""){				
						position2 = position2.split(','); 
						
						position2 = new google.maps.LatLng(parseFloat(position2[0]) , parseFloat(position2[1]));
						
						//alert(position2);
						
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
					
					$("#rd_date").text(a[0].date);
					$("#rd_bookedID").text(a[0].bookingID);
					
					$("#rdpickLocation span").text(a[0].startTime);
					$("#rdpickLocation p").text(a[0].startPlace);
					
					$("#rddrpLocation span").text(a[0].endTime);
					$("#rddrpLocation p").text(a[0].endplace);
					
					$("#rddrpLocation span").text(a[0].endTime);
					$("#rddrpLocation p").text(a[0].endplace);
					
					if(a[0].custPic != ""){
						$("#rd_csImage").attr("src", "http://travel.crescom.in/"+a[0].custPic);
					}else{
						$("#rd_csImage").attr("src", "img/user.png");
					}
					
					$("#rd_csName").text(a[0].custName);
					$("#rd_csMobile").html("<a href='tel:"+a[0].custNumber+"'>"+a[0].custNumber+"</a>");
					
					$("#rd_ridefare").text(a[0].amount);
					$("#rd_ttlFare").text(a[0].total);
					$("#rd_ttltx").text(a[0].tax);
					if(a[0].amountBy == ""){
						$("#rd_amntBy").hide();
						$("#pymnt_lable").hide();
					}else{
						$("#rd_amntBy").text(a[0].amountBy);
					}
					var bokstatus = window.localStorage.getItem("bookStatus");
					//alert(bokstatus);
					if(bokstatus != null){					
						if(bokstatus == "Finished"){
							$("#btn_receive").show();
						}else{
							$("#btn_receive").hide();
						}
					}else{
						$("#btn_receive").hide();
					}
					window.localStorage.removeItem("bookStatus");
					window.plugins.spinnerDialog.hide();
				}
			},
			error: function(error){
				window.plugins.spinnerDialog.hide();
				window.localStorage.removeItem("bookStatus");
				if(error.status == "0"){
					alert("Unable to connect server, Try again.");
				}else{
					alert("Something went wrong, Try again.");
				}
			}
		});
	}else{
		window.plugins.spinnerDialog.hide();
		window.localStorage.removeItem("bookStatus");
		alert("Check your internet connection, Try again.");
	}
});
$("#page_amntDtls").on("pageshow", function(){
	//$("#li_amntDtls").css('background', '#0D91F6');
	//$("#li_amntDtls").css('opacity', '.16');
	$("#list_amntdtls").empty();
	$("#tbl_total").hide();
	var today = new Date();
	today = today.toString();
	var dates = today.split(" ");
	today = dates[2]+" "+dates[1]+" "+dates[3];
	//today = "20 Apr 2017";
	$("#slctdDate").val(today);
	
	if(dates[1] == "May"){
		dates[1] = "05";
	}else if(dates[1] == "Jan"){
		dates[1] = "01";
	}else if(dates[1] == "Feb"){
		dates[1] = "02";
	}else if(dates[1] == "Mar"){
		dates[1] = "03";
	}else if(dates[1] == "Apr"){
		dates[1] = "04";
	}else if(dates[1] == "May"){
		dates[1] = "05";
	}else if(dates[1] == "Jun"){
		dates[1] == "06";
	}else if(dates[1] == "Jul"){
		dates[1] == "07";
	}else if(dates[1] == "Aug"){
		dates[1] == "08";
	}else if(dates[1] == "Sept"){
		dates[1] == "09";
	}else if(dates[1] == "Oct"){
		dates[1] = "10";
	}else if(dates[1] == "Nov"){
		dates[1] = "11";
	}else if(dates[1] == "Dec"){
		dates[1] = "12";
	}
	
	var mnth = dates[3]+"-"+dates[1];
	$("#slctdMonth").val(mnth);
	
	showAmoutnDtls(today);
	//showMnthAmoutnDtls(mnth);
});
$('#slctdMonth').on("click", function(){
	$('#slctdMonth').monthpicker();
});
$("#btn_dtshow").on("click",function(){
	showAmoutnDtls($("#slctdDate").val());
});
$("#btn_mnthshow").on("click",function(){
	var mnth = $("#slctdMonth").val();
	showMnthAmoutnDtls(mnth);
});
function showMnthAmoutnDtls(mnth){
	var mnths = mnth.split("-");
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	$("#tbl_amntDtls").empty();
	
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		$.ajax({
			type: 'POST',
			url: server_url+"getAmountDtls_month.php",
			data:{
					driverID: window.localStorage.getItem('driverID'),
					//driverID: "CBDR0001",
					month : mnths[1],
					year: mnths[0]
				},
			success: function(response) {
				//alert(response);
				var a = JSON.parse(response);
				var b = a["trips"];
				//alert(b.length);
				if(b.length != 0){
					for(var i=0; i<b.length; i++){
						
						var data = '<tr>';
						data += '<td style="width:68%;padding:1%;font-size:5vw !important;color:#000000;">'+b[i].date+'</td>';
						data += '<td style="width:28%;padding:1% 1% 1% 3%;font-size:5vw !important;color:#000000;">'+b[i].total+'</td>';
						data += '</tr>';
						$("#tbl_amntDtls").append(data);
					}
					window.plugins.spinnerDialog.hide();
					var c = a["totals"];
					var total = c["total"];
					var totalCommission = c["totalCommission"];
					$("#td_totalAmount").text(total);
					$("#td_totalCom").text(totalCommission);
					$("#tbl_total").show();
					
				}else{
					$("#tbl_amntDtls").append("<tr><td style='text-align:center;font-size:1em;padding:5px;'>No Records Found!</td></tr>");
					$("#tbl_total").hide();
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
	}else{
		window.plugins.spinnerDialog.hide();
		alert("Check your internet connection, Try again.");
	}
}
$("#slctdDate").on("click", function(){
	var options = {
		type: 'date',         // 'date' or 'time', required 
		date: new Date(),     // date or timestamp, default: current date 
		//minDate: new Date(),  // date or timestamp 
		maxDate: new Date()   // date or timestamp 
	};
	 
	window.DateTimePicker.pick(options, function (timestamp) {
		
		var d = new Date(timestamp);
		var today = d.toString();
		var dates = today.split(" ");
		today = dates[2]+" "+dates[1]+" "+dates[3];
		$("#slctdDate").text(today);
		
	});
});
function showAmoutnDtls(date){
	$("#list_amntdtls").empty();
	$("#tbl_total").show();
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		$.ajax({
			type: 'POST',
			url: server_url+"getAmountDtls_date.php",
			data:{
					driverID: window.localStorage.getItem('driverID'),
					//driverID: "CBDR0001",
					date : date
				},
			success: function(response) {
				//alert(response);
				var a = JSON.parse(response);
				var b = a["trips"];
				
				if(b.length != 0){
					for(var i=0; i<b.length; i++){
						
						var data = '<li>';
						data += '<div id="div_cstmr">';
						data += '<p id="cst_name">'+b[i].custName+'</p>';
						data += '<div id="cst_pick">';
						data += '<img src="img/round.png" />';
						data += '<p>'+b[i].startPlace+'</p>';
						data += '</div>';
						data += '<div id="cst_drop">';
						data += '<img src="img/round.png" />';
						data += '<p>'+b[i].endplace+'</p>';
						data += '</div>';
						data += '</div>';
						data += '<div id="div_amnt">';
						data += '<p>'+b[i].amount+'</p>';
						data += '</div>';
						data += '</li>';
						
						$("#list_amntdtls").append(data);
					}
					window.plugins.spinnerDialog.hide();
					
					var c = a["totals"];
					var total = c["total"];
					var totalCommission = c["totalCommission"];
					if(total != ""){
						$("#tbl_total").show();
						$("#td_totalAmount").text(total);
						$("#td_totalCom").text(totalCommission);
					}else{
						$("#tbl_total").hide();
						$("#td_totalAmount").text(total);
						$("#td_totalCom").text(totalCommission);
					}
				
				}else{
					$("#list_amntdtls").append("<li style='padding: 10px;text-align: center;font-size: 1em;'>"+
					"No Records Found!</li>");
					$("#tbl_total").hide();
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
	}else{
		window.plugins.spinnerDialog.hide();
		alert("Check your internet connection, Try again.");
	}
}
$("#back_myRideDtls").on("click", function(){
	var bookingID = window.localStorage.getItem("bookingID");
	if(bookingID != null){
		$.mobile.changePage("#page_main", {transition:"slide", reverse:true});
	}else{
		$.mobile.changePage("#page_myRides", {transition:"slide", reverse:true});
	}
});
function backClick(){
	navigator.app.exitApp();
}
$("#back_cmntDtls").on("click", function(){
	$.mobile.changePage("#page_Cmnts", {transition:"slide", reverse:true, changeHash:false});
});
function showcmntDtls(){
	$.mobile.changePage("#page_cmntDtls", {transition:"slide", reverse:false, changeHash:false});
}
$("#page_main").on("pagebeforeshow", function(){
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		if(window.localStorage.getItem('pic') != ""){
			$("#dr_img").attr("src", ad_attachment_url+window.localStorage.getItem("pic"));
		}else{
			$("#dr_img").attr("src", "img/user.png");
		}
	}else{
		$("#dr_img").attr("src", "img/user.png");
	}
	$("#dr_name").text(window.localStorage.getItem('name'));
	$("#dr_vhclNo").text(window.localStorage.getItem('vehicleno'));
	$("#dr_vhclEmail").text(window.localStorage.getItem('username'));
});
var seconds = 0, minutes = 0, hours = 0, t;
$("#page_main").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var bookStatus = window.localStorage.getItem("bookStatus");
	if(bookStatus != null){
		$("#div_mp").css("height", ($(window).height()*0.86)+"px");
		if(bookStatus == "booked"){
			var location = window.localStorage.getItem("location");
			var latlng = window.localStorage.getItem("latlng");
			if(location != null && latlng != null){
				var parts = latlng.split(",");
				
				var myOptions = {
					zoom: 16,
					center:new google.maps.LatLng(parseFloat(parts[0]), parseFloat(parts[1])),
					maxZoom: 16,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
				};
				
				var map = new google.maps.Map(document.getElementById("mp"), myOptions);
				var ltlng = new google.maps.LatLng(parseFloat(parts[0]), parseFloat(parts[1]));
				//alert(ltlng);
				var marker = new google.maps.Marker({
					position: ltlng,
					map: map,
					title: "Customer",
					icon: "img/customer.png"
				});
				map.panTo(ltlng);
				$("#d_marker").attr("src", "img/greenmarker.png");
				$("#c_dtls").show();
				$("#btn_On").hide();
				$("#btn_Off").hide();
				$("#reached").text("ARRIVED");
				$("#reached").show();
				window.plugins.spinnerDialog.hide();
			}
		}else if(bookStatus == "onBoarded"){
			var location = window.localStorage.getItem("location");
			var latlng = window.localStorage.getItem("latlng");
			var parts = latlng.split(",");
			var myOptions = {
				zoom: 16,
				center:new google.maps.LatLng(parseFloat(parts[0]), parseFloat(parts[1])),
				maxZoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
			};
			var map = new google.maps.Map(document.getElementById("mp"), myOptions);
			var ltlng = new google.maps.LatLng(parseFloat(parts[0]), parseFloat(parts[1]));
			var marker = new google.maps.Marker({
				position: ltlng,
				map: map,
				title: "Customer",
				icon: "img/redmarker.png"
			});
			map.panTo(ltlng);
			$("#d_marker").attr("src", "img/redmarker.png");
			$("#c_dtls").show();
			$("#btn_On").hide();
			$("#btn_Off").hide();
			$("#reached").text("STOP");
			$("#reached").show();
			window.plugins.spinnerDialog.hide();
		}else if(bookStatus == "Arrived"){
			var location = window.localStorage.getItem("location");
			var latlng = window.localStorage.getItem("latlng");
			var parts = latlng.split(",");
			var myOptions = {
				zoom: 16,
				center:new google.maps.LatLng(parseFloat(parts[0]), parseFloat(parts[1])),
				maxZoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
			};
			var map = new google.maps.Map(document.getElementById("mp"), myOptions);
			var ltlng = new google.maps.LatLng(parseFloat(parts[0]), parseFloat(parts[1]));
			var marker = new google.maps.Marker({
				position: ltlng,
				map: map,
				title: "Customer",
				icon: "img/redmarker.png"
			});
			map.panTo(ltlng);
			//alert(ltlng);
			$("#d_marker").attr("src", "img/redmarker.png");
			$("#c_dtls").show();
			$("#btn_On").hide();
			$("#btn_Off").hide();
			$("#reached").text("START");
			$("#reached").show();
			window.plugins.spinnerDialog.hide();
		}else if(bookStatus == "cancelled"){
			window.plugins.spinnerDialog.hide();
			//window.plugins.toast.showLongBottom("Booking Cancelled!", "center",
				//function(a){console.log("toast success: "+a)}, 
				//function(err){console.log("toast error "+err)});
			navigator.notification.alert("Booking Cancelled!", function(){
				$.mobile.changePage("#page_myRideDtls", {transition:"slide", reverse:true});
			}, "", 'OK');	
		}else{
			window.plugins.spinnerDialog.hide();
			$.mobile.changePage("#page_myRideDtls", {transition:"slide", reverse:true});
		}
		if(window.sessionStorage.getItem("notification") != null){
			$("#regPop").popup().popup("open");
			$("#regPop").css("display", "block");
		}
	}else{
		$("#div_mp").css("height", ($(window).height()*0.86)+"px");
		var myOptions = {
			zoom: 16,
			maxZoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
		};
		
		var map = new google.maps.Map(document.getElementById("mp"), myOptions);
		$("#c_dtls").hide();
		$("#reached").hide();
		if(window.localStorage.getItem("vehicle_status") == "on"){
			$("#btn_On").hide();
			$("#btn_Off").show();
		}else{
			$("#btn_Off").hide();
			$("#btn_On").show();
		}
		if(navigator.geolocation){
			function onSuccess(position) {			
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
					map: map,
					title: "Driver Location"
				});
				map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
				navigator.geolocation.clearWatch(watchID);
				window.plugins.spinnerDialog.hide();
				if(window.sessionStorage.getItem("notification") != null){
					$("#regPop").popup().popup("open");
					$("#regPop").css("display", "block");
				}
			}
			function onError(error) {
				/*alert('code: '    + error.code    + '\n' +
					'message: ' + error.message + '\n');*/
				//window.plugins.spinnerDialog.hide();
			}
			var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 5000, enableHighAccuracy:true });
			
		}else{	
			// Add an overlay to the map of current lat/lng
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(17.4132, 78.5267),
				map: map,
				title: "Driver Location"
			});
			map.panTo(new google.maps.LatLng(17.4132, 78.5267));
			window.plugins.spinnerDialog.hide();
			if(window.sessionStorage.getItem("notification") != null){
				$("#regPop").popup().popup("open");
				$("#regPop").css("display", "block");
			}			
		}	
	}
	
	if ($("#c_dtls").is(':visible')){
		$("#rd_bokId").text("BID: "+window.localStorage.getItem("bookingID"));
		$("#p_cName").text(window.localStorage.getItem("cName"));
		$("#p_Mobile").text(window.localStorage.getItem("cMobile"));
		if(window.localStorage.getItem('cPic') != ""){
			$("#cst_pc").attr("src", "http://travel.crescom.in/"+window.localStorage.getItem("cPic"));
		}else{
			$("#cst_pc").attr("src", "img/user.png");
		}
		$("#c_dtls2 p").text(window.localStorage.getItem("location"));
	}
	//$('#dialog_vCode').popup().popup('open');
	//$("#regPop").popup().popup("open");
	//$("#regPop").css("display", "block");
});
$("#p_Mobile").on("click", function(){
	window.plugins.CallNumber.callNumber(onSuccess, onError, window.localStorage.getItem("cMobile"), true);
});
$("#navigate").on("click", function(){
	launchnavigator.isAppAvailable(launchnavigator.APP.GOOGLE_MAPS, function(isAvailable){
		var app;
		if(isAvailable){
			app = launchnavigator.APP.GOOGLE_MAPS;
		}else{
			console.warn("Google Maps not available - falling back to user selection");
			app = launchnavigator.APP.USER_SELECT;
		}
		launchnavigator.navigate(window.localStorage.getItem("latlng"), {
			app: app
		});
	});
});
function onSuccess(result){
  console.log("Success:"+result);
}

function onError(result) {
  console.log("Error:"+result);
}
function timer() {
    t = setTimeout(add, 1000);
}
function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    document.getElementById("rd_stpWatch").textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}
$("#Driver_switch").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		$.ajax({
			type: 'POST',
			url: server_url+"changeStatus.php",
			data:{
					driverID: window.localStorage.getItem('driverID'),
					status: $("#flip").val()
				},
			success: function(response) {
				//alert(response);
				if(response == "success"){
					if($("#flip").val() == "on"){
						//$("#flip").val('off').flipswitch("refresh");
						window.plugins.spinnerDialog.hide();
						window.localStorage.setItem("vehicle_status", "on");
						alert("Your are Online!");
						startFetchingLocation();
					}else{
						//$("#flip").val('on').flipswitch("refresh");
						window.plugins.spinnerDialog.hide();
						window.localStorage.setItem("vehicle_status", "off");
						alert("Your are Offline!");
					}
				}else{
					if($("#flip").val() == "on"){
						$("#flip").val('off').flipswitch("refresh");
						window.plugins.spinnerDialog.hide();
						alert(response);
					}else{
						$("#flip").val('on').flipswitch("refresh");
						window.plugins.spinnerDialog.hide();
						alert(response);
					}		
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
	}else{
		window.plugins.spinnerDialog.hide();
		alert("Check your internet connection, Try again.");
	}
});
function startFetchingLocation(){
	
	var callbackFn = function(location) {
		var lat = location.latitude;
		var lng = location.longitude;
		//alert(lat);
		var latlng = new google.maps.LatLng(lat, lng);
		var geocoder = geocoder = new google.maps.Geocoder();
		
		geocoder.geocode({ 'latLng': latlng }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					var location = results[1].formatted_address;
					$.ajax({
						type: 'POST',
						url: server_url+"saveDriverLocation.php",
						data:{
								driverID: window.localStorage.getItem('driverID'),
								location: results[1].formatted_address,
								lattitude: lat,
								longitude: lng
							},
						success: function(response) {
							//alert(response);
						},
						error: function(error){
							if(error.status == "0"){
								alert("Unable to connect server, Try again.");
							}else{
								alert("Something went wrong, Try again.");
							}
						}
					});
				}
			}
		});
    };
 
    var failureFn = function(error) {
        //alert('BackgroundGeolocation error');
    };
 
    // BackgroundGeolocation is highly configurable. See platform specific configuration options 
    backgroundGeolocation.configure(callbackFn, failureFn, {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        interval: 60000
    });
 
	backgroundGeolocation.isLocationEnabled(function (enabled) {
		if (enabled) {
			// Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app. 
			backgroundGeolocation.start();
		}else {
			// Location services are disabled 
			if (window.confirm('Location is disabled. Would you like to open location settings?')) {
				backgroundGeolocation.showLocationSettings();
			}	
		}
	});
}
function stopFetchingLocation(){
	backgroundGeolocation.finish();
}
$("#page_Cmnts").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	$("#list_Cmnts").empty();
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		$.ajax({
			type: 'POST',
			url: server_url+"getDriverComments.php",
			data:{
					driverID: window.localStorage.getItem('driverID')
					//driverID: "CBDR0001"
				},
			success: function(response) {
				//alert(response);
				var a = JSON.parse(response);
					
				if(a.length != 0){
					for(var i=0; i<a.length; i++){
						var data = '<li style="padding:5px;">';
						data += '<div id="div_cstimg">';
						data += '<img src="img/user.png" />';
						data += '</div>';
						data += '<div id="div_cstDtls">';
						data += '<h2>'+a[i].custName+'</h3>';
						data += '<p>'+a[i].comment+'</p>';
						data += '</div>';
						//data += '<img id="right" src="img/right.png" />';
						data += '</li>';
						
						$("#list_Cmnts").append(data);
					}
					window.plugins.spinnerDialog.hide();
				}else{
					$("#list_Cmnts").append("<li style='text-align:center;font-size:1em;padding:10px;'>No Records Found!</li>");
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
	}else{
		window.plugins.spinnerDialog.hide();
		alert("Check your internet connection, Try again.");
	}
});
var my_media = null;
var interval = null;
$("#page_cbReq").on("pageshow", function(){
	//alert("hello");
	my_media = new Media("http://travel.crescom.in/mb/dr/sounds/buzz.mp3",
        // success callback
        function() {
            console.log("playAudio():Audio Success");
        },
        // error callback
        function(err) {
            console.log("playAudio():Audio Error: "+err);
        }
    );

    // Play audio
    my_media.play();
	
	interval = setInterval(function(){ 
		my_media.play();
	}, 35000);
});

$("#btn_receive").on("click", function(){
	window.localStorage.removeItem("bookStatus");
	window.sessionStorage.clear();
	alert("Amount received");
	$.mobile.changePage("#page_main", {transition:"slide", reverse:true});
});