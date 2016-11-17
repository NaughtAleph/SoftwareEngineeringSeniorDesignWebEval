$.get('php/check_login.php', function(data) {
	if (data == "no") {
		$("#errormessage").html("Invalid login");
	}
});

$("#return").click(function() {
	window.location = "index.html";
});
