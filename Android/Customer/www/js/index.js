/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var wid, hght;
var app = {
    // Application Constructor
    initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		document.addEventListener("backbutton", backClick, false);

		$("#reg_mobile").intlTelInput({
		  initialCountry: "auto",
		  	geoIpLookup: function(callback) {
				$.get('http://ipinfo.io', function() {}, "jsonp").
					always(function(resp) {
			  		var countryCode = (resp && resp.country) ? resp.country : "";
			  		callback(countryCode);
			  		//alert(countryCode);
				});
		  	},
		  	utilsScript: "build/js/utils.js", // just for formatting/placeholders etc
			autoPlaceholder: true
		});
    },

    onDeviceReady: function() {
		//RegisterDevice();
		var uuid = device.uuid;
		if(uuid != null){
			if(uuid != ""){
				window.localStorage.setItem("deviceID", uuid);
			}
		}
        navigator.splashscreen.hide();
		
		if(window.sessionStorage.getItem("FROM_RIDE_COMPLETION") != null){
			if(window.sessionStorage.getItem("FROM_RIDE_COMPLETION") == "YES"){
				$.mobile.changePage("#bookings_listPage");
			}else{
				$.mobile.changePage("#main");
			}
		}else if(window.sessionStorage.getItem("toAdsPage") != null){
			if(window.sessionStorage.getItem("toAdsPage") === "edit"){
				window.sessionStorage.removeItem("toAdsPage");
				window.sessionStorage.removeItem("AdID");
				$.mobile.changePage("#page_myAds");
			}else if(window.sessionStorage.getItem("toAdsPage") === "yes"){
				window.sessionStorage.removeItem("toAdsPage");
				window.sessionStorage.removeItem("AdID");
				$.mobile.changePage("#page_myAds");
			}else{
				$.mobile.changePage("#main");
			}
		}else{
			$.mobile.changePage("#main");
		}
    }
};
app.initialize();
$("#main").on("pagebeforeshow", function(){
	
})
$("#main").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var loggedin = window.localStorage.getItem('loggedIn');
	if (loggedin == "yes") {
		var x = document.getElementById('logout_btn');
		x.style.display = 'block';
	} else {
		var x = document.getElementById('logout_btn');
		x.style.display = 'none';
	}
	var loggedin = window.localStorage.getItem('loggedIn');
	if (loggedin == "yes") {
		$("#before_login").css("display", "none");
		$("#after_login").css("display", "block");	
		var email = window.localStorage.getItem("username");
		var name = window.localStorage.getItem("name");
		$("#after_login p").text(name);
		$("#after_login span").text(email);
	} else {
		$("#after_login").css("display", "none");
		$("#before_login").css("display", "block");
	}
	var notification_status = window.localStorage.getItem("notification_status");
	if(notification_status == "on"){
		$(".toggle").addClass("toggle-on");
	}else{
		$(".toggle").removeClass("toggle-on");
	}
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {		
		$.ajax({
			type: 'POST',
			url: server_url+"getOfferSlides.php",
			data:{},
			success: function(response) {
				//alert(response);
				var a = JSON.parse(response);
				var no_of_slides = a[0].no_of_slides;
				$("#mySwipe .swipe-wrap").remove();
				if(a.length > 1){
					var data = "<div class='swipe-wrap'>";
					for(var i=1; i<a.length; i++){
						var imgName = a[i].name;
						var imgUrl = a[i].url;
						data += "<div><img src='"+ad_attachment_url+imgUrl+"' alt='"+imgName+"' /></div>";
					}
					data += "</div>";
					$("#mySwipe").append(data);
					
					// pure JS
					var elem = document.getElementById('mySwipe');
					window.mySwipe = Swipe(elem, {
					  startSlide: 0,
					  auto: 3000,
					  continuous: true,
					  disableScroll: true,
					  stopPropagation: true,
					  callback: function(index, element) {},
					  transitionEnd: function(index, element) {}
					});

					// with jQuery
					window.mySwipe = $('#mySwipe').Swipe().data('Swipe');
					window.plugins.spinnerDialog.hide();
				}else{
					window.plugins.spinnerDialog.hide();
				}
			},
			error: function(error){
				window.plugins.spinnerDialog.hide();
				if(error.status == "0"){
					showToast("Unable to connect server, Try again.");
				}else{
					showToast("Something went wrong, Try again.");
				}
			}
		});
	}else{
		window.plugins.spinnerDialog.hide();
	}
});

function backClick(){
	navigator.app.exitApp();
}

$("#movehome").on("click", function(){
	$.mobile.changePage("#main", { transition: "slide", reverse:false, changeHash: false });
});
$("#back_my_ads,#frm_myBookings,#frm_frgtPassword,#frm_Rigister,#frm_Login").on("click", function(){
	$.mobile.changePage("#main", { transition: "slide", reverse:true, changeHash: false });
});

$("#moveside, #frm_myAcount").on("click", function(){
	$.mobile.changePage("#side-menu", { transition: "slide", reverse:true, changeHash: false });
});

$("#cabs").click(function(){
	var loggedin = window.localStorage.getItem('loggedIn');
	if (loggedin == "yes") {
		window.location = 'cabs.html';
	} else {
		$.mobile.changePage('#login');
	}
});

$("#buses").click(function(){
	window.location = 'buses.html';
});

$("#hotels").click(function(){
	window.location = 'hotels.html';
});

$("#postAd").click(function(){
	window.location = 'ads.html';
});

$("#rateApp").click(function(){
	 AppRate.promptForRating(true);
});

$("#shareApp").click(function(){
	
	var options = {
		message: 'share this', // not supported on some apps (Facebook, Instagram)
		subject: 'the subject', // fi. for email
		files: ['https://play.google.com/store/apps/details?id=com.crescom.educom_teacher&hl=en', ''], // an array of filenames either locally or remotely
		url: 'https://play.google.com/store?hl=en',
		chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
	}

	var onSuccess = function (result) {
		console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
		console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
	}

	var onError = function (msg) {
		console.log("Sharing failed with message: " + msg);
	}
	
	window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
});


$("#sendFeedback").click(function(){
	
});

$("#aboutCF").click(function(){
	 $.mobile.changePage("#about_CF_page", { transition: "slide", changeHash: false });
});

$("#side-menu").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var link = "mailto:rajashekar.leesoft@gmail.com?subject=Feedback&body=Device "+device.model+"%0A App Version 1.0.0";
	$("#sendFeedback p").html("<a href='"+link+"' style='text-decoration:none;color:#999;font-size:.75em;'>Contact Us/Send Feedback</a>");
	
	AppRate.preferences = {
	  openStoreInApp: true,
	  displayAppName: 'CameounFacile.com',
	  usesUntilPrompt: 5,
	  promptAgainForEachNewVersion: false,
	  storeAppURL: {
		//ios: '<my_app_id>',
		android: 'market://details?id=com.leesoft.leecampus',
		//windows: 'ms-windows-store://pdp/?ProductId=<the apps Store ID>',
		//blackberry: 'appworld://content/[App Id]/',
		//windows8: 'ms-windows-store:Review?name=<the Package Family Name of the application>'
	  },
	  customLocale: {
		title: "Rate CameounFacile.com",
		message: "If you enjoy using CameounFacile.com, would you mind taking a moment to rate it? It won t take more than a minute. Thanks for your support!",
		cancelButtonLabel: "No, Thanks",
		laterButtonLabel: "",
		rateButtonLabel: "Rate It Now"
	  }
	};
	window.plugins.spinnerDialog.hide();
});

$("#my_bookings, .listitem #my_bookings").click(function(){
	var loggedin = window.localStorage.getItem('loggedIn');
	if (loggedin == "yes") {
		$.mobile.changePage("#bookings_listPage", { transition: "fade", changeHash: false });
	} else {
		$.mobile.changePage('#login');
	}
});

$("#my_ads").click(function(){
	//alert("hello");
	var loggedin = window.localStorage.getItem('loggedIn');
	if (loggedin == "yes") {
		$.mobile.changePage("#page_myAds", { transition: "fade", changeHash: false });
	} else {
		$.mobile.changePage('#login');
	}
});

$("#logout_btn, #li_mylOut").on("click", function(){
	window.localStorage.clear();
	var x = document.getElementById('logout_btn');
	x.style.display = 'none';
	$.mobile.changePage('#main', { reverse: false, transition: "flip" });

});

$("#before_login").on("click", function(){
	$.mobile.changePage("#login", { transition: "slide", reverse:false, changeHash: false });
});

$("#after_login").on("click", function(){
	$.mobile.changePage("#my_account", { transition: "slide", reverse:false, changeHash: false });
});

$(".back_about_CF_page").on("click", function(){
	if(window.sessionStorage.getItem("From_main") == "yes"){
		window.sessionStorage.removeItem("From_main");
		$.mobile.changePage("#main", { transition: "slide", reverse:true, changeHash: false });
	}else{
		$.mobile.changePage("#side-menu", { transition: "slide", reverse:true, changeHash: false });
	}
});

$("#rdMore_comp").on("click", function(){
	window.sessionStorage.setItem("From_main", "yes");
	$.mobile.changePage("#about_CF_page", { transition: "slide", reverse:false, changeHash: false });
});

$(document).on('click', '#btn_login', function () {
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	//alert(window.localStorage.getItem("deviceID"));
	var uname = $('#login_uname').val();
	var password = $('#login_pword').val();
	if (uname == "") {
		window.plugins.spinnerDialog.hide();
		alert("Enter user name");
		$('#login_uname').focus();
	} else if(password == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter password");
		$('#login_pword').focus();
	}else {
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {		
			$.ajax({
				type: 'POST',
				url: server_url+'login.php',
				data:{
						uname: uname,
						pword: password,
						regID: window.localStorage.getItem("regID"),
						deviceID: window.localStorage.getItem("deviceID")
					},
				success: function(response) {
					//window.plugins.spinnerDialog.hide();
					//alert(response);
					var a = JSON.parse(response);
					if (a[0].msg == 'success') {
						window.localStorage.setItem("loggedIn", "yes");
						window.localStorage.setItem("username", uname);
						window.localStorage.setItem("name", a[0].name);
						window.localStorage.setItem("custid", a[0].id);
						window.localStorage.setItem("photo", a[0].photo);
						window.localStorage.setItem("isd", a[0].isd);
						window.localStorage.setItem("phoneno", a[0].phoneno);
						window.localStorage.setItem("notification_status", a[0].notification_status);
						$('#login_uname').val("");
						$('#login_pword').val("");
						window.plugins.spinnerDialog.hide();
						$.mobile.changePage('#main');
					}else{
						window.plugins.spinnerDialog.hide();
						alert(a[0].msg);
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
			window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
					function(a){console.log("toast success: "+a)}, 
					function(err){console.log("toast error "+err)});
		}			
	}
});

$('.toggle').click(function(e){
  e.preventDefault(); // The flicker is a codepen thing
  //alert($(".toggle").is('.toggle-on'));
  var loggedin = window.localStorage.getItem('loggedIn');
	if (loggedin == "yes") {
		if($(".toggle").is('.toggle-on')){
			window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
			var networkState = navigator.connection.type;
			if (networkState !== Connection.NONE) {		
				$.ajax({
					url: server_url+"change_notification_status.php",			
					type: "post",
					data: {custID: window.localStorage.getItem("custid"), status:"off"},
					success: function(msg){
						//window.plugins.spinnerDialog.hide();
						//alert(msg);
						if(msg == "success"){
							//alert(msg);
							window.localStorage.setItem("notification_status", "off");
							$(".toggle").removeClass('toggle-on');
							window.plugins.spinnerDialog.hide();
						}else{
							alert(msg);
							window.plugins.spinnerDialog.hide();
						}
					},error:function(err){
						window.plugins.spinnerDialog.hide();
						//alert(err);
						if(err.status == "0"){
							alert("Unable to connect server, Try again.");
						}else{
							alert("Something went wrong, Try again.");
						}
					}
				});
			}else{
				window.plugins.spinnerDialog.hide();
				window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
			}
		}else{
			window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
			var networkState = navigator.connection.type;
			if (networkState !== Connection.NONE) {		
				$.ajax({
					url: server_url+"change_notification_status.php",			
					type: "post",
					data: {custID: window.localStorage.getItem("custid"), status:"on"},
					success: function(msg){
						//window.plugins.spinnerDialog.hide();
						//alert(msg);
						if(msg == "success"){
							//alert("yes");
							window.localStorage.setItem("notification_status", "on");
							$(".toggle").toggleClass('toggle-on');
							window.plugins.spinnerDialog.hide();
						}else{
							alert(msg);
							window.plugins.spinnerDialog.hide();
						}
					},error:function(err){
						window.plugins.spinnerDialog.hide();
						if(err.status == "0"){
							alert("Unable to connect server, Try again.");
						}else{
							alert("Something went wrong, Try again.");
						}
					}
				});
			}else{
				window.plugins.spinnerDialog.hide();
				window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
			}
		}
	} else {
		$.mobile.changePage('#login');
	}
});

$("#bookings_listPage").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {	
		$.ajax({
			url: server_url+"my_bookings.php",
			type: "post",
			data: {custID: window.localStorage.getItem("custid")},
			success: function(msg){
				//alert(msg);
				var a = JSON.parse(msg);
				$("#my_bookings_list").empty();
				if(a.length != 0){
					for(var i=0; i<a.length; i++){
						var startPlace = a[i].startPlace;
						var endplace = a[i].endplace;
						var date = a[i].date;
						var amount = a[i].amount;
						var driver_pic = a[i].driver_pic;
						var bookingID = a[i].bookingID;
						var status = a[i].status;
						var vehicle = a[i].vehicle;
						//alert(ad_attachment_url+driver_pic);
						var data = '<li><a onclick="BookingDetailsPage(&quot;'+status+'&quot;,&quot;'+bookingID+'&quot;)">';
						data += '<div id="dv1">';
						data += '<img src="img/cab.png" style="width:80%;" />';
						data += '</div>';
						data += '<div id="dv2">';
						data += '<h3>'+date+'</h3>';
						data += '<span>'+vehicle+', '+bookingID+'</span>';
						data += '<div id="frm_plc">';
						data += '<img src="img/round.png" />';
						data += '<p>'+startPlace+'</p>';
						data += '</div>';
						if(endplace != ""){
							data += '<div id="to_plc">';
							data += '<img src="img/round.png" />';
							data += '<p>'+endplace+'</p>';
							data += '</div>';	
						}
						data += '</div>';	
						data += '<div id="dv3">';
						data += '<h3>'+amount+'</h3>';
						if(status == "Booked"){
							data += '<span style="color:#0277BD;">'+status+'</span>';
						}else if(status == "Cancelled"){
							data += '<span style="color:#D84315;">'+status+'</span>';
						}else if(status == "Boarded"){
							data += '<span style="color:#EF6C00;">'+status+'</span>';
						}else{
							data += '<span style="color:#2E7D32;">'+status+'</span>';
						}
						data += '<img src="'+ad_attachment_url+driver_pic+'" />';
						data += '</div></a></li>';
						
						$("#my_bookings_list").append(data);
						window.plugins.spinnerDialog.hide();
					}
				}else{
					window.plugins.spinnerDialog.hide();
					$("#my_bookings_list").append("<li><center><span style='font-size:6vw;color:#999999;'>No Records Found!</span></center></li>")
				}
				
			},error:function(err){
				window.plugins.spinnerDialog.hide();
				//alert(err.message);
				if(err.status == "0"){
					alert("Unable to connect server, Try again.");
				}else{
					alert("Something went wrong, Try again.");
				}
			}
		});
	}else{
		window.plugins.spinnerDialog.hide();
		window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
				function(a){console.log("toast success: "+a)}, 
				function(err){console.log("toast error "+err)});
	}
});

function BookingDetailsPage(status, bookID){
	if(status == "Booked"){
		window.sessionStorage.setItem("BookingID", bookID);
		window.sessionStorage.setItem("From_My_bookings", "BOOK_DETAILS");
		window.location = "cabs.html";
	}else if(status == "Finished"){
		window.sessionStorage.setItem("BookingID", bookID);
		window.sessionStorage.setItem("From_My_bookings", "RIDE_COMPLETION");
		window.location = "cabs.html";
	}else if(status == "Boarded"){
		window.sessionStorage.setItem("BookingID", bookID);
		window.sessionStorage.setItem("From_My_bookings", "BOOK_DETAILS");
		window.location = "cabs.html";
	}else if(status == "Cancelled"){
		window.sessionStorage.setItem("BookingID", bookID);
		window.sessionStorage.setItem("From_My_bookings", "RIDE_COMPLETION");
		window.location = "cabs.html";
	}
}

$("#page_myAds").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {	
		$.ajax({
			url: server_url+"PostAd/my_ads.php",
			type: "post",
			data: {custID: window.localStorage.getItem("custid")},
			success: function(msg){
				//alert(msg);
				$("#list_myads").empty();
				var a = JSON.parse(msg);
				if(a.length != 0){
					for(var i=0; i<a.length; i++){
						var data = "<li style='padding:"+wid*1.56+"px;'>";
						data += "<div class='li_imgGrid'>";
						var photos = a[i].photos;
						if(photos.length > 1){
							for(var j=1; j<photos.length; j++){
								data += "<div>";
								data += "<img src='"+ad_attachment_url+photos[j].img+"' style='height:"+wid*19+"px;' />";
								data += "</div>";
							}
						}else{
							data += "<div>";
							data += "<img src='img/noimage.jpg' style='height:"+wid*19+"px;' />";
							data += "</div>";
						}
						data += "</div>";
						data += "<p style='margin:0;color:#666;font-size:"+wid*4.38+"px;font-family:Arial;";
						data += "padding-left:"+wid*1.56+"px;padding-right:"+wid*1.56+"px;'>";
						data += ""+a[i].heading+"</p>";
						data += "<span style='font-size:"+wid*3.4+"px;font-family:calibri;padding-left:"+wid*1.56+"px;'>";
						data += ""+a[i].location+"</span>";
						data += " | <span style='font-size:"+wid*3.4+"px;font-family:calibri;'>"+a[i].createdTime+"</span>";
						data += "<div>";
						data += "<p style='float:left;font-family:calibri;padding:"+wid*1.56+"px;margin:0px;'>"+a[i].price+"</p>";
						data += "<div style='float: right;text-align: right;' >";
						data += "<img src='img/view.png' onclick='ViewAd(&quot;"+a[i].ad_id+"&quot;)' style='width:18%;padding-left:2%;padding-right:2%;' />";
						data += "<img src='img/edit.png' onclick='EditAd(&quot;"+a[i].ad_id+"&quot;)' style='width:18%;padding-left:2%;padding-right:2%;' />";
						data += "<img src='img/delete.png' onclick='DeleteAd(&quot;"+a[i].ad_id+"&quot;)' style='width:18%;padding-left:2%;padding-right:2%;' />";
						data += "</div>";
						data += "</div>";
						data += "<div style='clear:both;'></div>";
						data += "</li>";
						
						$("#list_myads").append(data);
						$("#list_myads").listview("refresh");
					}
					window.plugins.spinnerDialog.hide();
				}else{	
					window.plugins.spinnerDialog.hide();
					var data = "<li style='padding:20px;text-align:center;font-size:1.1em;'>No ads Found!</li>";
					$("#list_myads").append(data);
				}
			},error:function(err){
				window.plugins.spinnerDialog.hide();
				if(err.status == "0"){
					alert("Unable to connect server, Try again.");
				}else{
					alert("Something went wrong, Try again.");
				}
			}
		});
	}else{
		window.plugins.spinnerDialog.hide();
		window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
				function(a){console.log("toast success: "+a)}, 
				function(err){console.log("toast error "+err)});
	}
});

function ViewAd(adID){
	window.sessionStorage.setItem("AdID", adID);
	window.sessionStorage.setItem("toAdsPage", "yes");
	window.location = 'ads.html';
}

function EditAd(adID){
	window.sessionStorage.setItem("AdID", adID);
	window.sessionStorage.setItem("toAdsPage", "edit");
	window.location = 'ads.html';
}

function DeleteAd(adID){
	navigator.notification.confirm(
		'Are you sure? You want to delete this Ad?', // message
		 function(){
			if(buttonIndex == 1){
				window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
				var networkState = navigator.connection.type;
				if (networkState !== Connection.NONE) {	
					$.ajax({
						url: server_url+"PostAd/deleteAd.php",
						type: "post",
						data: {adID: adID},
						success: function(msg){
							if(msg == "success"){
								window.plugins.spinnerDialog.hide();
								alert("Ad Deleted Successfully!");
							}else{
								window.plugins.spinnerDialog.hide();
								alert(msg);
							}
						},error:function(err){
							window.plugins.spinnerDialog.hide();
							if(err.status == "0"){
								alert("Unable to connect server, Try again.");
							}else{
								alert("Something went wrong, Try again.");
							}
						}
					});
				}else{
					window.plugins.spinnerDialog.hide();
					window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
							function(a){console.log("toast success: "+a)}, 
							function(err){console.log("toast error "+err)});
				}
			} 
		 },            // callback to invoke with index of button pressed
		'Confirmation',           // title
		['YES','NO']     // buttonLabels
	);
}

$("#btn_register").on('click', function () {
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var fname = $('#reg_fname').val();
	var lname = $('#reg_lname').val();
	var email = $('#reg_email').val();
	var mobile = $('#reg_mobile').val();
	var pword = $('#reg_pword').val();
	var repword = $('#reg_repword').val();
	var atpos = email.indexOf("@");
	var dotpos = email.lastIndexOf(".");
	//alert($("#reg_mobile").intlTelInput("getNumber"));
	if (fname == "") {
		window.plugins.spinnerDialog.hide();
		alert("Enter First Name");
		$('#reg_fname').focus();
	} else if (!/^[a-zA-Z]*$/g.test(fname)) {
		window.plugins.spinnerDialog.hide();
		alert("You cannot enter numeric values or white spaces in First Name");
		$('#reg_fname').focus();
	} else if(lname == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Last Name");
		$('#reg_lname').focus();
	} else if (!/^[a-zA-Z]*$/g.test(lname)) {
		window.plugins.spinnerDialog.hide();
		alert("You cannot enter numeric values or white spaces in Last Name");
		$('#reg_lname').focus();
	} else if(email == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter EmailID");
		$('#reg_email').focus();
	} else if(atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
		window.plugins.spinnerDialog.hide();
		alert("Not a valid e-mail address");
		$('#reg_email').focus();
	} else if(mobile == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Mobile Number");
		$('#reg_mobile').focus();
	} else if ($("#reg_mobile").intlTelInput("isValidNumber") == false) {
		window.plugins.spinnerDialog.hide();
		alert("Mobile number not valid");
		$('#reg_mobile').focus();
	} else if(pword == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Password");
		$('#reg_pword').focus();
	} else if(repword == ""){
		window.plugins.spinnerDialog.hide();
		alert("Repeat Password");
		$('#reg_repword').focus();
	} else if(pword != repword){
		window.plugins.spinnerDialog.hide();
		alert("Passwords shoud match!");
		$('#reg_repword').focus();
	} else if($("#verify").is(":visible")){
		window.plugins.spinnerDialog.hide();
		alert("Mobile Number Not Verified!");
		$('#reg_mobile').focus();
	} else {
		var countryData = $("#reg_mobile").intlTelInput("getSelectedCountryData");
		var country = countryData['name'];
		country = country.split(" ");
		country = country[0];		
		//alert(country);
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {		
			$.post(server_url+'register.php',{
				fname: fname,
				lname: lname,
				email: email,
				isd: countryData["dialCode"],
				mobile: mobile,
				country: country,
				pword: pword,
				repword: repword,
				deviceID:device.uuid
			}, function (responce, status) {
				if(status == "success"){					
					var a = JSON.parse(responce);
					if (a[0].msg == 'success') {
						$("#otpForm").hide();
						$("#registrationform").show();
						$('#reg_fname').val("");
						$('#reg_lname').val("");
						$('#reg_email').val("");
						$('#reg_mobile').val("");
						$('#reg_pword').val("");
						$('#reg_repword').val("");
						$("#verified").hide();
						$("#verify").show();
						window.plugins.spinnerDialog.hide();
						window.plugins.toast.showLongBottom("Registration Successfull!", "center",function(a){console.log("toast success: "+a)}, function(err){console.log("toast error "+err)});
						$.mobile.changePage('#login');
					}else{
						window.plugins.spinnerDialog.hide();
						alert(a[0].msg);
					}
				}else{
					window.plugins.spinnerDialog.hide();
					alert("Something went wrong, Try again.");
				}
			});
		}else{
			window.plugins.spinnerDialog.hide();
			window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
					function(a){console.log("toast success: "+a)}, 
					function(err){console.log("toast error "+err)});
		}
	}
});

$("#verify, #btn_resendOTP").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var mobile = $('#reg_mobile').val();
	if(mobile == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Mobile Number");
	} else if ($("#reg_mobile").intlTelInput("isValidNumber") == false) {
		window.plugins.spinnerDialog.hide();
		alert("Mobile number not valid");
	}else{
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {		
			$.ajax({
				type: 'POST',
				url: server_url+"sendOTP.php",
				data:{
						mobile: mobile
					},
				success: function(response) {
					if (response == 'success') {
						window.plugins.spinnerDialog.hide();
						$("#hdn_mobNumber").text($('#reg_mobile').val());
						$("#registrationform").hide();
						$("#otpForm").show();
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
			window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
					function(a){console.log("toast success: "+a)}, 
					function(err){console.log("toast error "+err)});
		}
	}
});

$("#btn_verifyOTP").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var otp = $("#verificationNumber").val();
	if(otp == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Verification Number");
	}else{
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {		
			$.ajax({
				type: 'POST',
				url: server_url+"verifyOTP.php",
				data:{
						mobile: $("#hdn_mobNumber").text(),
						otp: otp
					},
				success: function(response) {
					if (response == 'success') {
						$("#verificationNumber").val("");
						window.plugins.spinnerDialog.hide();
						$("#verify").hide();
						$("#verified").show();
						$("#otpForm").hide();
						$("#registrationform").show();
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
			window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
					function(a){console.log("toast success: "+a)}, 
					function(err){console.log("toast error "+err)});
		}
	}
});

$("#btn_sendMail").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var email = $("#f_email").val();
	if(email == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter EmailID");
	}else{
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {		
			$.ajax({
				type: 'POST',
				url: server_url+"forgotPassword.php",
				data:{
						email: email
					},
				success: function(response) {
					window.plugins.spinnerDialog.hide();
					alert(response);
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
			window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
					function(a){console.log("toast success: "+a)}, 
					function(err){console.log("toast error "+err)});
		}
	}
});

$("#my_account").on("pageshow", function(){
	
});

$("#frm_chPwrd").on("click", function(){
	$.mobile.changePage("#my_profile", { transition: "slide", reverse:true, changeHash: false });
});

$("#li_uCpwrd").on("click", function(){
	$.mobile.changePage("#chnge_Pword", { transition: "slide", reverse:false, changeHash: false });
});

$("#top_div2").on("click", function(){
	$('#dialogPage').dialog({ position: 'center' });
	$.mobile.changePage("#dialogPage", { role: "dialog" } );
});

$("#cncl_dialog").on("click", function(){
	//$( "#dialogPage" ).dialog( "close" );
	$.mobile.changePage("#my_profile", { transition: "pop", reverse:false, changeHash: false });
});

$("#bck_myProf").on("click", function(){
	$.mobile.changePage("#my_account", { transition: "slide", reverse:true, changeHash: false });
});

$("#li_myProf").on("click", function(){
	$.mobile.changePage("#my_profile", { transition: "slide", reverse:false, changeHash: false });
});

$("#li_myBook").on("click", function(){
	$.mobile.changePage("#bookings_listPage", { transition: "slide", reverse:false, changeHash: false });
});

$("#my_account").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var email = window.localStorage.getItem("username");
	var name = window.localStorage.getItem("name");
	var photo = window.localStorage.getItem("photo");
	
	$("#user_name").text(name);
	$("#user_email").text(email);
	if(photo == ""){
		window.plugins.spinnerDialog.hide();
		$("#user_pic").attr("src", "img/profile_white_50.png");
	}else{
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {
			window.plugins.spinnerDialog.hide();
			$("#user_pic").attr("src", photo);
		}else{
			$("#user_pic").attr("src", "img/profile_white_50.png");
			window.plugins.spinnerDialog.hide();
		}
	}
});

$("#my_profile").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	$("#et_mobile").intlTelInput({
	  	utilsScript: "build/js/utils.js",
		autoPlaceholder: true
	});
	var email = window.localStorage.getItem("username");
	var name = window.localStorage.getItem("name");
	var photo = window.localStorage.getItem("photo");
	var phoneno = window.localStorage.getItem("phoneno");
	name = name.split(" ");
	$("#et_fname").val(name[0]);
	$("#et_lname").val(name[1]);
	$("#et_uEmail").val(email);
	$("#et_mobile").intlTelInput("setNumber", "+"+window.localStorage.getItem('isd')
		+" "+phoneno);
	if(photo == ""){
		window.plugins.spinnerDialog.hide();
		$("#user_profPic").attr("src", "img/user_upload.png");
	}else{
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {	
			window.plugins.spinnerDialog.hide();	
			$("#user_profPic").attr("src", photo);
		}else{
			window.plugins.spinnerDialog.hide();
			$("#user_profPic").attr("src", "img/user_upload.png");
		}
	}
});

$("#btn_updtProf").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var fname = $("#et_fname").val();
	var lname = $("#et_lname").val();
	var email = $("#et_uEmail").val();
	var mobile = $("#et_mobile").val();
	var mob = /^[1-9]{1}[0-9]{9}$/;
	if (fname == "") {
		window.plugins.spinnerDialog.hide();
		alert("Enter First Name");
	} else if (!/^[a-zA-Z]*$/g.test(fname)) {
		window.plugins.spinnerDialog.hide();window.plugins.spinnerDialog.hide();
		alert("You cannot enter numeric values or white spaces in First Name");
	} else if(lname == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Last Name");
	} else if (!/^[a-zA-Z]*$/g.test(lname)) {
		window.plugins.spinnerDialog.hide();
		alert("You cannot enter numeric values or white spaces in Last Name");
	} else if(mobile == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter Mobile Number");
	} else if (mob.test(mobile) == false) {
		window.plugins.spinnerDialog.hide();
		alert("Mobile number not valid");
	}else{
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {		
			$.ajax({
				url: server_url+"update_userProfile.php",
				type: "post",
				data:{
						custID:window.localStorage.getItem("custid"),
						fname:fname,
						lname: lname,
						mobile:mobile
					},
				success: function(msg){
					if(msg == "Your profile updated successfully!"){
						alert(msg);
						window.plugins.spinnerDialog.hide();
						$.mobile.changePage('#my_account', { reverse: false, transition: "fade" });
					}else{
						window.plugins.spinnerDialog.hide();
						alert(msg);
					}
				},error:function(err){
					window.plugins.spinnerDialog.hide();
					//alert(err.message);
					if(err.status == "0"){
						alert("Unable to connect server, Try again.");
					}else{
						alert("Something went wrong, Try again.");
					}
				}
			});
		}else{
			window.plugins.spinnerDialog.hide();
			window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
					function(a){console.log("toast success: "+a)}, 
					function(err){console.log("toast error "+err)});
		}
	}
	
});
$("#btn_cPword").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var oldPword = $("#et_ucPword").val();
	var newPword = $("#et_unPword").val();
	var rePword = $("#et_urPword").val();
	if(oldPword == ""){
		window.plugins.spinnerDialog.hide();
		alert("You should enter your Old Password");
	}else if(newPword == ""){
		window.plugins.spinnerDialog.hide();
		alert("Enter New Password");
	}else if(rePword == ""){
		window.plugins.spinnerDialog.hide();
		alert("Repeat New Password");
	}else if(newPword != rePword){
		window.plugins.spinnerDialog.hide();
		alert("New and Repeat Passwords should Match!");
	}else{		
		var networkState = navigator.connection.type;
		if (networkState !== Connection.NONE) {		
			$.ajax({
				url: server_url+"update_userPassword.php",
				type: "post",
				data:{
						custID: window.localStorage.getItem("custid"),
						oldPword:oldPword,
						newPword:newPword
					},
				success: function(msg){
				
					if(msg == "Your Password updated successfully!"){
						$("#et_ucPword").val("");
						$("#et_unPword").val("");
						$("#et_urPword").val("");
						window.localStorage.clear();
						var x = document.getElementById('logout_btn');
						x.style.display = 'none';
						window.plugins.spinnerDialog.hide();
						alert(msg);
						$.mobile.changePage('#login', { reverse: false, transition: "fade" });
					}else{
						window.plugins.spinnerDialog.hide();
						alert(msg);
					}
					
				},error:function(err){
					window.plugins.spinnerDialog.hide();
					//alert(err.message);
					if(err.status == "0"){
						alert("Unable to connect server, Try again.");
					}else{
						alert("Something went wrong, Try again.");
					}
				}
			});
		}else{
			window.plugins.spinnerDialog.hide();
			window.plugins.toast.showLongBottom("Check your internet connection, Try again.", "center",
					function(a){console.log("toast success: "+a)}, 
					function(err){console.log("toast error "+err)});
		}
	}
});
$("#openCamera").on("click", function(){
	var imgPath;
	navigator.camera.getPicture(function (imgData) {
		imgPath = imgData;
		uploadImage(imgPath);
	}, function (error) {
		alert(error);
	}, {
		quality: 90,
		destinationType: Camera.DestinationType.FILE_URI,
		correctOrientation: true
	});
});
$("#openFileManager").on("click", function(){
	var imgPath;
	navigator.camera.getPicture(
		function (imgData) {
			
			imgPath = imgData;
			uploadImage(imgPath);
			
		}, function (error) {
			alert(error);
		},
		{
			quality: 50,
			destinationType: navigator.camera.DestinationType.FILE_URI,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
			allowEdit: false,
			correctOrientation: true,
			saveToPhotoAlbum: false
		}
	);
});
function uploadImage(imgPath) {
	
	var url=encodeURI(server_url+"upload_profPic.php");

    var params = new Object();
    params.value = "something";  //you can send additional info with the file

    var options = new FileUploadOptions();
    options.fileKey = "file"; //depends on the api
    options.fileName = imgPath.substr(imgPath.lastIndexOf('/')+1);
    options.mimeType = "image/jpeg";
    options.params = params;
    options.chunkedMode = true; //this is important to send both data and files

    var ft = new FileTransfer();
    ft.upload(imgPath, url, function(responce){
		//alert("Code = " + r.responseCode);
		//alert("Bytes Sent = " + r.bytesSent);
		//alert("Audio Uploaded");
	}, function(err){
		//alert(err.code);
	}, options);

};