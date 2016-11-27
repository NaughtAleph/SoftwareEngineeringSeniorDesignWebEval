/* If the user is a judge, they can click the judge login button */
$("#return").click(function() {
	window.location = "index.html";
});

/* Check if the user has already tried to log in */
$.get('php/check_login.php', function(data) {
	if (data == "no") {
		$("#errormessage").html("Invalid login");
	}
});
