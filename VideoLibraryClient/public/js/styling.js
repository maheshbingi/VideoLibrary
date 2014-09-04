$(document).ready(function(){	
	$("li.logIn").click(function(){
		$(".signUp a").removeClass("active");
		$(".logIn a").addClass("active");
		$("li.nav_home a").removeClass("active");
		$("li.about a").removeClass("active");
		$("li.contact a").removeClass("active");
	});
	
	$("li.signUp").click(function(){						
		$(".logIn a").removeClass("active");
		$(".signUp a").addClass("active");
		$("li.about a").removeClass("active");
		$("li.contact a").removeClass("active");
		$("li.nav_home a").removeClass("active");
	});
	
	$("li.contact").click(function(){
		$(".signUp a").removeClass("active");
		$(".contact a").addClass("active");
		$("li.nav_home a").removeClass("active");
		$("li.about a").removeClass("active");
		$("li.logIn a").removeClass("active");
	});
	
	$("li.about").click(function(){						
		$(".logIn a").removeClass("active");
		$(".about a").addClass("active");
		$("li.signUp a").removeClass("active");
		$("li.contact a").removeClass("active");
		$("li.nav_home a").removeClass("active");
	});
	
	$("li.nav_movies").click(function(){
		$("li.nav_movies a").addClass("active");
		$("li.nav_members a").removeClass("active");
		$("li.nav_home a").removeClass("active");
	});
	
	$("li.nav_members").click(function(){
		$("li.nav_movies a").removeClass("active");
		$("li.nav_members a").addClass("active");
		$("li.nav_home a").removeClass("active");
	});		
	
	/* --------------- Normal User --------------- */
	
	/*$("#cssmenu > ul > li.view_info").click(function(){
		alert('View Info');
		$("li.edit_info").removeClass("active");
		$("li.view_info").addClass("active");
		$("li.bill_generate").removeClass("active");
	});
	
	$("li.bill_generate").click(function(){
		$("li.edit_info").removeClass("active");
		$("li.bill_generate").addClass("active");
		$("li.view_info").removeClass("active");
	});
	
	$("li.edit_info").click(function(){
		$("li.bill_generate").removeClass("active");
		$("li.edit_info").addClass("active");
		$("li.view_info").removeClass("active");
	}); */
	
});    
