$("#login").click(function(){
	window.location = "login.html"
});

$.get('php/check_session.php', function(data) {
	if (data == "no") {
		$("#errormessage").html("Invalid session key");
	}
});
