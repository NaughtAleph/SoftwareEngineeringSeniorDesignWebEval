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

/*$.get('php/get_all_presentations.php', function(data) {
	data = JSON.parse(data);
	data = data["presentations"];
	presentations = data;
});*/


$("#upload_file").click(function() {
	var file = $("#file").prop("files");
	if (file.length == 0) {
		alert("Choose a file please!");
		return;
	}
	file = file[0];
	var reader = new FileReader();
	reader.onload = function() {
		var data = reader.result;
		var workbook = XLSX.read(data, {type: 'binary'});
		upload_worksheet(workbook.Sheets.Sheet1);
	}
	reader.readAsBinaryString(file);
});

function upload_worksheet(worksheet) {
	var row = ["title", "members", "description", "advisors", "department", "session", "room", "number"];
	console.log(worksheet);
	var presentations = [];
	var keys = [];
	for (var key in worksheet) {
		keys.push(key);
	}
	keys.sort();
	var r = range(2, parseInt(keys[keys.length-1].match(/\d+/)[0])+1);
	$.get("php/get_keys.php", {num: r.length}, function(data) {
		console.log(data);
		if (data == "die")
			alert("Something went wrong. Try again");
	});
	for (var i in r) {
		presentations.push({"key":"",
			"title":worksheet["A"+r[i]].v,
			"members":worksheet["B"+r[i]].v.split(/ *, */),
			"advisors":worksheet["D"+r[i]].v.split(/ *, */),
			"department":worksheet["E"+r[i]].v,
			"number":worksheet["H"+r[i]].v
		});
	}
	console.log(presentations);
	return;
	var setup = ["proj_name","members separated by comma","description","advisors","Dept","session","..."];
	
}

function range(start, end) {
	var array = new Array();
	for (var i=start; i<end; i++)
		array.push(i);
	return array;
}
