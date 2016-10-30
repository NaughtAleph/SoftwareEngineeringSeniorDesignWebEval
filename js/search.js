var $_GET = {};
var presentations = [];
var current_pres = [];
var session_info = {};
var departments = [];
var sessions = [];

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

$.get('php/check_login.php', function(data) {
	if (data == "new" || data == "no") window.location.href = "login.html";
});

$.get('php/get_all_presentations_admin.php', function(data) {
	data = JSON.parse(data);
	session_info = data["sessioninfo"];
	presentations = data["presentations"];
	current_pres = presentations;
	update_results(presentations);

});

function update_results(results) {
	console.log(results);
	$("tr").not($(".perm")).remove();
	$("option").not($(".perm")).remove();
	var rlen = results.length;
	for (var i=0; i<rlen; i++) {
		$("#search-table").append("<tr id='"+i+"'></tr>");
		$("#"+i).append("<td id='title"+i+"'></td><td id='presenters"+i+"'></td><td id='dept"+i+"'></td><td id='sess"+i+"'></td><td><button id='download"+i+"' class='centerbutton'>Download</button></td>");
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
	}
	
	var dlen = departments.length;
	for (var i=0; i<dlen; i++) {
		var string = $("<div/>").html(departments[i]).text();
		$("#dept").append("<option value='"+string+"'>"+string+"</option>");
	}
	var slen = sessions.length;
	for (var i=0; i<slen; i++) {
		var string = $("<div/>").html(sessions[i]).text();
		$("#sess").append("<option value='"+string+"'>"+string+"</option>");
	}
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
	cur_pres = presentations;
	if (title != "") {
		for (var i=0; i<cur_pres.length; i++) {
			if (cur_pres[i]["title"].toLowerCase().indexOf(title.toLowerCase()) < 0) {
				cur_pres = $.grep(cur_pres, function(value) {
					return value != cur_pres[i];
				});
				i--;
			}
		}
	}
	if (pres != "") {
		for (var i=0; i<cur_pres.length; i++) {
			var flag = 1;
			for (var j=0; j<cur_pres[i]["members"].length; j++) {
				if (cur_pres[i]["members"][j].toLowerCase().indexOf(pres.toLowerCase()) >= 0) {
					flag = 0;
				}
			}
			if (flag) {
				cur_pres = $.grep(cur_pres, function(value) {
					return value != cur_pres[i];
				});
				i--;
			}
		}
	}
	if (dept != "none") {
		for (var i=0; i<cur_pres.length; i++) {
			if (cur_pres[i]["department"] != dept) {
				cur_pres = $.grep(cur_pres, function(value) {
					return value != cur_pres[i];
				});
				i--;
			}
		}
	}
	if (sess != "none") {
		for (var i=0; i<cur_pres.length; i++) {
			var session = session_info[cur_pres[i]["key"]]["session"];
			if (session != sess) {
				cur_pres = $.grep(cur_pres, function(value) {
					return value != cur_pres[i];
				});
				i--;
			}
		}
	}
	update_results(cur_pres);
	$("#dept").val(dept);
	$("#sess").val(sess);
}
