var presentations = [];

/* 
 * Ensure that the person is an admin
 * If not, they are rerouted to the login page
 */
$.get('php/check_login.php', function(data) {
	if (data == "new" || data == "no") window.location.href = "login.html";
});

/* 
 * Get the available years to populate the dropdown menus
 */
$.get("php/get_years.php", function(data) {
	data = JSON.parse(data);
	var dlen = data.length;
	for (var i=0; i<dlen; i++) {
		$("#year").append("<option value='"+data[i]+"'>"+data[i]+"</option>");
		$("#report_year").append("<option value='"+data[i]+"'>"+data[i]+"</option>");
	}
});

/* 
 * If choose to upload a config file, rewrites any config file uploaded for the current year
 */
$("#upload_file").click(function() {
	var file = $("#file").prop("files");

	/* If there is no file */
	if (file.length == 0) {
		alert("Choose a file please!");
		return;
	}
	file = file[0];
	var reader = new FileReader();

	/* The function called when the file is done being read as a binary string */
	reader.onload = function() {
		var data = reader.result;
		var workbook = XLSX.read(data, {type: 'binary'});

		/* Parses and extracts data from the xlsx file and saves it to the config JSON file */
		upload_worksheet(workbook.Sheets.export);
	}
	reader.readAsBinaryString(file);
});

/* 
 * Parses the xlsx worksheet and extracts data to include in the configuration JSON file
 * Then saves the configuration to a file
 *
 * @param worksheet: the given xlsx worksheet in an xlsx.js worksheet format
 */
function upload_worksheet(worksheet) {

	/* Where the information is. Just for reference */
	var row = {	"A":"title",
			"B":"description",
			"C":"session",
			"E":"location",
			"F":"department",
			"G":"num_members",
			"I":"mem1_first",
			"J":"mem1_last",
			"N":"mem2_first",
			"O":"mem2_last",
			"S":"mem3_first",
			"T":"mem3_last",
			"X":"mem4_first",
			"Y":"mem4_last",
			"AC":"mem5_first",
			"AD":"mem5_last",
			"AH":"mem6_first",
			"AI":"mem6_last",
			"AU":"advisor1",
			"AW":"advisor2",
	};

	/* Location of the members, in [First, Last] name pairs */
	var mem_loc = [
		["I","J"],
		["N","O"],
		["S","T"],
		["X","Y"],
		["AC","AD"],
		["AH","AI"]
	]
	var presentations = [];
	var keys = [];
	for (var key in worksheet) {
		keys.push(key);
	}
	keys.sort();

	/* Get an array of all the sessions */
	var r = range(2, parseInt(keys[keys.length-1].match(/\d+/)[0])+1);
	var sessions = [];
	for (var i in r) {
		var ses = worksheet["C"+r[i]].v;
		if ($.inArray(ses, sessions) < 0)
			sessions.push(ses);
	}

	/* Pass the sessions array to a php function which generates (and saves) keys to use for judges */
	$.get("php/get_keys.php", {num:sessions.length, s: sessions}, function(data) {

		/* If the caller is not an admin		*/
		/* Or one of the variables is not passed	*/
		/* Or one of the passed variables is incorrect	*/
		if (data == "die") {
			alert("Something went wrong. Try again");
			return;
		}

		/* returned data is an array of session=>key */
		var keys = $.parseJSON(data);
		/* Copy of keys used to populate the session info part of the presentations.json file */
		var keys_c = $.parseJSON(data);
		var sess_info = {};
		
		var number = 0;
		var previous = "0";

		/* range is a function defined in this file. */
		r = range(2, parseInt(worksheet["!ref"].match(/\d+/g)[1]));

		/* Iterate through rows of worksheet and extract information along the way	*/
		/* Look at the variable 'row' to reference where information is			*/
		for (var i in r) {
			var key = worksheet["C"+r[i]].v;
			var val = keys[key];

			/* MEMBERS */
			var members = [];
			for (j in range(0,worksheet["G"+r[i]].v)) {
				members.push(worksheet[mem_loc[j][0]+r[i]].v + " " + worksheet[mem_loc[j][1]+r[i]].v);
			}

			/* ADVISORS */
			var advisors = [];
			if ("AU"+r[i] in worksheet)
				advisors.push(worksheet["AU"+r[i]].v);
			if ("AW"+r[i] in worksheet)
				advisors.push(worksheet["AW"+r[i]].v);
			
			/* The order of the presentations per session */
			if (previous < worksheet["D"+r[i]].v) {
				previous = worksheet["D"+r[i]].v;
				number++;
			} else {
				previous = "0";
				number = 1;
			}

			/* Now that we have all the info, push it to the presentations array */
			presentations.push({
				"title":worksheet["A"+r[i]].v,
				"members":members,
				"advisors":advisors,
				"department":worksheet["F"+r[i]].v,
				"number":number,
				"key":val
			});

			/* If this is the first time seeing the key, add it and it's room to the session info */
			if (key in keys_c) {
				sess_info[val] = {
					"session":key,
					"room":worksheet["E"+r[i]].v
				}
				delete keys_c[key]
			}
		}

		/* Set the presentations.json file with all the information */
		$.post("php/set_presentations.php", {data:'{"presentations":'+JSON.stringify(presentations)+',"sessioninfo":'+JSON.stringify(sess_info)+"}"}, function(data) {
			if (data == "die")
				alert("There was an issue. Please try again.")
			else
				alert("File uploaded Successfully!");
		});
	});
}

/* Simple helper function to make an array from start to end, incrementing by one
 *
 * @param start: The beginning number of the array
 * @param end: One larger than the last number in the array
 *
 * @return Array of integers from start to end, incrementing by one
 */
function range(start, end) {
	var array = new Array();
	for (var i=start; i<end; i++)
		array.push(i);
	return array;
}
