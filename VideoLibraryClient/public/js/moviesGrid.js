var mygrid;
var data = {};

function initSearchMoviesGrid(){	
	
	var mygrid = new dhtmlXGridObject('movieGridbox');
	mygrid.setImagePath("imgs/");
	mygrid.setHeader("Movie Name, Category Name, Banner Name, Release Date, Rent Amount, Available Copies");
	mygrid.setInitWidths("100,130,130,130,130,*");
	mygrid.attachHeader("#text_search,#text_filter,#text_filter,#text_filter,#text_filter,#text_filter");
	mygrid.setColAlign("right,left,left,left,left,left");
	mygrid.setColTypes("ro,link,ro,ro,ro,ro");
	mygrid.setColSorting("int,str,str,str,str,int");
	mygrid.enableMultiselect(true);
	mygrid.init();
	mygrid.setSkin("dhx_terrace");
	
	/*function onSelectRow(rId,cInd){
		$(".movie_information").css("display","block");
		$(".movie_default").css("display","none");
	}*/
	
	//============================
	var all_movies= JSON.parse(dhtmlxAjax.getSync('/getAllMovies').xmlDoc.responseText).all_movies;

	var js = eval("("+getJSON(all_movies)+")");
	mygrid.parse(js,"json");
}

function getJSON(moviesCollection){
	var data = "";
	var delete1 = "delete";
	$.each(moviesCollection, function(index, value){
		if(data != ""){
			data = data + ',';
		}
		data = data + "{ id:"+value.id +", data:["+value.id+",'"+value.name+"','"+value.banner+"','"+value.releaseDate+"','"+value.rentAmount+"','"+value.availableCopies+"'] }";
	});
	var moviesJSONString = "{rows:["+data+"]}";
	console.log("--------------"+moviesJSONString);
	return moviesJSONString;
}
