var $_GET = {};
var presentations = [];
var current_pres = [];
var session_info = {};
var departments = [];
var sessions = [];
var prop = "title";
var adcending = false;

/* Get the $_GET variable from the url */
document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }
    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

/* If the admin wants to go back to their homepage */
$("#Back").click(function() {
	window.location = "admin.html";
});

/* Make sure the user is a logged in admin */
$.get('php/check_login.php', function(data) {
	if (data == "new" || data == "no") window.location = "login.html";
});

/* Populate the search table with all the presentations from the given year */
$.get('php/get_all_presentations_admin.php', {year: $_GET["year"]}, function(data) {
	if (data == "die")
		window.location = "admin.html";
	data = JSON.parse(data);
	session_info = data["sessioninfo"];
	presentations = data["presentations"];
	current_pres = presentations;
	var plen = presentations.length;

	/* Set the session for each presentation, and then sort the array of members */
	for (var i=0; i<plen; i++) {
		presentations[i]["session"] = session_info[presentations[i]["key"]]["session"];
		presentations[i]["members"].sort();
	}
	current_pres = presentations;

	/* Display results sorted by title */
	sort_results("title", true);
});

/* 
 * This function resets the search results with the given results
 *
 * @param results: The results to insert into the search table
 */
function update_results(results) {
	current_pres = results;

	/* Remove everything except the header rows */
	$("tr").not($(".perm")).remove();
	$("option").not($(".perm")).remove();

	/* Add rows to the search table */
	var rlen = results.length;
	for (var i=0; i<rlen; i++) {
		$("#search-table").append("<tr id='"+i+"'></tr>");
		$("#"+i).append("<td id='title"+i+"'></td><td id='presenters"+i+"'></td><td id='dept"+i+"'></td><td id='sess"+i+"'></td><td><button id='download"+i+"' class='centerbutton btn btn-primary' id='button"+i+"'>Download</button></td>");
		$("#title"+i).text(results[i]['title']);
		$("#presenters"+i).text(name2string(results[i]["members"]));
		$("#dept"+i).text(results[i]["department"]);
		var session = session_info[results[i]["key"]]["session"]
		$("#sess"+i).text(session);

		if ($.inArray(results[i]["department"], departments) < 0) {
			departments.push(results[i]["department"]);
		}
		if ($.inArray(session, sessions) < 0) {
			sessions.push(session);
		}
		set_download_func(i, results);
	}
	
	/* Sort the departments before putting them in the dropdown menu */
	departments.sort();
	var dlen = departments.length;
	for (var i=0; i<dlen; i++) {
		var string = $("<div/>").html(departments[i]).text();
		$("#dept").append("<option value='"+string+"'>"+string+"</option>");
	}

	/* Sort the sessions before putting them in the dropdown menu */
	sessions.sort();
	var slen = sessions.length;
	for (var i=0; i<slen; i++) {
		var string = $("<div/>").html(sessions[i]).text();
		$("#sess").append("<option value='"+string+"'>"+string+"</option>");
	}
}

/*
 * This function defines the download button for each entry in the search table
 * If this is called, then a pdf will be downloaded
 *
 * @param i: the id of the presentation that is to be downloaded
 * @param results: the array of currently displayed presentations
 */
function set_download_func(i, results) {
	$("#download"+i).click(function() {
		/* Get the information for the presentation we want to download */
		$.get("php/get_presentation.php",
			{year:$_GET["year"],key:results[i]["key"], num:results[i]["number"]},
			function(data) {
				/* Generate and save the pdf */
				var doc = generate_pdf(data);
				doc.save($("#title"+i).text() + ".pdf");
			}
		);
	});
}

/*
 * This function generates the pdf
 *
 * @param data: the presentation score and information
 *
 * @return the jsPDF document that can be saved
 */
function generate_pdf(data) {
	data = JSON.parse(data);

	/* Create and the jsPDF document and sets the font */
	var doc = new jsPDF();
	doc.setFontSize(12);
	doc.setFont("times");
	doc.setFontType("bold");
	var pwidth = doc.internal.pageSize.width;
	var cur_line = 20;
	var lines = "";

	/* PREAMBLE */
	doc.text("Santa Clara University", pwidth/2, cur_line+=5, 'center');
	doc.text("School of Engineering Senior Design Conference Project", pwidth/2, cur_line+=5, 'center');
	doc.text("PROJECT EVALUATION FORM", pwidth/2, cur_line+=7.5, 'center');
	doc.text("Session:", 15, cur_line+=7.5).setFontType("normal").text(data["session"], 50, cur_line).setFontType("bold");
	doc.text("Room #:", 15, cur_line+=5).setFontType("normal").text(data["room"], 50, cur_line).setFontType("bold");
	doc.text("Project Title:", 15, cur_line+=7.5).setFontType("normal");
		line = doc.splitTextToSize(data["title"], pwidth-65);
		doc.text(line, 50, cur_line).setFontType("bold");
		cur_line += 5 * (line.length - 1);
	doc.text("Group Members:", 15, cur_line+=5).setFontType("normal");
		line = doc.splitTextToSize(data["members"], pwidth-65);
		doc.text(line, 50, cur_line).setFontType("bold");
		cur_line += 5 * (line.length - 1);
	doc.text("Advisors:", 15, cur_line+=5).setFontType("normal");
		line = doc.splitTextToSize(data["advisors"], pwidth-65);
		doc.text(line, 50, cur_line).setFontType("bold");
		cur_line += 5 * (line.length - 1);
	doc.text("Senior engineering design projects and presentations are evaluated with the following system:", 15, cur_line+=12.5);
	doc.setFontType("normal");
	doc.text("5 = Excellent (at the level of an entry-level engineer you would hire)", 25, cur_line+=5);
	doc.text("4 = Good (at the level of an accomplished college senior)", 25, cur_line+=5);
	doc.text("3 = Average (at the level typical of a college student)", 25, cur_line+=5);
	doc.text("2 = Below Average (not up to the expectations for a college senior)", 25, cur_line+=5);
	doc.text("1 = Poor (significant errors or omissions)", 25, cur_line+=5);
	doc.text("N/A if no appropriate score applies", 25, cur_line+=5);

	/* Create and add the first jsPDF-AutoTable */
	var columns = ["Design Project"].concat(data["judges"]);
	var rows = [
		["Technical Accuracy"].concat(data["scores"][0]),
		["Creativity and Innovation"].concat(data["scores"][1]),
		["Supporting Analytical Work"].concat(data["scores"][2]),
		["Methodical Design Process Demonstrated"].concat(data["scores"][3]),
		["Addresses Project Complexity Appropriately"].concat(data["scores"][4]),
		["Expectation of Completion (by term's end)"].concat(data["scores"][5]),
		["Design & Analysis of Tests"].concat(data["scores"][6]),
		["Quality of Response during Q&A"].concat(data["scores"][7])
	];
	cell_padding = 1;
	doc.autoTable(columns, rows, {
		headerStyles: {
			fillColor: [204,204,204],
			textColor: 20
		},
		styles: {
			cellPadding: cell_padding,
			font: 'times',
			overflow: 'linebreak',
			halign: 'center',
			rowHeight: 11.5
		},
		tableWidth: pwidth,
		margin: 15,
		startY: cur_line+=10,
		drawRow: function(row, data) {
			var num_lines = data["row"]["height"] / 11.5;
			data["row"]["height"] = num_lines*4 + cell_padding*2;
		},
		drawHeaderRow: function(row, data) {
			var num_lines = data["row"]["height"] / 11.5;
			data["row"]["height"] = num_lines*4 + cell_padding*2;
		},
		drawCell: function(cell, data) {
			var num_lines = (cell["height"] - 2*cell_padding) /4;
			if (cell["raw"] == "N/A" || $.isNumeric(cell["raw"]) || cell["raw"] == "unscored")
				cell["textPos"]["y"] += (num_lines - 1) * 2
		}
	});

	doc.addPage();
	cur_line = 20;
	for (var i=0; i<data["considerations"].length; i++) {
		data["considerations"][i] = data["considerations"][i].join("\n");
	}

	/* Create and add the second jsPDF-AutoTable */
	var columns = ["Presentation"].concat(data["judges"]);
	var rows = [
		["Organization"].concat(data["scores"][8]),
		["Use of Allotted Time"].concat(data["scores"][9]),
		["Visual Aids"].concat(data["scores"][10]),
		["Confidence and Poise"].concat(data["scores"][11]),
		["Totals"].concat(data["totals"]),
		["Considerations"].concat(data["considerations"]),
	];
	var table2 = doc.autoTable(columns, rows, {
		headerStyles: {
			fillColor: [204,204,204],
			textColor: 20
		},
		styles: {
			cellPadding: cell_padding,
			font: 'times',
			overflow: 'linebreak',
			halign: 'center',
			rowHeight: 11.5
		},
		tableWidth: pwidth,
		margin: 15,
		startY: cur_line,
		drawRow: function(row, data) {
			var num_lines = data["row"]["height"] / 11.5;
			data["row"]["height"] = num_lines*4 + cell_padding*2;
			if (row["cells"][0]["raw"] == "Totals") {
				for (var k in row['cells']) {
					if ($.isNumeric(k)) {
						row['cells'][k]['styles']['fontStyle'] = 'bold';
						row['cells'][k]['styles']['textColor'] = 20;
					}
				}
			}
		},
		drawHeaderRow: function(row, data) {
			var num_lines = data["row"]["height"] / 11.5;
			data["row"]["height"] = num_lines*4 + cell_padding*2;
		},
		drawCell: function(cell, data) {
			var num_lines = (cell["height"] - 2*cell_padding) /4;
			if (cell["raw"] == "N/A" || $.isNumeric(cell["raw"]) || cell["raw"] == "unscored")
				cell["textPos"]["y"] += (num_lines - 1) * 2
		}
	});
	cur_line = table2.autoTableEndPosY();

	/* Add the comments after the second table */
	doc.setFontType("bold").text("Comments:", 15, cur_line+=10);
	doc.setFontType("normal");
	for (var i=0; i<data['judges'].length; i++) {
		doc.setFontType("italic").text(data['judges'][i]+":", 15, cur_line+=7.5).setFontType("normal");
		var comment_lines = doc.splitTextToSize(data["comments"][i], pwidth-45);
		doc.text(comment_lines, 30, cur_line+=5);
		cur_line += 5 * (comment_lines.length - 1);
	}
	return doc;
}

/*
 * Helper function to combine an array of names into a single, properly formatted string
 *
 * @param names: The array of names
 *
 * @return The string of properly formatted names
 */
function name2string(names) {
	var nae_str = "";
	var nlen = names.length;
	if (nlen > 0)
		name_str = names[0];
	for (var i=1; i<nlen; i++) {
		name_str += ", " + names[i];
	}
	return name_str;
}

/* Search functionality defined here */
$("#title-search").keyup(function() {
	search($("#title-search").val(), $("#presenter-search").val(), $("#dept").val(), $("#sess").val());
});

$("#presenter-search").keyup(function() {
	search($("#title-search").val(), $("#presenter-search").val(), $("#dept").val(), $("#sess").val());
});

$("#dept").change(function() {
	search($("#title-search").val(), $("#presenter-search").val(), $("#dept").val(), $("#sess").val());
});

$("#sess").change(function() {
	search($("#title-search").val(), $("#presenter-search").val(), $("#dept").val(), $("#sess").val());
});
/* End search functionality definition */

/*
 * This function searches through the presentations when the user tries to search
 * Could be optimized if we only search through the currently displayed presentations if the keyup is not backspace or enter
 *
 * @param title: The title they are searching for
 * @param pres: The presenter that they are searching for
 * @param dept: The department that they are searching for
 * @param sess: The session that they are searching for
 */
function search(title, pres, dept, sess) {
	cur_pres = [];
	var plen = presentations.length;
	for (var i=0; i<plen; i++) {
		/* Compare the title first */
		if (title != "") {
			if (presentations[i]["title"].toLowerCase().indexOf(title.toLowerCase()) < 0)
				continue;
		}

		/* Then compare the presenters */
		if (pres != "") {
			var flag = 1;
			for (var j=0; j<presentations[i]["members"].length; j++) {
				if (presentations[i]["members"][j].toLowerCase().indexOf(pres.toLowerCase()) >= 0)
					flag = 0;
			}
			if (flag)
				continue;
		}

		/* Then compare the department */
		if (dept != "none") {
			if (presentations[i]["department"] != dept)
				continue;
		}

		/* Then compare the session */
		if (sess != "none") {
			if (session_info[presentations[i]["key"]]["session"] != sess)
				continue;
		}

		/* If all of them match, add it to the array to be displayed later */
		cur_pres.push(presentations[i]);
	}
	update_results(cur_pres);
	/* Set the dropdowns */
	$("#dept").val(dept);
	$("#sess").val(sess);
}

/*
 * This function sorts the currently displayed results depending on which sort option is selected
 *
 * @param prop: The property to sort by
 * @param asc: Ascending or Descending
 */
function sort_results(prop, asc) {
	/* Sort function defined here */
	current_pres = current_pres.sort(function(a,b) {
		if (asc) {
			return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
		} else {
			return (a[prop] < b[prop]) ? 1 : ((a[prop] > b[prop]) ? -1 : 0);
		}
	});
	ascending = asc;
	update_results(current_pres);
}

/* Sort functionality defined here */
$("#title_title").click(function () {
        sort_results("title", !ascending);
});

$("#title_presenters").click(function () {
        sort_results("members", !ascending);
});

$("#title_dept").click(function () {
        sort_results("department", !ascending);
});

$("#title_sess").click(function () {
        sort_results("session", !ascending);
});
