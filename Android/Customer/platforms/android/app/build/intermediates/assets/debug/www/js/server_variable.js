var local = false;

if(local == true){
	var server_url = "http://192.168.137.1/Cameroun/app/App_1.0.0/Customer/";
	var ad_category_icon_url = "http://192.168.137.1/cameroun/web/Admin/";
	var ad_attachment_url = "http://192.168.137.1/cameroun/web/";
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