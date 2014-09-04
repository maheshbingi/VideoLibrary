
			$(document).ready(function(){
				
				/* For left Nav bar */
				$("li.create_movie").click(function(){
					$("li.create_movie").addClass("active");
					$("li.all_movie").removeClass("active");
					$("li.issue_movie").removeClass("active");					
				});
				
				$("li.issue_movie").click(function(){
					$("li.issue_movie").addClass("active");
					$("li.all_movie").removeClass("active");
					$("li.create_movie").removeClass("active");	
					alert('Vishal');																					
				});
				
				$("li.all_movie").click(function(){
					$("li.all_movie").addClass("active");
					$("li.issue_movie").removeClass("active");
					$("li.create_movie").removeClass("active");
					alert('allMovies');
					
				});
										
			});