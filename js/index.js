$("#login").click(function(){
	window.location.href = "login.html"
	// $("body").load("new.html");
});

$.get('php/check_session.php', function(data) {
	if (data == "no") {
		$("#errormessage").html("Invalid session key");
	}
});
