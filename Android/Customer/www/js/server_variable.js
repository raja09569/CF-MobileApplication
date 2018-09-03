var local = true;

if(local == true){
	var base_url = "http://localhost:8080/";
	var server_url = base_url+"Cameroun/app/App_1.0.0/Customer/";
	var ad_category_icon_url = base_url+"cameroun/web/Admin/";
	var ad_attachment_url = base_url+"cameroun/web/";
}else{
	var base_url = "http://camerounfacile.com/";
	var server_url = base_url+"app/App_1.0.0/Customer/";
	var ad_category_icon_url = base_url+"web/Admin/";
	var ad_attachment_url = base_url+"web/";
}


function showToast(msg){
	window.plugins.toast.showLongBottom(msg, function(a){
		console.log('toast success: ' + a);
	}, function(b){
		console.log('toast error: ' + b);
	});
}