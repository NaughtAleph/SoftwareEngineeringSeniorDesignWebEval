var $_GET = {};
var presentations = [];
var current_pres = [];
var session_info = {};
var departments = [];
var sessions = [];
var prop = "title";
var adcending = false;

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

$.get('php/check_login.php', function(data) {
	if (data == "new" || data == "no") window.location = "login.html";
});

$.get('php/get_all_presentations_admin.php', {year: $_GET["year"]}, function(data) {
	if (data == "die")
		window.location = "admin.html";
	data = JSON.parse(data);
	session_info = data["sessioninfo"];
	presentations = data["presentations"];
	current_pres = presentations;
	var plen = presentations.length;
	for (var i=0; i<plen; i++) {
		presentations[i]["session"] = session_info[presentations[i]["key"]]["session"];
		presentations[i]["members"].sort();
	}
	current_pres = presentations;
	sort_results("title", true);
});

function update_results(results) {
	current_pres = results;
	$("tr").not($(".perm")).remove();
	$("option").not($(".perm")).remove();
	var rlen = results.length;
	for (var i=0; i<rlen; i++) {
		$("#search-table").append("<tr id='"+i+"'></tr>");
		$("#"+i).append("<td id='title"+i+"'></td><td id='presenters"+i+"'></td><td id='dept"+i+"'></td><td id='sess"+i+"'></td><td><button id='download"+i+"' class='centerbutton' id='button"+i+"'>Download</button></td>");
		$("#title"+i).text(results[i]['title']);
		$("#presenters"+i).text(member_string(results[i]["members"]));
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
	
	departments.sort();
	var dlen = departments.length;
	for (var i=0; i<dlen; i++) {
		var string = $("<div/>").html(departments[i]).text();
		$("#dept").append("<option value='"+string+"'>"+string+"</option>");
	}
	sessions.sort();
	var slen = sessions.length;
	for (var i=0; i<slen; i++) {
		var string = $("<div/>").html(sessions[i]).text();
		$("#sess").append("<option value='"+string+"'>"+string+"</option>");
	}
}

function set_download_func(i, results) {
	$("#download"+i).click(function() {
		window.location = "download.php?year="+$_GET["year"]+"&key="+results[i]["key"]+"&num="+results[i]["number"];
	});
}

function member_string(members) {
	var mem_str = "";
	var mlen = members.length;
	if (mlen > 0)
		mem_str = members[0];
	for (var i=1; i<mlen; i++) {
		mem_str += ", " + members[i];
	}
	return mem_str;
}

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


//optimize to have another search function that is called when want to search through currently displayed items
function search(title, pres, dept, sess) {
	cur_pres = [];
	var plen = presentations.length;
	for (var i=0; i<plen; i++) {
		if (title != "") {
			if (presentations[i]["title"].toLowerCase().indexOf(title.toLowerCase()) < 0)
				continue;
		}
		if (pres != "") {
			var flag = 1;
			for (var j=0; j<presentations[i]["members"].length; j++) {
				if (presentations[i]["members"][j].toLowerCase().indexOf(pres.toLowerCase()) >= 0)
					flag = 0;
			}
			if (flag)
				continue;
		}
		if (dept != "none") {
			if (presentations[i]["department"] != dept)
				continue;
		}
		if (sess != "none") {
			if (session_info[presentations[i]["key"]]["session"] != sess)
				continue;
		}
		cur_pres.push(presentations[i]);
	}
	update_results(cur_pres);
	$("#dept").val(dept);
	$("#sess").val(sess);
}

function sort_results(prop, asc) {
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
