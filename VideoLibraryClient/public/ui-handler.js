$(document).ready(function($) {
    
});

function enableDisableMember(id) {
    if(confirm('Do you want to ' + $(id).text() + ' member?')) {
        var data = {user_login_id : id.id};
        if($(id).text() === 'Enable') {
            $.ajax({
                type: 'POST',
                url: '/enableMember',
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).done(function(response) {
                alert(response.message);
                $(id).text('Delete');
            }).error(function(response) {
                displayErrorMessage(response);
            });
        } else {
            $.ajax({
                type: 'POST',
                url: '/deleteMember',
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).done(function(response) {
                alert(response.message);
                $(id).text('Enable');
            }).error(function(response) {
                displayErrorMessage(response);
            });
        }
    }
}

$(document).on('click', '#my_account', function(e) {
    e.preventDefault();
    loadEditMemberInfo();
});

$(document).on('click', '#save_member_info', function(e) {
    e.preventDefault();
    
    var zip = zipcode1.value;
    if(zipcode2.value.length > 0) {     // ZIP code 2 is optional
        zip += '-' + zipcode2.value;
    }
    
    var data = {};
    data[FIRST_NAME] = firstname.value;
    data[LAST_NAME] = lastname.value;
    data[PASSWORD] = password.value;
    data[SSN] = ssn.value;
    data[STREET] = street.value;
    data[CITY] = city.value;
    data[STATE] = $('#state').val();
    data[ZIP] = zip;

    $.ajax({
        type: 'POST',
        url: '/editPersonInfo',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function(response) {
        alert(response.message);
    }).error(function(response) {
        displayErrorMessage(response);
    });
});


$(document).on('click', '#edit_information', function(e) {
    e.preventDefault();
    loadEditMemberInfo();
});

function loadEditMemberInfo() {
    $.ajax({
        type: 'POST',
        url: '/getMemberInfo',
    }).done(function(response) {
        var person = response.persons[0];
        $.ajax({
            type: 'POST',
            url: '/getStateAndMembershipDetails',
        }).done(function(stateMembershipRes) {
            $("#main-content").load( "UserAccount.ejs", {data : stateMembershipRes, selection : person[CODE]}, function(res, status, xhr) {
                firstname.value = person[FIRST_NAME];
                lastname.value = person[LAST_NAME];
                password.value = person[PASSWORD];
                street.value = person[STREET];
                city.value = person[CITY];
                ssn.value = person[SSN];
                
                var zipCode = person[ZIP_CODE];
                var indexOfDash = zipCode.indexOf("-");
                if(indexOfDash != -1) {
                    zipcode1.value = zipCode.substring(0, indexOfDash);
                    zipcode2.value = zipCode.substring(indexOfDash + 1, zipCode.length);
                } else {
                    zipcode1.value = zipCode;
                }
            });
        }).error(function(response) {
            displayErrorMessage(response);
        });
        
    }).error(function(response) {
        displayErrorMessage(response);
    });
}



$(document).on('click', '#sign_up', function(e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/getStateAndMembershipDetails',
    }).done(function(response) {
        $("#main-content").load( "SignUp.ejs", {data : response}, function(response, status, xhr) {
        });
    }).error(function(response) {
        displayErrorMessage(response);
    });
});

$(document).on('click', '#sign_in', function(e) {
    e.preventDefault();
    $("#main-content").load("SignIn.ejs", function(response, status, xhr) {
    });
});

$(document).on('click', '#members', function(e) {
    e.preventDefault();
    $('#main-content').load( "Members.ejs", function(response, status, xhr) {
    });
});

$(document).on('click', '#sign_out', function(e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/signOut',
    }).done(function(response) {
        alert(response.message);
        location.reload();
    }).error(function(response) {
        displayErrorMessage(response);
    });});

$(document).on('click', '#home', function(e) {
    e.preventDefault();
    location.reload();
});

$(document).on('click', '#movies', function(e) {
    e.preventDefault(); 
    $('#main-content').load("Movies.ejs", function(response, status, xhr) {     
    }); 
});

$(document).on('click', '#no_login_movie', function(e) {
    e.preventDefault(); 
    $('#main-content').load("NoLoginMovies.ejs", function(response, status, xhr) {      
    }); 
});

$(document).on('click', '.all_movie', function(e) {
    e.preventDefault(); 
    $('#main-content').load("Movies.ejs", function(response, status, xhr) {     
    }); 
});

$(document).on('click', '#my_account', function(e) {
    e.preventDefault(); 
    $('#main-content').load("viewUserInfo.ejs", function(response, status, xhr) {       
    }); 
});


$(document).on('click', '.view_info', function(e) {
    e.preventDefault(); 
    $('#main-content').load("viewUserInfo.ejs", function(response, status, xhr) {       
    }); 
});

$(document).on('click', '.edit_info', function(e) {
    e.preventDefault(); 
    $('#main-content').load("editUserInfo.ejs", function(response, status, xhr) {       
    }); 
});

$(document).on('click', '.bill_generate', function(e) {
    e.preventDefault();     
    $.ajax({
        type: 'POST',
        url: '/generateBillForCustomer',
    }).done(function(response) {
        $('#user_account_contents').load("generateBill.ejs", function(res, status, xhr) {
            if(response[BILL_AMOUNT] == null || response[BILL_AMOUNT] == 0) {
                $('#amount_due').text('$ ' + 0);
                $('#amount_due').val(0);
                $('#load_pay_screen').hide();
            } else {
                $('#amount_due').text('$ '+ response[BILL_AMOUNT]);
                $('#amount_due').val(response[BILL_AMOUNT]);
                $('#load_pay_screen').show();
            }
            $('#amount_due_message').text(response[MESSAGE]);
        });
    }).error(function(response) {
        displayErrorMessage(response);
    });
    
});

$(document).on('click', '#load_pay_screen', function(e) {
	e.preventDefault();	
	$.ajax({
        type: 'POST',
        url: '/getMemberInfo',
    }).done(function(response) {
        var person = response.persons[0];
        var paymentInfo = {};
        paymentInfo["person_id"] = person.person_id;
        paymentInfo["amount_due"] = $('#amount_due').val();
        $('#user_account_contents').load("Payment.ejs", {data: paymentInfo}, function(response, status, xhr) {		
    	});	
    }).error(function(response) {
        displayErrorMessage(response);
    });
});

$(document).on('click', '#payment_done', function(e) {
	e.preventDefault();	
	var payment_data = {};
	
	payment_data["person_id"] = $('#person_id').val();
	payment_data["bill_amount"] = $('#bill_amount').val();
	
	$.ajax({
        type: 'POST',
        url: '/payBill',
        data: JSON.stringify(payment_data),
        contentType: 'application/json'
    }).done(function(response) {
        alert(JSON.stringify(response.message));
    }).error(function(response) {
        displayErrorMessage(response);
    });
});

$(document).on('click', '.issue_movie', function(e) {
    e.preventDefault(); 
    $('#main-content').load("issueMovies.ejs", function(response, status, xhr) {        
    }); 
});

$(document).on('click', '.submit_movie', function(e) {
    e.preventDefault(); 
    $('#main-content').load("submitMovies.ejs", function(response, status, xhr) {        
    }); 
});


$(document).on('click', '.movie_member', function(e) {
    e.preventDefault(); 
    $('#main-content').load("moviesOfMembers.ejs", function(response, status, xhr) {        
    }); 
});

$(document).on('click', '#my_movies', function(e) {
    e.preventDefault(); 
    $.ajax({
        type: 'POST',
        url: '/getMemberInfo',
    }).done(function(response) {
        var person = response.persons[0];
        var data = {};
        data[PERSON_ID] = person.person_id;        
        $.ajax({
            type: 'POST',
            url: '/listMoviesIssuedToPerson',
            data: JSON.stringify(data),
	        contentType: 'application/json'
        }).done(function(response) {
        	
        	if((response.movies).length==0)
        	{
        		response.movies = null;
        	}        	
            $('#main-content').load("viewMyMovie.ejs", {data: response.movies}, function(response, status, xhr) {        
            });	
        }).error(function(response) {
            displayErrorMessage(response);
        });                
    }).error(function(response) {
        displayErrorMessage(response);
    });
    
    
});

$(document).on('click', '#signinButton', function(e) {
    e.preventDefault();
    var data = {};
    data[EMAIL] = email.value;
    data[PASSWORD] = password.value;
    $.ajax({
        type: 'POST',
        url: '/signIn',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function(response) {
        location.reload();
        manageHeader('admin@admin.com');
    }).error(function(response) {
        displayErrorMessage(response);
    });
});

$(document).on('click', '#signupButton', function(e) {
    e.preventDefault();

    var zip = zipcode1.value;
    if(zipcode2.value.length > 0) {     // ZIP code 2 is optional
        zip += '-' + zipcode2.value;
    }
    
    var data = {};
    data[FIRST_NAME] = firstname.value;
    data[LAST_NAME] = lastname.value;
    data[EMAIL] = email.value;
    data[PASSWORD] = password.value;
    data[SSN] = ssn.value;
    data[STREET] = street.value;
    data[CITY] = city.value;
    data[STATE] = $('#state').val();
    data[ZIP] = zip;
    data[MEMBERSHIP_TYPE_ID] = $('#membership_type').val();
    
    $.ajax({
        type: 'POST',
        url: '/signUp',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function(response) {
        alert(response.message);
        $('#state').val(0);
        $('#membership_type').val(0);
        firstname.value = "";
        lastname.value = "";
        email.value = "";
        password.value = "";
        ssn.value = "";
        street.value = "";
        city.value = "";
        zipcode1.value = "";
        zipcode2.value = "";
    }).error(function(response) {       
        displayErrorMessage(response);
    });
});

$(document).on('click', '.create_movie', function(e) {
    e.preventDefault(); 
    
    $.ajax({
        type: 'POST',
        url: '/getAllCategories',
    }).done(function(response) {
        $("#main-content").load( "CreateMovie.ejs", {data : response}, function(response, status, xhr) {
        });
    }).error(function(response) {
        displayErrorMessage(response);
    });
});


var categories = [];

$(document).on('click', 'div.chosen-drop ul li', function(e) {
    categories.push($(this).attr('id'));
});


//  add_movie_button

$(document).on('click','#issue_movie_button',function(e){
    e.preventDefault();
    var data = {};
    data[PERSON_ID] = $("input.member_id").val();
    data[MOVIE_ID] = $("input.movie_id").val();
    
    if(data[MOVIE_ID]!="" && data[PERSON_ID]!="")
    {      	
        $.ajax({
            type : 'POST',
            url : '/issueMovie',
             data: JSON.stringify(data),
             contentType: 'application/json'
        }).done(function(response) {
        	alert(response.message);
        	$(".issue_movie").trigger("click");
                data[PERSON_ID] = "";
                data[MOVIE_ID] = "";
        }).error(function(response) {
            displayErrorMessage(response);
        });
    }
    else
    {
        alert("Select a movie or person");
        $(".issue_movie").trigger("click");
    }
});

//Submit movie

$(document).on('click','#submit_movie_button',function(e){
	e.preventDefault();
    var data = {};
    data[ISSUED_MOVIE_ID] = $("input.movie_id_submit").val();
    
    if(data[ISSUED_MOVIE_ID]!="")
    {      	
        $.ajax({
            type : 'POST',
            url : '/submitMovie',
             data: JSON.stringify(data),
             contentType: 'application/json'
        }).done(function(response) {
        	alert(response.message);
        	$(".submit_movie").trigger("click");
        	data[PERSON_ID] = "";
            data[MOVIE_ID] = "";
        }).error(function(response) {
            displayErrorMessage(response);
        });
    }
    else
    {
        alert("Select a movie or person");
        $(".submit_movie").trigger("click");
    }
});

//add_movie_button

$(document).on('click', '#add_movie_button', function(e) {
    e.preventDefault();
    var data = {};
    var array = new Array();
    data[MOVIE_NAME] = movie_name.value;
    data[BANNER] = banner.value;
    data[RELEASE_DATE] = release_date.value;
    data[RENT_AMOUNT] = rent_amount.value;
    data[AVAILABLE_COPIES] = available_copies.value;
    data[CATEGORIES] = new Array();
    data[CATEGORIES] = categories;
    
    
    $.ajax({
        type: 'POST',
        url: '/createMovie',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function(response) {
        alert(response.message);
        movie_name.value = "";
        banner.value = "";
        release_date.value = "";
        rent_amount.value = "";
        available_copies.value = "";
        categories = [];
    }).error(function(response) {
        alert(response);
        displayErrorMessage(response);      
    });
});

// 
$(document).on('click', '.create_movie', function(e) {
    e.preventDefault(); 
    
    $.ajax({
        type: 'POST',
        url: '/getAllCategories',
    }).done(function(response) {
        $("#main-content").load( "CreateMovie.ejs", {data : response}, function(response, status, xhr) {
        });
    }).error(function(response) {
        displayErrorMessage(response);
    });
});


var edit_movie_categories = [];

$(document).on('click',"select#movie_category option",function(e){
    edit_movie_categories.push($(this).attr('id'));
});


//  edit_movie
$(document).on('click', '#save_movie_changes_button', function(e) {
    e.preventDefault();
    var data = {};
    var array = new Array();
    data[MOVIE_ID] = movie_id.value;
    data[MOVIE_NAME] = movie_name.value;
    data[BANNER] = banner.value;
    data[RELEASE_DATE] = release_date.value;
    data[RENT_AMOUNT] = rent_amount.value;
    data[AVAILABLE_COPIES] = available_copies.value;
    data[CATEGORIES] = new Array();
    
    data[CATEGORIES] = edit_movie_categories;
    
    $.ajax({
        type: 'POST',
        url: '/editMovie',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function(response) {
        alert(response.message);
        movie_name.value = "";
        banner.value = "";
        release_date.value = "";
        rent_amount.value = "";
        available_copies.value = "";
        edit_movie_categories = [];
    }).error(function(response) {
        alert(response);
        displayErrorMessage(response);      
    });
    
});


function displayErrorMessage(response) {
    var errorMsg = "";
    var errorsArray = response.responseJSON.errors;
    for(var i = 0; i < errorsArray.length; i++) {
        errorMsg += "\n\n- " + errorsArray[i];
    }
    alert(errorMsg);
}

function manageHeader(email) {
    if(email) {
        $('#sign_up').hide();
        $('#sign_in').hide();
        $('#about_us').hide();
        $('#contact_us').hide();
        $('#members').show();
        $('#movies').show();
        $('#sign_out').show();
    }
}
