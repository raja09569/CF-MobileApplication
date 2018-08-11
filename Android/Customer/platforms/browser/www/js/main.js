var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //RegisterDevice();
    }
};
app.initialize();
function RegisterDevice(){
	var pushNotification = window.plugins.pushNotification;
	
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
	window.localStorage.setItem("deviceID", uuid);

}

function successHandler (result) {
  //alert('result = ' + result);
}
function errorHandler (error) {
  //alert('error = ' + error);
}

function onNotification(e) {
	//alert(e.event);
	switch( e.event ){
	case 'registered':
		if ( e.regid.length > 0 ){
			window.localStorage.setItem("regID", e.regid);
			var uname = window.localStorage.getItem("username");
			if(uname != null){
				$.ajax({
					type: 'POST',
					url: server_url+"update_regID.php",
					data:{
							custID: window.localStorage.getItem("custid"),
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
						//alert(error);
					}
				});
			}
		}
	break;
 
	case 'message':
		if ( e.foreground ){ 
			if(e.payload.type == "booking"){
				window.sessionStorage.setItem("From_Booking_Notificatioin", e.payload.response);
				if(e.payload.response == "Booked"){
					window.sessionStorage.setItem("BookingID", e.payload.bookingID);
					window.plugins.toast.showLongBottom("Your Ride Booked Successfully!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});
					if($.mobile.activePage.attr("id") == "pp_requesting"){
						$.mobile.changePage("#bookeddtlsPage", { transition: "fadeout", changeHash: false });
					}else{
						window.location = "cabs.html";
					}
				}else if(e.payload.response == "Arrive"){
					window.sessionStorage.setItem("BookingID", e.payload.bookingID);
					window.plugins.toast.showLongBottom("Driver Arrived!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});
					if($.mobile.activePage.attr("id") == "pp_requesting"){
						$.mobile.changePage("#bookeddtlsPage", { transition: "fadeout", changeHash: false });
					}else{
						window.location = "cabs.html";
					}
				}else if(e.payload.response == "Cancelled"){
					window.sessionStorage.setItem("BookingID", e.payload.bookingID);
					window.plugins.toast.showLongBottom("Your Ride Cancelled!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});
					if($.mobile.activePage.attr("id") == "pp_requesting"){
						$.mobile.changePage("#ride_completion", { transition: "fadeout", changeHash: false });
					}else{
						window.location = "cabs.html";
					}
				}else if(e.payload.response == "Started"){
					window.sessionStorage.setItem("BookingID", e.payload.bookingID);
					window.plugins.toast.showLongBottom("Your Ride Started!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});
					if($.mobile.activePage.attr("id") == "pp_requesting"){
						$.mobile.changePage("#bookeddtlsPage", { transition: "fadeout", changeHash: false });
					}else{
						window.location = "cabs.html";
					}
				}else if(e.payload.response == "Finished"){
					window.sessionStorage.setItem("BookingID", e.payload.bookingID);
					window.plugins.toast.showLongBottom("Your Ride Finished!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});
					if($.mobile.activePage.attr("id") == "pp_requesting"){
						$.mobile.changePage("#ride_completion", { transition: "fadeout", changeHash: false });
					}else{
						window.location = "cabs.html";
					}
				}
			}
		}else{  
			if( e.coldstart ){
				if(e.payload.type == "booking"){
					window.sessionStorage.setItem("From_Booking_Notificatioin", e.payload.response);
					window.sessionStorage.setItem("BookingID", e.payload.bookingID);
					if(e.payload.response == "Booked"){
						window.plugins.toast.showLongBottom("Your Ride Booked Successfully!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});						
						window.location = "cabs.html";
					}else if(e.payload.response == "Arrive"){
						window.plugins.toast.showLongBottom("Driver Arrived!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});				
						window.location = "cabs.html";
					}else if(e.payload.response == "Cancelled"){
						window.plugins.toast.showLongBottom("Driver Cancelled Ride!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});				
						window.location = "cabs.html";
					}else if(e.payload.response == "Started"){
						/*window.plugins.toast.showLongBottom("Your Ride Started!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});*/				
						window.location = "cabs.html";
					}else if(e.payload.response == "Finished"){
						window.plugins.toast.showLongBottom("Your Ride Finished!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});				
						window.location = "cabs.html";
					}
				}
			}else{
				if(e.payload.type == "booking"){
					window.sessionStorage.setItem("From_Booking_Notificatioin", e.payload.response);
					window.sessionStorage.setItem("BookingID", e.payload.bookingID);
					if(e.payload.response == "Booked"){
						window.plugins.toast.showLongBottom("Your Ride Booked Successfully!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});						
						window.location = "cabs.html";
					}else if(e.payload.response == "Arrive"){
						window.plugins.toast.showLongBottom("Driver Arrived!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});				
						window.location = "cabs.html";
					}else if(e.payload.response == "Cancelled"){
						window.plugins.toast.showLongBottom("Driver Cancelled Ride!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});				
						window.location = "cabs.html";
					}else if(e.payload.response == "Started"){
						window.plugins.toast.showLongBottom("Your Ride Started!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});				
						window.location = "cabs.html";
					}else if(e.payload.response == "Finished"){
						window.plugins.toast.showLongBottom("Your Ride Finished!", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});				
						window.location = "cabs.html";
					}
				}
			}
		}
	break;
 
	case 'error':
		//console.log('ERROR -> MSG:' + e.msg);
	break;
 
	default:
		//console.log('EVENT -> Unknown, an event was received and we do not know what it is');
	break;
	}
}