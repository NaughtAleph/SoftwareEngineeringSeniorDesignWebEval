/* If the user is an admin, they can click the login button */
$("#login").click(function(){
	window.location = "login.html"
});

$("input").attr("autocomplete","off");

/* Check if the user has already tried to log in */
$.get('php/check_session.php', function(data) {
	if (data == "no") {
		$("#errormessage").html("Invalid session key");
	}
});
