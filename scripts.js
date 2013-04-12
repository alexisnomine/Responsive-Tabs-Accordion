var panels = $('#profiles article'); // cache the profiles
var navlinks = $('nav li'); // cache the nav links
var view = ""; // store the actual view
var minWidth = 760; // breakpoint between views

function accordionHandler() {
	// get the target panel
	var panel = $(this).parent();
	// if not already open, open it. else, close it
	panel.toggleClass('active').children('.description').slideToggle();
	// close every other panels
	panels.not(panel).removeClass('active').children('.description').slideUp();
	// select corresponding navlink in case view switches to tabs later
	var navlink = navlinks.has('a[href=#'+panel.attr('id')+']');
	navlink.toggleClass('active');
	navlinks.not(navlink).removeClass('active');
	// save the current panel
	if(panel.hasClass('active')){
		saveCurrent('#'+panel.attr('id'));
	} else {
		saveCurrent("#");
	}
}

function tabsHandler(e) {
	// prevent the default click event
	e.preventDefault();
	// get the target panel
	panel = $($(this).attr('href'));
	// open it
	panel.addClass('active');
	// close every other panels
	panels.not(panel).removeClass('active');
	// select corresponding navlink
	navlinks.removeClass('active');
	$(this).parent().addClass('active');
	// save the current panel
	saveCurrent($(this).attr('href'));
}

function switchView() {
	// if the viewport is wider than minWidth
	if ($(window).width() > minWidth) {
		// switch to tabs view if it's not already the case
		if (view != "tabs") {
			view = "tabs";
			// remove accordion behavior
			panels.children('h1').off('click',accordionHandler);
			panels.children('.description').show();
			// add tabs behavior
			navlinks.children('a').on('click',tabsHandler);
			// open the first tab if no tab is open
			if (!panels.is('.active')){
				navlinks.first().addClass('active');
				panels.first().addClass('active');
				saveCurrent("#"+panels.first().attr('id'));
			}
		}
	// if the viewport is smaller than minWidth
	} else {
		// switch to accordion view if it's not already the case
		if (view != "accordion") {
			view = "accordion";
			// remove tabs behavior
			navlinks.children('a').off('click',tabsHandler);
			// add accordion behavior
			panels.children('h1').on('click',accordionHandler);
			// hide every panel except if there's one "active"
			panels.filter('.active').children('.description').show();
			panels.not('.active').children('.description').hide();
		}
	}
}

function saveCurrent(id){
	// for newer browsers
	if ( window.history && window.history.replaceState ) {
		window.history.replaceState(null,document.title,id);
	// for IE<10 and older browsers
	} else {
		window.location.hash = id;
	}
}

// load the right view at init
$(document).ready(function() {
	// preselect a panel
	$(window.location.hash).addClass('active');
	$('nav a[href=' + window.location.hash + ']').parent().addClass('active');
	// init the right view
	switchView();
});
// load the right view when the viewport changes
$(window).resize(switchView);