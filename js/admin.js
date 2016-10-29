var presentations = [];
$.get('php/check_login.php', function(data) {
	if (data == "new" || data == "no") window.location.href = "login.html";
});

$.get("php/get_years.php", function(data) {
	data = JSON.parse(data);
	var dlen = data.length;
	for (var i=0; i<dlen; i++) {
		$("#year").append("<option value='"+data[i]+"'>"+data[i]+"</option>");
		$("#report_year").append("<option value='"+data[i]+"'>"+data[i]+"</option>");
	}
});

$.get('php/get_all_presentations.php', function(data) {
	data = JSON.parse(data);
	data = data["presentations"];
	presentations = data;
});


