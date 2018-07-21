// here initialize the app
var myApp = new Framework7({
    material: true
});

// If your using custom DOM library, then save it to $$ variable
var $$ = Dom7;

// Add the view
var mainView = myApp.addView('.view-main', {
    // enable the dynamic navbar for this view:
    dynamicNavbar: true
});

//use the 'pageInit' event handler for all pages
$$(document).on('pageInit', function (e) {
    //get page data from event data
    var page = e.detail.page;
    if (page.name === 'index') {
        // you will get below message in alert box when page with data-page attribute is equal to "about"
        myApp.alert('Here its your About page');
    }
});