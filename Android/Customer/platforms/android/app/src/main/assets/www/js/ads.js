var wid, hght;
var countryCode;
var images = [];
$(function() {
	
	document.addEventListener('deviceready', onDeviceReady, false);
	document.addEventListener("backbutton", backClick, false);
	
	wid = $(window).width()/100;
	hght = $(window).height()/100;
	
	/*$(".title").css("font-size", wid*4.3+"px");  //14px
	if(Math.round(window.devicePixelRatio) == 0.75) {
		$(".back-icon").attr('src', '../www/img/ldpi/back.png'); 
		$(".app-icon").attr('src', '../www/img/ldpi/logo.png');  
		$(".search-icon").attr('src', '../www/img/ldpi/search.png'); 
	}else if(Math.round(window.devicePixelRatio) == 1) {
		$(".back-icon").attr('src', '../www/img/mdpi/back.png');
		$(".app-icon").attr('src', '../www/img/mdpi/logo.png'); 
		$(".search-icon").attr('src', '../www/img/mdpi/search.png');  
	}else if(Math.round(window.devicePixelRatio) == 1.5) {
		$(".back-icon").attr('src', '../www/img/hdpi/back.png');
		$(".app-icon").attr('src', '../www/img/hdpi/logo.png'); 
		$(".search-icon").attr('src', '../www/img/hdpi/search.png');  
	}else if(Math.round(window.devicePixelRatio) == 2) {
		$(".back-icon").attr('src', '../www/img/xhdpi/back.png');
		$(".app-icon").attr('src', '../www/img/xhdpi/logo.png'); 
		$(".search-icon").attr('src', '../www/img/xhdpi/search.png');
	}else{
		$(".back-icon").attr('src', '../www/img/xxhdpi/back.png');
		$(".app-icon").attr('src', '../www/img/xxhdpi/logo.png'); 
		$(".search-icon").attr('src', '../www/img/xxhdpi/search.png');
	}*/
	//alert($(window).width());
	//$("#btn_adPost .content").css("font-size", wid*5.6+"px"); //20px
	$("#btn_adPost").css("width", $(window).width()*0.22+"px");
	$("#btn_adPost").css("height", $(window).width()*0.22+"px");
	$("#btn_adPost").css("line-height", $(window).width()*0.22+"px");
	$("#phone_no").css("width", $(window).width()*0.92+"px"); //250px
	$("#upldPrgrs").on({
		popupbeforeposition: function () {
			$('.ui-popup-screen').off();
		}
	});
	
});
function onDeviceReady(){
	if(window.sessionStorage.getItem("toAdsPage") != null){
		if(window.sessionStorage.getItem("toAdsPage") === "yes"){
			adDetails(window.sessionStorage.getItem("AdID"));
		}else if(window.sessionStorage.getItem("toAdsPage") === "edit"){
			$.mobile.changePage("#page_postAd", {transition:"fade"});
		}else{
			$.mobile.changePage("#main", { transition: "fade"});
		}
	}else{
		$.mobile.changePage("#main", { transition: "fade"});
	}	
	document.addEventListener( 'pause', onPause, false );
	document.addEventListener( 'resume', onResume, false );
}
function onPause(){
	
}
function onResume(){
	
}
function backClick(){
	window.location = 'index.html';
}

$("#main").on("pageshow", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);			
	$.ajax({
		url: server_url+"PostAd/get_categories.php",
		data:{},
		type: "POST",
		success: function(msg){
			//alert(msg);
			$("#div_categories").empty();
			$("#div_categories").css("display", "none");
			$("#div-no-categories").css("display", "none");
			var a = JSON.parse(msg);
			if(a.length != 0){
				$("#div_categories").css("display", "block");
				for(var i=0; i<a.length; i++){
					var data = "<div class='div-catItem' onclick='opensubCat(&quot;"+a[i].categoryID+"&quot;)'  >";
					data += "<div>";
					data += "<img src='"+ad_category_icon_url+a[i].icon+"'  />";
					data += "<p >"+a[i].name+"</p>";
					data += "</div>";
					data += "</div>";
					
					$("#div_categories").append(data);
				}
			}else{
				$("#div-no-categories").css("display", "block");
			}
		},
		error: function(error){
			if(error.status == "0"){
				alert("Unable to connect server, Try again.");
			}else{
				alert("Something went wrong, Try again.");
			}
		}
	});
	
	$.ajax({
		url: server_url+"PostAd/get_latest_ads.php",
		data:{},
		type: "POST",
		success: function(msg){
			//alert(msg);
			$("#latestAds").empty();
			var a = JSON.parse(msg);
			if(a.length != 0){
				for(var i=0; i<a.length; i++){		
					var data = "<li style=''>";
					data += "<div class='li_imgGrid'>";
					var photos = a[i].photos;
					if(photos.length > 1){
						for(var j=1; j<photos.length; j++){
							//alert(ad_attachment_url+photos[j].img);
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
					data += "<p style='margin:0;color:#666;font-size:"+wid*4.38+"px;font-weight:bold;'>";
					data += ""+a[i].heading+"</p>";
					data += "<span style='font-size:"+wid*3.4+"px;'>";
					data += ""+a[i].location+"</span>";
					data += " | <span style='font-size:"+wid*3.4+"px;'>"+a[i].createdTime+"</span>";
					data += "<div>";
					data += "<p style='float:left;padding:"+wid*1.56+"px;margin:0px;'>"+a[i].price+"</p>";
					data += "<p onclick='adDetails(&quot;"+a[i].ad_id+"&quot;)' style='width:"+wid*15.6+"px;text-align:center;float:right;";
					data += "padding:"+wid*1+"px;border:1px solid #007960;color:#007960;font-size:"+wid*3.75+"px;margin:0px;border-radius:5px;'>";
					data += "VIEW</p>";
					data += "</div>";
					data += "<div style='clear:both;'></div>";
					data += "</li>";
					$("#latestAds").append(data);
					$("#latestAds").listview("refresh");
				}
				window.plugins.spinnerDialog.hide();
			}else{
				window.plugins.spinnerDialog.hide();
				var data = "<li style='padding:5px;text-align:center;'>No ads Found!</li>";
				$("#latestAds").append(data);
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
});
$("#btn_adPost").on("click", function(){
	$.mobile.changePage("#page_postAd", {transition:"slide"});
});
$("#frm_subCat").on("click", function(){
	$.mobile.changePage("#main", {transition:"slide", reverse:"true"});
});
$("#back_postAd").on("click", function(){
	if(window.sessionStorage.getItem("toAdsPage") != null){
		if(window.sessionStorage.getItem("toAdsPage") === "edit"){
			window.location = "index.html";
		}else{
			$.mobile.changePage("#main", {transition:"slide", reverse:"true"});
		}
	}else{
		$.mobile.changePage("#main", {transition:"slide", reverse:"true"});
	}
});
$("#page_postAd").on("pageinit", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	$("#phone_no").intlTelInput({
	  initialCountry: "auto",
	  geoIpLookup: function(callback) {
		$.get('http://ipinfo.io', function() {}, "jsonp").always(function(resp) {
		  countryCode = (resp && resp.country) ? resp.country : "";
		  callback(countryCode);
		  //alert(countryCode);
		});
	  },
	  utilsScript: "build/js/utils.js" // just for formatting/placeholders etc
	});
	
	$("#phone_no").on("countrychange", function(e, countryData) {
	    countryCode = countryData.iso2;
		countryCode = countryCode.toUpperCase();
		var options = {
		  types: ['(cities)'],
		  componentRestrictions: {country: countryCode}
		};
		$("#location").val("");
		$("#territory").val("");
		$("#country").val("");
		
		var input = document.getElementById('location');
		var autocomplete = new google.maps.places.Autocomplete(input, options);
		autocomplete.addListener('place_changed', function(){
			var result = autocomplete.getPlace();
			
			for(var i = 0; i < result.address_components.length; i += 1) {
			  var addressObj = result.address_components[i];
			  for(var j = 0; j < addressObj.types.length; j += 1) {
				if(addressObj.types[j] === 'locality') {
				  $("#location").val(addressObj.long_name); // confirm that this is the country name
				}
				if(addressObj.types[j] === 'administrative_area_level_1') {
				  $("#territory").val(addressObj.long_name); // confirm that this is the country name
				}
				if(addressObj.types[j] === 'country') {
				  $("#country").val(addressObj.long_name); // confirm that this is the country name
				}				
				
			  }
			}
		});	
	});
	
	if(window.sessionStorage.getItem("AdID") != null){
		$("#btn_sbmitAd").hide();
		$("#btn_updtAd").show();
		$.ajax({
			url: server_url+"PostAd/get_adDetails.php",
			data:{adID: window.sessionStorage.getItem("AdID")},
			type: "POST",
			success: function(msg){
				//alert(msg);
				var a = JSON.parse(msg);
				$.ajax({
					url: server_url+"PostAd/get_categories.php",
					data:{},
					type: "POST",
					success: function(msg){
						$("#slct_ctgies").empty();
						var a = JSON.parse(msg);
						if(a.length != 0){
							$("#slct_ctgies").append("<option value='0' disabled >Select Category</option>");
							for(var i=0; i<a.length; i++){
								if(a.category == a[i].categoryID){
									var data = "<option value='"+a[i].categoryID+"' selected>"+a[i].name+"</option>";
								}else{
									var data = "<option value='"+a[i].categoryID+"'>"+a[i].name+"</option>";
								}
								$("#slct_ctgies").append(data);
							}
						}else{
							var data = "<option value='0' selected disabled>No Categories Found!</option>";
							$("#slct_ctgies").append(data);	
						}
					},
					error: function(error){	
						if(error.status == "0"){
							alert("Unable to connect server, Try again.");
						}else{
							alert("Something went wrong, Try again.");
						}
					}
				});
				$.ajax({
					url: server_url+"PostAd/get_subcategories.php",
					data:{categoryID: a.category},
					type: "POST",
					success: function(msg){
						$("#slct_sbctgies").empty();
						var a = JSON.parse(msg);
						if(a.length != 0){
							$("#slct_sbctgies").append("<option value='0' selected disabled >Select Category</option>");
							for(var i=0; i<a.length; i++){
								if(a.subcategory == a[i].subcategoryID){
									var data = "<option value='"+a[i].subcategoryID+"' selected>"+a[i].name+"</option>";
								}else{
									var data = "<option value='"+a[i].subcategoryID+"'>"+a[i].name+"</option>";
								}
								$("#slct_sbctgies").append(data);
							}
						}else{
							var data = "<option value='0' selected disabled>No Sub Categories Found!</option>";
							$("#slct_sbctgies").append(data);	
						}
					},
					error: function(error){	
						if(error.status == "0"){
							alert("Unable to connect server, Try again.");
						}else{
							alert("Something went wrong, Try again.");
						}
					}
				});
				
				
				$("#ad_heading").val(a.heading);
				$("#productDtls").text(a.product_dtls);
				$("#usrName").val(a.name);
				$("#email_id").val(a.email_id);
				$("#phone_no").val(a.mobile_number);
				$("#address1").val(a.address1);
				$("#address2").val(a.address2);
				$("#location").val(a.location);
				$("#territory").val(a.territory);
				$("#country").val(a.country);
				$("#cmpnyName").val(a.company_name);
				$("#cmpnyProfile").text(a.comp_profile);
				
				var imgs = a.photos;
				if(imgs.length > 1){
					$('.preview-area').empty();
					for(var i=1; i<imgs.length; i++){
						var imgUrl = ad_attachment_url+imgs[i].img;
						images.push(imgUrl);
						var data = '<div class="img-wrap" data-id="'+imgUrl+'" style="padding:'+wid*0.6+'px;">';
						data += '<span class="close" onclick="removeImg(&quot;'+imgUrl+'&quot;)">&times;</span>';
						data += '<img src="'+imgUrl+'" style="height:'+$(window).width()*0.28+'px;" />';
						data += '</div>';
						$('.preview-area').append(data);
					}
				}
				window.plugins.spinnerDialog.hide();
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
		$("#btn_updtAd").hide();		
		$("#btn_sbmitAd").show();
		$('#slct_sbctgies').prop('disabled', 'disabled');
		$.ajax({
			url: server_url+"PostAd/get_categories.php",
			data:{},
			type: "POST",
			success: function(msg){
				$("#slct_ctgies").empty();
				var a = JSON.parse(msg);
				if(a.length != 0){
					$("#slct_ctgies").append("<option value='0' selected disabled >Select Category</option>");
					for(var i=0; i<a.length; i++){
						var data = "<option value='"+a[i].categoryID+"'>"+a[i].name+"</option>";
						$("#slct_ctgies").append(data);
					}
					window.plugins.spinnerDialog.hide();	
				}else{
					var data = "<option value='0' selected disabled>No Categories Found!</option>";
					$("#slct_ctgies").append(data);
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
		/*$("#slct_ctgies").on("change", function(){
			window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
			var catID = $("#slct_ctgies").val();
			$.ajax({
				url: server_url+"PostAd/get_subcategories.php",
				data:{categoryID: catID},
				type: "POST",
				success: function(msg){
					$("#slct_sbctgies").empty();
					var a = JSON.parse(msg);
					if(a.length != 0){
						$("#slct_sbctgies").append("<option value='0' selected disabled >Select Category</option>");
						for(var i=0; i<a.length; i++){
							var data = "<option value='"+a[i].subcategoryID+"'>"+a[i].name+"</option>";
							$("#slct_sbctgies").append(data);
							window.plugins.spinnerDialog.hide();	
						}
					}else{
						var data = "<option value='0' selected disabled>No Sub Categories Found!</option>";
						$("#slct_sbctgies").append(data);
						window.plugins.spinnerDialog.hide();	
					}
					$('#slct_sbctgies').prop('disabled', false);
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
		});*/
	}
});

$("#slct_ctgies").on("change", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var catID = $("#slct_ctgies").val();
	$.ajax({
		url: server_url+"PostAd/get_subcategories.php",
		data:{categoryID: catID},
		type: "POST",
		success: function(msg){
			$("#slct_sbctgies").empty();
			var a = JSON.parse(msg);
			if(a.length != 0){
				$("#slct_sbctgies").append("<option value='0' selected disabled >Select Category</option>");
				for(var i=0; i<a.length; i++){
					var data = "<option value='"+a[i].subcategoryID+"'>"+a[i].name+"</option>";
					$("#slct_sbctgies").append(data);
					window.plugins.spinnerDialog.hide();	
				}
			}else{
				var data = "<option value='0' selected disabled>No Sub Categories Found!</option>";
				$("#slct_sbctgies").append(data);
				window.plugins.spinnerDialog.hide();	
			}
			$('#slct_sbctgies').prop('disabled', false);
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
});

$("#btn_sbmitAd").on("click", function(){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var categoryID = $("#slct_ctgies option:selected").val();
	var subcategoryID = $("#slct_sbctgies option:selected").val();
	var name = $("#usrName").val();
	var cmpnyName = $("#cmpnyName").val();
	var address1 = $("#address1").val();
	var address2 = $("#address2").val();
	var location = $("#location").val();
	var territory = $("#territory").val();
	var country = $("#country").val();
	var email_id = $("#email_id").val();
	var phone_no = $("#phone_no").val();
	var ad_heading = $("#ad_heading").val();
	var cmpnyProfile = $("#cmpnyProfile").val();
	var productDtls = $("#productDtls").val();
	
	var atpos = email_id.indexOf("@");
	var dotpos = email_id.lastIndexOf(".");

	if($("#slct_ctgies option:selected").text() == "No Categories Found!"){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Sorry, without categories we cannot move forward!", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#slct_ctgies").focus();
	}else if(categoryID == "0"){
		window.plugins.spinnerDialog.hide();
		window.plugins.toast.showLongBottom("Select Ad Category", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#slct_ctgies").focus();
	}else if($("#slct_sbctgies option:selected").text() == "No Sub Categories Found!"){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Sorry, without sub categories we cannot move forward!", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#slct_sbctgies").focus();
	}else if(subcategoryID == "0"){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Select Sub category", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#slct_sbctgies").focus();
	}else if(name == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Name", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#usrName").focus();
	}else if(cmpnyName == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Company Name", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#cmpnyName").focus();
	}else if(address1 == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Address line 1", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#address1").focus();
	}else if(address2 == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Address line 2", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#address2").focus();
	}else if(location == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Location", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#location").focus();
	}else if(territory == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Territory", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#territory").focus();
	}else if(country == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Country", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#country").focus();
	}else if(email_id == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Email ID", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#email_id").focus();
	}else if(atpos<1 || dotpos<atpos+2 || dotpos+2>=email_id.length){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter valid Email ID", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#email_id").focus();
	}else if(phone_no == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Mobile Number", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#phone_no").focus();
	}else if($("#phone_no").intlTelInput("isValidNumber") == false){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Mobile Number not valid!", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#phone_no").focus();
	}else if(ad_heading == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Heading", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#ad_heading").focus();
	}else if(cmpnyProfile == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Company Profile", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#cmpnyProfile").focus();
	}else if(productDtls == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Product Details", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#productDtls").focus();
	}else{
		
		var countryData = $("#phone_no").intlTelInput("getSelectedCountryData");
		var dialCode = countryData['dialCode'];
		//alert(dialCode);
		//dialCode = "91";
		$.ajax({
			url: server_url+"PostAd/ad_post.php",
			data:{
					cust_id: window.localStorage.getItem("custid"),
					category_id: categoryID,
					subcategory_id: subcategoryID,
					name: name,
					comp_name: cmpnyName,
					address1: address1,
					address2: address2,
					location: location,
					territory: territory,
					country: country,
					email_id: email_id,
					dialCode: dialCode,
					mobile_number: phone_no,
					heading: ad_heading,
					comp_profile: cmpnyProfile,
					product_details: productDtls,
					photos: ""
				},
			type: "POST",
			success: function(msg){
				//alert(msg);
				var a = JSON.parse(msg);
				if(a.msg == "success"){
					$('#slct_ctgies').prop('selectedIndex',0);
					$('#slct_sbctgies').prop('selectedIndex',0);
					$("#usrName").val("");
					$("#cmpnyName").val("");
					$("#address1").val("");
					$("#address2").val("");
					$("#location").val("");
					$("#territory").val("");
					$("#email_id").val("");
					$("#phone_no").val("");
					$("#ad_heading").val("");
					$("#cmpnyProfile").val("");
					$("#productDtls").val("");
					window.plugins.spinnerDialog.hide();	
					uploadPics(a.adID);
				}else{
					window.plugins.spinnerDialog.hide();	
					alert(a.msg);
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

$("#btn_updtAd").on("click", function(){
	//uploadPics(window.sessionStorage.getItem("AdID"));
	//return;
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var categoryID = $("#slct_ctgies option:selected").val();
	var subcategoryID = $("#slct_sbctgies option:selected").val();
	var name = $("#usrName").val();
	var cmpnyName = $("#cmpnyName").val();
	var address1 = $("#address1").val();
	var address2 = $("#address2").val();
	var location = $("#location").val();
	var territory = $("#territory").val();
	var country = $("#country").val();
	var email_id = $("#email_id").val();
	var phone_no = $("#phone_no").val();
	var ad_heading = $("#ad_heading").val();
	var cmpnyProfile = $("#cmpnyProfile").val();
	var productDtls = $("#productDtls").val();
	
	var atpos = email_id.indexOf("@");
	var dotpos = email_id.lastIndexOf(".");

	if($("#slct_ctgies option:selected").text() == "No Categories Found!"){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Sorry, without categories we cannot move forward!", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#slct_ctgies").focus();
	}else if(categoryID == "0"){
		window.plugins.spinnerDialog.hide();
		window.plugins.toast.showLongBottom("Select Ad Category", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#slct_ctgies").focus();
	}else if($("#slct_sbctgies option:selected").text() == "No Sub Categories Found!"){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Sorry, without sub categories we cannot move forward!", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#slct_sbctgies").focus();
	}else if(subcategoryID == "0"){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Select Sub category", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#slct_sbctgies").focus();
	}else if(name == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Name", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#usrName").focus();
	}else if(cmpnyName == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Company Name", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#cmpnyName").focus();
	}else if(address1 == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Address line 1", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#address1").focus();
	}else if(address2 == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Address line 2", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#address2").focus();
	}else if(location == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Location", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#location").focus();
	}else if(territory == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Territory", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#territory").focus();
	}else if(country == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Country", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#country").focus();
	}else if(email_id == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Email ID", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#email_id").focus();
	}else if(atpos<1 || dotpos<atpos+2 || dotpos+2>=email_id.length){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter valid Email ID", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#email_id").focus();
	}else if(phone_no == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Mobile Number", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#phone_no").focus();
	}else if($("#phone_no").intlTelInput("isValidNumber") == false){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Mobile Number not valid!", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#phone_no").focus();
	}else if(ad_heading == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Heading", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#ad_heading").focus();
	}else if(cmpnyProfile == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Company Profile", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#cmpnyProfile").focus();
	}else if(productDtls == ""){
		window.plugins.spinnerDialog.hide();	
		window.plugins.toast.showLongBottom("Enter Product Details", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
		$("#productDtls").focus();
	}else{
		
		var countryData = $("#phone_no").intlTelInput("getSelectedCountryData");
		var dialCode = countryData['dialCode'];
		
		$.ajax({
			url: server_url+"PostAd/update_post.php",
			data:{
					adID: window.sessionStorage.getItem("AdID"),
					category_id: categoryID,
					subcategory_id: subcategoryID,
					name: name,
					comp_name: cmpnyName,
					address1: address1,
					address2: address2,
					location: location,
					territory: territory,
					country: country,
					email_id: email_id,
					dialCode: dialCode,
					mobile_number: phone_no,
					heading: ad_heading,
					comp_profile: cmpnyProfile,
					product_details: productDtls,
					photos: ""
				},
			type: "POST",
			success: function(msg){
				//alert(msg);
				var a = JSON.parse(msg);
				if(a.msg == "success"){
					$('#slct_ctgies').prop('selectedIndex',0);
					$('#slct_sbctgies').prop('selectedIndex',0);
					$("#usrName").val("");
					$("#cmpnyName").val("");
					$("#address1").val("");
					$("#address2").val("");
					$("#location").val("");
					$("#territory").val("");
					$("#email_id").val("");
					$("#phone_no").val("");
					$("#ad_heading").val("");
					$("#cmpnyProfile").val("");
					$("#productDtls").val("");
					window.plugins.spinnerDialog.hide();	
					uploadPics(window.sessionStorage.getItem("AdID"));
				}else{
					window.plugins.spinnerDialog.hide();	
					alert(a.msg);
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

$('.div_slctCity').on('click', function () {
	$.mobile.changePage("#page_selectCity", {transition:"slide"});
});
$("#page_selectCity").on("pageshow", function(){
	/*var onSuccess = function(position) {
		alert('Latitude: '          + position.coords.latitude          + '\n' +
			  'Longitude: '         + position.coords.longitude         + '\n' +
			  'Altitude: '          + position.coords.altitude          + '\n' +
			  'Accuracy: '          + position.coords.accuracy          + '\n' +
			  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
			  'Heading: '           + position.coords.heading           + '\n' +
			  'Speed: '             + position.coords.speed             + '\n' +
			  'Timestamp: '         + position.timestamp                + '\n');
	};

	// onError Callback receives a PositionError object
	//
	function onError(error) {
		alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
	}

	navigator.geolocation.getCurrentPosition(onSuccess, onError);*/
	/*$.ajax({
		url: server_url+"PostAd/get_localities.php",
		data:{},
		type: "POST",
		success: function(msg){
			//alert(msg);
			$("#list_cities").empty();
			var a = JSON.parse(msg);
			if(a.length != 0){
				for(var i=0; i<a.length; i++){
					var data = "<li>"+a[i].location+"</li>";
					$("#list_cities").append(data);
					$("#list_cities").listview("refresh");
				}
			}else{
				var data = "<li>No Cities Found!</li>";
				$("#list_cities").append(data);
			}
		},
		error: function(error){
			if(error.status == "0"){
				alert("Unable to connect server, Try again.");
			}else{
				alert("Something went wrong, Try again.");
			}
		}
	});*/
	var searchRequest = null;
	var minlength = 2;
    $("#search-city").keyup(function () {
		window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
        var that = this,
        value = $(this).val();
        if (value.length >= minlength ) {
            if (searchRequest != null) 
			searchRequest.abort();
			searchRequest = $.ajax({
				type: "GET",
				url: server_url+"PostAd/search_city.php",
				data: {
					'query' : value
				},
				dataType: "text",
				success: function(msg){
					//we need to check if the value is the same
					$("#list_cities").empty();
					var a = JSON.parse(msg);
					if(a.length != 0){
						for(var i=0; i<a.length; i++){
							var data = "<li>"+a[i].location+"</li>";
							$("#list_cities").append(data);
							$("#list_cities").listview("refresh");
						}
						window.plugins.spinnerDialog.hide();	
					}else{
						window.plugins.spinnerDialog.hide();	
						var data = "<li>No ads found in your search!</li>";
						$("#list_cities").append(data);
						$("#list_cities").listview("refresh");
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
		}
    });
});
$("#back_selectCity").on("click", function(){
	$.mobile.changePage("#main", {transition: "slide", reverse: true});
});
$('#list_cities').on('click', 'li', function () {
	var city = $(this).text();
	$("#slctCity").text(city);
	$.mobile.changePage("#main", {transition: "fade"});
});
$("#openSearch").on("click", function(){
	$.mobile.changePage("#page_search", {transition: "slide"});
});
$("#back_search").on("click", function(){
	$.mobile.changePage("#main", {transition: "slide", reverse: true});
});
$("#page_search").on("pageshow", function(){
	var searchRequest = null;
	var minlength = 2;
    $("#search").keyup(function () {
		window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
        var that = this,
        value = $(this).val();
        if (value.length >= minlength ) {
            if (searchRequest != null) 
			searchRequest.abort();
			searchRequest = $.ajax({
				type: "GET",
				url: server_url+"PostAd/search_ad.php",
				data: {
					'query' : value
				},
				dataType: "text",
				success: function(msg){
					//we need to check if the value is the same
					var a = JSON.parse(msg);
					if(a.length != 0){
						$("#list_search").empty();
						var headdata = "<li data-id='' data-role='list-divider'>SUGGESTIONS</li>";
						$("#list_search").append(headdata);
						for(var i=0; i<a.length; i++){
							var data = "<li data-id='"+a[i].adID+"'>";
							data += "<h2>"+a[i].heading+"</h2>";
							data += "<p>in <strong>"+a[i].category+"</strong> - <strong>"+a[i].subcategory+"</strong></p>";
							data += "</li>";
							$("#list_search").append(data);
							$("#list_search").listview("refresh");
						}
						window.plugins.spinnerDialog.hide();
					}else{
						$("#list_search").empty();
						var data = "<li data-id=''>No ads found in your search!</li>";
						$("#list_search").append(data);
						$("#list_search").listview("refresh");
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
		}
    });
});
$('#list_search').on('click', 'li', function () {
	var adID = $(this).data('id');
	if(adID != ""){
		
	}
});
/*$('#div_categories').on('click', 'div', function () {
	var catID = $(this).data('catID');
	alert(catID);
});*/
/*$(".div-catItem").on("click", function(){
	alert("heleo");
	var catID = $(this).data('catID');
	alert(catID);
});*/
function opensubCat(catID){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	$.ajax({
		url: server_url+"PostAd/get_subcategories.php",
		data:{categoryID: catID},
		type: "POST",
		success: function(msg){
			//alert(msg);
			$("#list_subcategory").empty();
			var a = JSON.parse(msg);
			if(a.length != 0){
				for(var i=0; i<a.length; i++){
					
					var data = '<li data-id="'+a[i].subcategoryID+'">';
					data += '<a href="#">';
					if(a[i].icon == ""){
						data += '<img src="img/noimage.jpg" alt="France" class="ui-li-icon ui-corner-none">';
					}else{
						data += '<img src="'+a[i].icon+'" alt="France" class="ui-li-icon ui-corner-none">';
					}
					data += a[i].name;
					data += '</a>';
					data += '</li>';
					
					$("#list_subcategory").append(data);
					$("#list_subcategory").listview("refresh");
				}
				window.plugins.spinnerDialog.hide();
			}else{
				var data = "<li style='padding:10px;text-align:center;'>No SubCategory Found!</li>";
				$("#list_subcategory").append(data);
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
	$.mobile.changePage("#page_subCats", {transition:"slide"});
}
$("#back_subcats").on("click", function(){
	$.mobile.changePage("#main", {transition: "slide", reverse: true});
});
$("#page_subCats").on("pageshow", function(){
	
});
$('#list_subcategory').on('click', 'li', function () {
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var scatID = $(this).data('id');
	//alert(scatID);
	$.ajax({
		url: server_url+"PostAd/get_ads.php",
		data:{subcatID: scatID},
		type: "POST",
		success: function(msg){
			//alert(msg);
			$("#list_ads").empty();
			var a = JSON.parse(msg);
			if(a.length != 0){
				for(var i=0; i<a.length; i++){
					
					var data = "<li style='padding:"+wid*1.56+"px;'>";
					data += "<div class='li_imgGrid'>";
					var photos = a[i].photos;
					if(photos.length > 1){
						for(var j=1; j<photos.length; j++){
							data += "<div>";
							data += "<img src='"+ad_attachment_url+photos[j].img+"' style='height:"+wid*23.4+"px;' />";
							data += "</div>";
						}
					}else{
						data += "<div>";
						data += "<img src='img/noimage.jpg' style='height:"+wid*23.4+"px;' />";
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
					data += "<p onclick='adDetails(&quot;"+a[i].ad_id+"&quot;)' style='width:"+wid*15.6+"px;text-align:center;float:right;font-family:calibri;";
					data += "padding:"+wid*1+"px;border:1px solid #007960;color:#007960;font-size:"+wid*3.75+"px;margin:0px;'>";
					data += "VIEW</p>";
					data += "</div>";
					data += "<div style='clear:both;'></div>";
					data += "</li>";
					
					$("#list_ads").append(data);
					$("#list_ads").listview("refresh");
				}
				window.plugins.spinnerDialog.hide();
			}else{
				var data = "<li style='padding:5px;text-align:center;'>No ads Found!</li>";
				$("#list_ads").append(data);
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
	$.mobile.changePage("#page_ads", {transition:"slide"});
});
$("#back_ads").on("click", function(){
	$.mobile.changePage("#main", {transition: "slide", reverse: true});
});
function adDetails(adID){
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	$.ajax({
		url: server_url+"PostAd/get_adDetails.php",
		data:{adID: adID},
		type: "POST",
		success: function(msg){
			//alert(msg);
			var a = JSON.parse(msg);
			$("#ad_dtls_heading").text(a.heading);
			$("#ad_dtls_location").text(a.location);
			$("#ad_dtls_time").text(a.createdTime);
			$("#ad_dtls_prdctDtls").text(a.product_dtls);
			$("#ad_dtls_name").text(a.name);
			$("#ad_dtls_email").text(a.email_id);
			$("#ad_dtls_mobile").text(a.mobile_number);
			$("#ad_dtls_address").text(a.address);
			$("#ad_dtls_cmpName").text(a.company_name);
			$("#ad_dtls_cmpDescri").text(a.comp_profile);
			$("#ad_dtls_adID").text(a.adId);
			
			var imgs = a.photos;
			if(imgs.length > 1){
				$(".container-outer").empty();
				for(var i=1; i<imgs.length; i++){
					var d = '<div>';
					d += '<img src="'+ad_attachment_url+imgs[i].img+'" style="height:'+$(window).width()*0.28+'px;" />';
					d += '</div>';
					
					$(".container-outer").append(d);
				}
			}
			window.plugins.spinnerDialog.hide();
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
	$.mobile.changePage("#page_addetails", {transition: "slide"});
}
$("#back_addetails").on("click", function(){
	if(window.sessionStorage.getItem("toAdsPage") != null){
		if(window.sessionStorage.getItem("toAdsPage") === "yes"){
			window.location = "index.html";
		}else{
			$.mobile.changePage("#main", {transition:"slide", reverse:"true"});
		}
	}else{
		$.mobile.changePage("#main", {transition:"slide", reverse:"true"});
	}
});
$("#frm_ads").on("click", function(){
	$.mobile.changePage("#page_subCats", {transition: "slide", reverse: true});
});
$("#adPhotos").on("change", function(){
	var fileList = this.files;
	//alert(fileList.length);
    var anyWindow = window.URL || window.webkitURL;
	for(var i = 0; i < fileList.length; i++){
	  var objectUrl = anyWindow.createObjectURL(fileList[i]);
	  images.push(objectUrl);
	  var filename = objectUrl.substring(objectUrl.lastIndexOf('/')+1);
	  var data = '<a style="padding:'+wid*0.6+'px;">';
	  data += '<img src="'+ objectUrl +'" style="height:'+$(window).width()*0.28+'px;" />';
	  //data += '<span>'+filename+'</span>';
	  data += '</a>';
	  $('.preview-area').append(data);
	  window.URL.revokeObjectURL(fileList[i]);
	}
});
function uploadPics(adID) {
	window.plugins.spinnerDialog.show("Loading","Wait while loading..", true);
	var elem = document.getElementById("showProgress");
    var defs = [];
    if(images.length > 0){
		$('#upldPrgrs').popup('open',{'positionTo':'window'});
		$('body').css('overflow','hidden');
		for(var i=0; i<images.length; i++){
			$("#upldImgCount").html("Uploading "+images.length+"("+i+")");
			//alert(images[i]);
			var def = $.Deferred();
			function win(r) {
				//alert(r.response);
				/*if(i === (images.length -1)){
					alert("Ad Submitted! If any images are missed while uploading.You can update in My Ads.");
					images = [];
					refreshView();
					$('#upldPrgrs').popup('close');
				}*/
			}
			function fail(error) {
				/*if(i == (images.length -1)){
					alert("Ad Submitted! If any images are missed while uploading.You can update in My Ads.");
					images = [];
					refreshView();
					$('#upldPrgrs').popup('close');
				}*/
				def.resolve(0);
			}
			var uri = encodeURI(server_url+"PostAd/upload_ad_photos.php");
			var options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=images[i].substr(images[i].lastIndexOf('/')+1);
			options.mimeType="image/jpeg";

			var params = new Object();
			params.value1 = adID;
			params.value2 = "param";
			options.params = params;
			var ft = new FileTransfer();
			ft.onprogress = function(progressEvent) {
				perc = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
				elem.style.width = perc + '%'; 
				if(perc == 99){
					$('#upldPrgrs').popup('close');
					elem.style.width = '0%';
					images = [];
					refreshView();
					$('body').css('overflow','auto');
					window.plugins.toast.showLongBottom("Ad Submitted! If any images are missed while uploading.You can update in My Ads.", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
					window.sessionStorage.setItem("toAdsPage","yes");
					window.location = "index.html";
				}
			}
			ft.upload(images[i], uri, win, fail, options);
			defs.push(def.promise());
			
		}
		window.plugins.spinnerDialog.hide();
		$.when.apply($, defs).then(function() {
			console.log("all things done");
			console.dir(arguments);
			window.plugins.spinnerDialog.hide();
		});
	}else{
		window.plugins.spinnerDialog.hide();
		alert("Ad Submitted!");
	}
}

$("#pickPhotos").on("click", function(){
	if(images.length > 5){
		window.plugins.toast.showLongBottom("You cannot select more than 5", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
	}else{
		$('#dialogPage').dialog({ position: 'center' });
		$.mobile.changePage("#dialogPage", { role: "dialog" } );
	}
});
$("#openCamera").on("click", function(){
	$('#dialogPage').dialog( "close" );
	navigator.camera.getPicture(function (imgData) {
		images.push(imgData);
		refreshView();
		$('#dialogPage').dialog( "close" );	
	}, function (error) {
		//$('#dialogPage').dialog( "close" );
		//alert(error);
	}, {
		quality: 90,
		destinationType: Camera.DestinationType.FILE_URI,
		correctOrientation: true
	});
});
$("#openFileManager").on("click", function(){
	$('#dialogPage').dialog( "close" );
	navigator.camera.getPicture(
		function (imgData) {
			//alert(imgData);
			var img = imgData.split("?");
			//alert(img[0])
			//alert(images);
			if(images.indexOf(img[0]) > -1){
				window.plugins.toast.showLongBottom("This Image already Added!", "center",
						function(a){console.log("toast success: "+a)}, 
						function(err){console.log("toast error "+err)});
			}else{
				images.push(img[0]);
				refreshView();
			}
			$('#dialogPage').dialog( "close" );
		}, function (error) {
			//$('#dialogPage').dialog( "close" );
			//alert(error);
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
$("#cncl_dialog").on("click", function(){	
	$('#dialogPage').dialog( "close" );
});
function removeImg(imgData){
	$(".preview-area div").filter(function(){
		return $(this).data('id') === imgData
	}).remove();
	for (var i=images.length-1; i>=0; i--) {
		if (images[i] === imgData) {
			images.splice(i, 1);
		}
	}
	//alert(images.toString());
}
function refreshView(){
	if(images.length > 0){	
		$('.preview-area').empty();
		for(var i = 0; i < images.length; i++){
			var imgUrl = images[i];
			var data = '<div class="img-wrap" data-id="'+imgUrl+'" style="padding:'+wid*0.6+'px;">';
			data += '<span class="close" onclick="removeImg(&quot;'+imgUrl+'&quot;)">&times;</span>';
			data += '<img src="'+imgUrl+'" style="height:'+$(window).width()*0.28+'px;" />';
			data += '</div>';
			$('.preview-area').append(data);
		}	
	}else{
		$('.preview-area').empty();
	}
}
$("#back").on("click", function(){
	window.location = "index.html";
});