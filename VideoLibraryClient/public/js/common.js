var searchGrid;
var data = {};
var deleteRow = 0;
var persons;

function initSearchGrid(){	
	searchGrid = new dhtmlXGridObject('searchGrid');
	searchGrid.setImagePath("./images/");
	searchGrid.setHeader("MemberId, Firstname,Lastname,EmailId, Membership Type, Status");
	searchGrid.setColumnIds("id", "first_name", "last_name","email","membership_type","member_tatus");
	searchGrid.setInitWidths("100,150,150,150,150,*");
	searchGrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
	searchGrid.setColAlign("right,left,left,left,left,left");
	searchGrid.setColTypes("ro,ro,ro,ro,ro,ro");
	searchGrid.setColSorting("int,str,str,str,str,str");
	searchGrid.enableMultiselect(true);
	searchGrid.init();
	searchGrid.setSkin("dhx_terrace");

	searchGrid.attachEvent("onRowDblClicked", function(rId,cId){
		jQuery("section.simple_member_default").css("display","none");
		jQuery("section.simple_member_information").css("display","block");
	});
	
	persons= JSON.parse(dhtmlxAjax.getSync('/listAllPersons').xmlDoc.responseText).persons;
	
	jQuery("li.li_member").click(function(){
		jQuery("section.simple_member_default").css("display","block");
		jQuery("section.simple_member_information").css("display","none");
		
		jQuery("li.li_simple_member").removeClass("active");
		jQuery("li.li_member").addClass("active");
		jQuery("li.li_premium_member").removeClass("active");
		
		persons = JSON.parse(dhtmlxAjax.getSync('/listAllPersons').xmlDoc.responseText).persons;		
		searchGrid.clearAll();
		var js = eval("("+getJSON(persons)+")");	
		searchGrid.parse(js,"json");
	});
	
	jQuery("li.li_simple_member").click(function(){
		
		jQuery("section.simple_member_default").css("display","block");
		jQuery("section.simple_member_information").css("display","none");	
		
		jQuery("li.li_simple_member").addClass("active");
		jQuery("li.li_member").removeClass("active");
		jQuery("li.li_premium_member").removeClass("active");
		
		persons = JSON.parse(dhtmlxAjax.getSync('/listAllSimpleCustomers').xmlDoc.responseText).persons;
		searchGrid.clearAll();
		var js = eval("("+getJSON(persons)+")");	
		searchGrid.parse(js,"json");
	});
	
	jQuery("li.li_premium_member").click(function(){
		jQuery("section.simple_member_default").css("display","block");
		jQuery("section.simple_member_information").css("display","none");
		
		jQuery("li.li_simple_member").removeClass("active");
		jQuery("li.li_member").removeClass("active");
		jQuery("li.li_premium_member").addClass("active");
		
		persons = JSON.parse(dhtmlxAjax.getSync('/listAllPremiumMembers').xmlDoc.responseText).persons;
		searchGrid.clearAll();
		var js = eval("("+getJSON(persons)+")");	
		searchGrid.parse(js,"json");
	});
	var js = eval("("+getJSON(persons)+")");	
	searchGrid.parse(js,"json");
}

function getJSON(personCollection)
{
	if(personCollection=="")
	{		
		jQuery("p.no_record").css("display","block");		
	}

	var data = "";
	var memberStatus;
	$.each(personCollection, function(index, value)
	{
		if(data != "")
		{
			data = data + ',';
		}
		
		if(value.is_disabled == 1) 
		{
			memberStatus = "<a onclick=\"enableDisableMember(this)\" href=\"javascript:void(0)\" id=\"" + value.id + "\">Enable</a>";
		} 
		else 
		{
			memberStatus = "<a onclick=\"enableDisableMember(this)\" href=\"javascript:void(0)\" id=\"" + value.id + "\">Delete</a>";
		}
		data = data + "{ id:"+value.id +", data:['"+value.membership_id+ "','"+value.first_name+"','"+value.last_name+"','"+value.email+"','"+value.membership_type+"','"+memberStatus+"'] }";
	});	
	var simpleCustomerJSONString = "{rows:["+data+"]}";
	//console.log("--------------"+simpleCustomerJSONString);
	return simpleCustomerJSONString;
}

/* ---------------------------- */

var mygrid;
data = {};

function initSearchMoviesGrid(){    

    var mygrid = new dhtmlXGridObject('movieGridbox');
    mygrid.setImagePath("./images/");
    mygrid.setHeader("Movie id, Movie Name, Banner Name, Release Date, Rent Amount, Available Copies,Delete");
    mygrid.setInitWidths("100,100,100,100,100,*");
    mygrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
    mygrid.setColAlign("right,left,left,left,left,left,left");
    mygrid.setColTypes("ro,link,ro,ro,ro,ro,ro");
    mygrid.setColSorting("int,str,str,str,int,int");
    mygrid.enableMultiselect(true);
    mygrid.init();
    mygrid.setSkin("dhx_terrace");
    
    mygrid.attachEvent("onRowSelect", function(rId,cId){
        if(cId==6)
        {           
            deleteRow = rId;
            data = {movie_id : rId};
            $.ajax({
                type: 'POST',
                url: '/deleteMovie',
                data: JSON.stringify(data),
                contentType: 'application/json'
                
            }).done(function(response) {
                mygrid.deleteRow(deleteRow);                    
            }).error(function(response) {
                displayErrorMessage(response);
            });
        }
    });

    mygrid.attachEvent("onRowDblClicked", function(rId,cId){
        
        var data = {};
        var current_category = [];
        
        for(i in all_movies["movies"])
        {
            if(all_movies.movies[i].id == rId)
            {                
                current_movie = all_movies.movies[i];
            }
        }
        
        data["currentMovie"] = current_movie;
        
        $.ajax({
            type: 'POST',
            url: '/getAllCategories',
        }).done(function(response) 
        {       
            
            data["allCategories"] = response.categories;

            $('.movie_default').load( "EditMovie.ejs", {data:data}, function(response, status, xhr) {
            });                         
        }).error(function(response) {
            displayErrorMessage(response);
        });
    }); 

    var all_movies = JSON.parse(dhtmlxAjax.getSync('/getAllMovies').xmlDoc.responseText);
    var js = eval("("+getJSONA(all_movies['movies'])+")");
    mygrid.parse(js,"json");
}

function getJSONA(moviesCollection){	
	
	if(moviesCollection=="")
	{		
		jQuery("p.no_record").css("display","block");		
	}
	var data = "";
	var delete1 = "Delete";
	$.each(moviesCollection, function(index, value){
		if(data != ""){
			data = data + ',';
		}
		data = data + "{ id:"+value.id +", data:["+value.id+",'"+value.name+"','"+value.banner+"','"+value.release_date+"','"+value.rent_amount+"','"+value.available_copies+"','"+delete1+"'] }";
	});
	var moviesJSONString = "{rows:["+data+"]}";
	console.log("--------------"+moviesJSONString);
	return moviesJSONString;
}

// ============================ Issue Movies =============================


var moviesGrid;
data = {};

function initAllMoviesGrid(){	
	
	var moviesGrid = new dhtmlXGridObject('allMoviesGrid');
	moviesGrid.setImagePath("./images/");
	moviesGrid.setHeader("Movie Name,Amount,Copies");
	moviesGrid.setInitWidths("150,100,100");
	moviesGrid.attachHeader("#text_filter,#text_filter,#text_filter");
	moviesGrid.setColAlign("left,left,left");
	moviesGrid.setColTypes("ro,ro,ro");
	moviesGrid.setColSorting("str,int,int");
	moviesGrid.enableMultiselect(true);
	moviesGrid.init();
	moviesGrid.setSkin("dhx_terrace");
	
	moviesGrid.attachEvent("onRowSelect", function(rId,cId){		
		$("input.movie_id").val(rId);		
	});
	
	var all_movies = JSON.parse(dhtmlxAjax.getSync('/getAllMovies').xmlDoc.responseText);
	
	var js = eval("("+getJSONMovies(all_movies['movies'])+")");
	moviesGrid.parse(js,"json");
}

function getJSONMovies(moviesCollection){
	
	if(moviesCollection=="")
	{		
		
		jQuery("p.no_record_movies").css("display","block");		
	}
	var data = "";	
	$.each(moviesCollection, function(index, value){
		if(data != ""){
			data = data + ',';
		}
		data = data + "{ id:"+value.id +", data:['"+value.name+"','"+value.rent_amount+"','"+value.available_copies+"'] }";
	});
	var moviesJSONString = "{rows:["+data+"]}";
	console.log("--------------"+moviesJSONString);
	return moviesJSONString;
}


/* ---------------------------- issue movie (members) ------------------------- */

var membersGrid;
var data = {};
var deleteRow = 0;

function initAllMembersGrid(){	
	membersGrid = new dhtmlXGridObject('allMembersGrid');
	membersGrid.setImagePath("./images/");
	membersGrid.setHeader("MemberId, Name");
	membersGrid.setColumnIds("id", "name");
	membersGrid.setInitWidths("150,200");
	membersGrid.attachHeader("#text_filter,#text_filter");
	membersGrid.setColAlign("right,left");
	membersGrid.setColTypes("ro,ro");
	membersGrid.setColSorting("int,str");
	membersGrid.enableMultiselect(true);
	membersGrid.init();
	membersGrid.setSkin("dhx_terrace");
	
	membersGrid.attachEvent("onRowSelect", function(rId,cId){
		$("input.member_id").val(rId);
	});
	
	persons= JSON.parse(dhtmlxAjax.getSync('/listAllPersons').xmlDoc.responseText).persons;
	
	var js = eval("("+getJSONMembers(persons)+")");	
	membersGrid.parse(js,"json");
}

function getJSONMembers(personCollection)
{
	if(personCollection=="")
	{		
		jQuery("p.no_record_members").css("display","block");		
	}
	var data = "";
	var memberStatus;
	$.each(personCollection, function(index, value)
	{
		if(data != "")
		{
			data = data + ',';
		}
		var name = value.first_name + " " +value.last_name;
		data = data + "{ id:"+value.person_id +", data:['"+value.membership_id+ "','"+name+"'] }";
	});	
	var simpleCustomerJSONString = "{rows:["+data+"]}";
	
	return simpleCustomerJSONString;
}

// ============================= No login Movies =================

var mygrid;
data = {};

function initNoLoginMoviesGrid(){	
	
	var mygrid = new dhtmlXGridObject('noLoginMovieGridbox');
	mygrid.setImagePath("./images//");
	mygrid.setHeader("Movie id, Movie Name, Banner Name, Release Date, Rent Amount, Available Copies");
	mygrid.setInitWidths("150,150,150,150,150,*");
	mygrid.attachHeader("#text_filter,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
	mygrid.setColAlign("right,left,left,left,left,left,left");
	mygrid.setColTypes("ro,ro,ro,ro,ro,ro");
	mygrid.setColSorting("int,str,str,str,int,int");
	mygrid.enableMultiselect(true);
	mygrid.init();
	mygrid.setSkin("dhx_terrace");	
		
	var all_movies = JSON.parse(dhtmlxAjax.getSync('/getAllMovies').xmlDoc.responseText);
	
	var js = eval("("+getJSONNoLogin(all_movies['movies'])+")");
	mygrid.parse(js,"json");
}

function getJSONNoLogin(moviesCollection){	
	
	if(moviesCollection=="")
	{		
		jQuery("p.no_login_no_record").css("display","block");		
	}
	var data = "";

	$.each(moviesCollection, function(index, value){
		if(data != ""){
			data = data + ',';
		}
		data = data + "{ id:"+value.id +", data:["+value.id+",'"+value.name+"','"+value.banner+"','"+value.release_date+"','"+value.rent_amount+"','"+value.available_copies+"'] }";
	});
	var moviesJSONString = "{rows:["+data+"]}";
	console.log("--------------"+moviesJSONString);
	return moviesJSONString;
}

//============================ Submit Movies =============================


data = {};
var submitMovieGrid;

function initAllMoviesGridForSubmit(){	
	
	submitMovieGrid = new dhtmlXGridObject('allMoviesGridForSubmit');
	submitMovieGrid.setImagePath("./images/");
	submitMovieGrid.setHeader("Movie Name,Amount");
	submitMovieGrid.setInitWidths("200,150");
	submitMovieGrid.attachHeader("#text_filter,#text_filter");
	submitMovieGrid.setColAlign("left,left");
	submitMovieGrid.setColTypes("ro,ro");
	submitMovieGrid.setColSorting("str,int");
	submitMovieGrid.enableMultiselect(true);
	submitMovieGrid.init();
	submitMovieGrid.setSkin("dhx_terrace");
	
	submitMovieGrid.attachEvent("onRowSelect", function(rId,cId){
		//console.log(rId);
		$("input.movie_id_submit").val(rId);
	});
	
	var all_movies = JSON.parse(dhtmlxAjax.getSync('/getAllMovies').xmlDoc.responseText);
	
	var js = eval("("+getJSONMoviesSubmit(all_movies['movies'])+")");
	submitMovieGrid.parse(js,"json");
}

function getJSONMoviesSubmit(moviesCollection){		
	
	if(moviesCollection=="")
	{				
		jQuery("p.no_record_movies_submit").css("display","block");		
	}
	var data = "";	
	$.each(moviesCollection, function(index, value){
		if(data != ""){
			data = data + ',';
		}
		data = data + "{ id:"+value.id +", data:['"+value.name+"','"+value.rent_amount+"'] }";
	});
	var moviesJSONString = "{rows:["+data+"]}";
	
	return moviesJSONString;
}


/* ---------------------------- submit movie (members) ------------------------- */

var data = {};
var deleteRow = 0;
var submitMemberGrid;
function initAllMembersGridForSubmit(){	
	submitMemberGrid = new dhtmlXGridObject('allMembersGridForSubmit');
	submitMemberGrid.setImagePath("./images/");
	submitMemberGrid.setHeader("MemberId,Name");
	submitMemberGrid.setColumnIds("id", "name");
	submitMemberGrid.setInitWidths("150,200");
	submitMemberGrid.attachHeader("#text_filter,#text_filter");
	submitMemberGrid.setColAlign("right,left");
	submitMemberGrid.setColTypes("ro,ro");
	submitMemberGrid.setColSorting("int,str");
	submitMemberGrid.enableMultiselect(true);
	submitMemberGrid.init();
	submitMemberGrid.setSkin("dhx_terrace");
	
	submitMemberGrid.attachEvent("onRowSelect", function(rId,cId){
		jQuery(".submit_movies_label").text("Movies Issued");
		data[PERSON_ID] = rId;
		$.ajax({
			type: 'POST',
	        url: '/listMoviesIssuedToPerson',
	        data: JSON.stringify(data),
	        contentType: 'application/json'
	        
	    }).done(function(response) {
	    	submitMovieGrid.clearAll();

	    	jQuery("p.no_record_movies_submit_one").css("display","none");
			var js = eval("("+getJSONMoviesOfPerson(response['movies'])+")");	
			submitMovieGrid.parse(js,"json");
	    	
	    }).error(function(response) {
	    	displayErrorMessage(response);
	    });
		$("input.member_id_submit").val(rId);
	});
	
	persons= JSON.parse(dhtmlxAjax.getSync('/listAllPersons').xmlDoc.responseText).persons;
	
	var js = eval("("+getJSONMembersSubmit(persons)+")");	
	submitMemberGrid.parse(js,"json");
}

function getJSONMembersSubmit(personCollection)
{
	if(personCollection=="")
	{		
		jQuery("p.no_record_members_submit").css("display","block");		
	}
	var data = "";
	var memberStatus;
	$.each(personCollection, function(index, value)
	{
		if(data != "")
		{
			data = data + ',';
		}
		var name = value.first_name + " " +value.last_name;
		data = data + "{ id:"+value.person_id +", data:['"+value.membership_id+ "','"+name+"'] }";
	});	
	var simpleCustomerJSONString = "{rows:["+data+"]}";
	
	return simpleCustomerJSONString;
}

function getJSONMoviesOfPerson(movieofPersonCollection)
{
	if(movieofPersonCollection=="")
	{		
		jQuery("p.no_record_movies_submit_one").css("display","block");		
	}
	var data = "";
	var memberStatus;
	$.each(movieofPersonCollection, function(index, value)
	{
		if(data != "")
		{
			data = data + ',';
		}
		
		data = data + "{ id:"+value.issued_movie_id +", data:['"+value.name+ "','"+value.rent_amount+"'] }";
	});	
	var simpleCustomerJSONString = "{rows:["+data+"]}";
	
	return simpleCustomerJSONString;
}



/******************************* moviesOfMembers (Movies) **************************/

data = {};
var movieOfMembersMovieGrid;

function initAllMoviesGridForMovieOfMembers(){	
	
	movieOfMembersMovieGrid = new dhtmlXGridObject('allMoviesGridForMovieOfMembers');
	movieOfMembersMovieGrid.setImagePath("./images/");
	movieOfMembersMovieGrid.setHeader("Movie Name,Amount");
	movieOfMembersMovieGrid.setInitWidths("200,150");
	movieOfMembersMovieGrid.attachHeader("#text_filter,#text_filter");
	movieOfMembersMovieGrid.setColAlign("left,left");
	movieOfMembersMovieGrid.setColTypes("ro,ro");
	movieOfMembersMovieGrid.setColSorting("str,int");
	movieOfMembersMovieGrid.enableMultiselect(true);
	movieOfMembersMovieGrid.init();
	movieOfMembersMovieGrid.setSkin("dhx_terrace");
	
	movieOfMembersMovieGrid.attachEvent("onRowSelect", function(rId,cId){
		var data = {};
		data[MOVIE_ID] = rId;
		$.ajax({
			type: 'POST',
	        url: '/listPersonsIssuedMovie',
	        data: JSON.stringify(data),
	        contentType: 'application/json'
	        
	    }).done(function(response) {
	    	movieOfMembersMemberGrid.clearAll();
	    	jQuery("p.no_record_movies_movieOfMembers").css("display","none");
			var js = eval("("+getJSONAjaxMembersMovieOfMembers(response['persons'])+")");	
			movieOfMembersMemberGrid.parse(js,"json");
	    	
	    }).error(function(response) {
	    	displayErrorMessage(response);
	    });
	});
	
	var all_movies = JSON.parse(dhtmlxAjax.getSync('/getAllMovies').xmlDoc.responseText);
	
	var js = eval("("+getJSONMoviesMovieOfMembers(all_movies['movies'])+")");
	movieOfMembersMovieGrid.parse(js,"json");
}

function getJSONMoviesMovieOfMembers(moviesCollection){		
	
	if(moviesCollection=="")
	{				
		jQuery("p.no_record_movies_submit").css("display","block");		
	}
	var data = "";	
	$.each(moviesCollection, function(index, value){
		if(data != ""){
			data = data + ',';
		}
		data = data + "{ id:"+value.id +", data:['"+value.name+"','"+value.rent_amount+"'] }";
	});
	var moviesJSONString = "{rows:["+data+"]}";
	
	return moviesJSONString;
}


/* ---------------------------- moviesOfMembers (Members) ------------------------- */

var data = {};
var deleteRow = 0;
var movieOfMembersMemberGrid;

function initAllMembersGridForMovieOfMembers(){	
	movieOfMembersMemberGrid = new dhtmlXGridObject('allMembersGridForMovieOfMembers');
	movieOfMembersMemberGrid.setImagePath("./images/");
	movieOfMembersMemberGrid.setHeader("Member Type,Name");
	movieOfMembersMemberGrid.setColumnIds("id", "name");
	movieOfMembersMemberGrid.setInitWidths("150,200");
	movieOfMembersMemberGrid.attachHeader("#text_filter,#text_filter");
	movieOfMembersMemberGrid.setColAlign("right,left");
	movieOfMembersMemberGrid.setColTypes("ro,ro");
	movieOfMembersMemberGrid.setColSorting("int,str");
	movieOfMembersMemberGrid.enableMultiselect(true);
	movieOfMembersMemberGrid.init();
	movieOfMembersMemberGrid.setSkin("dhx_terrace");
		
	persons= JSON.parse(dhtmlxAjax.getSync('/listAllPersons').xmlDoc.responseText).persons;
	
	var js = eval("("+getJSONMembersMovieOfMembers(persons)+")");	
	movieOfMembersMemberGrid.parse(js,"json");
}

function getJSONMembersMovieOfMembers(personCollection)
{
	if(personCollection=="")
	{		
		jQuery("p.no_record_members_submit").css("display","block");		
	}
	var data = "";
	var memberStatus;
	$.each(personCollection, function(index, value)
	{
		if(data != "")
		{
			data = data + ',';
		}
		var name = value.first_name + " " +value.last_name;
		data = data + "{ id:"+value.person_id +", data:['"+value.membership_type+ "','"+name+"'] }";
	});	
	var simpleCustomerJSONString = "{rows:["+data+"]}";
	
	return simpleCustomerJSONString;
}

function getJSONAjaxMembersMovieOfMembers(personCollection)
{
	if(personCollection=="")
	{		
		jQuery("p.no_record_movies_movieOfMembers").css("display","block");		
	}
	var data = "";
	var memberStatus;
	$.each(personCollection, function(index, value)
	{
		if(data != "")
		{
			data = data + ',';
		}
		var name = value.first_name + " " +value.last_name;
		data = data + "{ id:"+value.person_id +", data:['"+value.type+ "','"+name+"'] }";
	});	
	var simpleCustomerJSONString = "{rows:["+data+"]}";
	
	return simpleCustomerJSONString;
}
