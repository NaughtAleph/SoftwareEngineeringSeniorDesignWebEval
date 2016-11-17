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
	var row = {	"A":"title",
			"B":"members",
			"C":"description",
			"D":"advisors",
			"E":"department",
			"F":"session",
			"G":"room",
			"H":"number"};
	var presentations = [];
	var keys = [];
	for (var key in worksheet) {
		keys.push(key);
	}
	keys.sort();
	var r = range(2, parseInt(keys[keys.length-1].match(/\d+/)[0])+1);
	var sessions = [];
	for (var i in r) {
		var ses = worksheet["F"+r[i]].v;
		if ($.inArray(ses, sessions) < 0)
			sessions.push(ses);
	}
	$.get("php/get_keys.php", {num:sessions.length, s: sessions}, function(data) {
		//$.get("php/download_keys.php",{data: data}, function(data) {
		//	console.log(data);	
		//});
		if (data == "die") {
			alert("Something went wrong. Try again");
			return;
		}
		var keys = $.parseJSON(data);
		var keys_c = $.parseJSON(data);
		var sess_info = {};
		for (var i in r) {
			var key = worksheet["F"+r[i]].v;
			var val = keys[key];
			presentations.push({
				"title":worksheet["A"+r[i]].v,
				"members":worksheet["B"+r[i]].v.split(/ *, */),
				"advisors":worksheet["D"+r[i]].v.split(/ *, */),
				"department":worksheet["E"+r[i]].v,
				"number":worksheet["H"+r[i]].v,
				"key":val
			});
			if (key in keys_c) {
				sess_info[val] = {
					"session":key,
					"room":worksheet["G"+r[i]].v
				}
				delete keys_c[key]
			}
		}
		$.get("php/set_presentations.php", {data:'{"presentations":'+JSON.stringify(presentations)+',"sessioninfo":'+JSON.stringify(sess_info)+"}"}, function(data) {
			alert("File uploaded Successfully!");
		});
	});
}

function range(start, end) {
	var array = new Array();
	for (var i=start; i<end; i++)
		array.push(i);
	return array;
}
