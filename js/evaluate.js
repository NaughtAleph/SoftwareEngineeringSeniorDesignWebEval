var presentations = [];
var session_info = '';
var judge = '';
var scores = [];
var scoring = ["tec_acc","cre_ino","sup_ana","des_pro","pro_com","exp_com","des_ana","res_qa","org","all_tim","vis_aid","con_poi"];

$("#login").click(function(){
	window.location.href = "login.html"
});

function evaluate(clicked) {
	//$(clicked).css("background","#393");
	pres = presentations[clicked.id];
	$("body").append("<div id='fade'></div>");
	$("#fade").click(function() {
		save_form(clicked);
	});

	$("body").append("<div id='form'></div>");
	$("#form").append("<div id='proj_info'></div>");
	$("#form").append("<div id='information'></div>");
	populate_info(clicked);
	$("#form").append("<div id='input'></div>");
	populate_form(clicked);

	if ($(window).width() < 700) {
		$("#form").css("left","0")
		$("#form").css("margin-left","0")
	} else if ($(window).width() < 720 && $("body").height() > $(window).height()) {
		$("#form").css("left","0")
		$("#form").css("margin-left","0")
	}
	$("#fade").fadeIn("slow", function() {
		console.log("done");
	});
	$("#form").fadeIn("slow", function() {
		console.log("done");
	});
}

$(window).resize(function() {
	if ($(window).width() < 700) {
		$("#form").css("left","0");
		$("#form").css("margin-left","0");
	} else if ($(window).width() < 720 && $("body").height() > $(window).height()) {
		$("#form").css("left","0");
		$("#form").css("margin-left","0");
	} else {
		$("#form").css("left","50%");
		$("#form").css("margin-left","-350px");
	}
});

function populate_info(clicked) {
	var pres = presentations[clicked.id];
	var mem_str = '';
	var mlen = pres["members"].length;
	if (mlen > 0)
		mem_str = pres["members"][0];
	for (var j = 1; j<mlen-1; j++)
		mem_str += ", " + pres["members"][j];
	if (mlen > 2)
		mem_str += ",";
	if (mlen > 1)
		mem_str += " and " + pres["members"][mlen-1];

	var ad_str = '';
	var alen = pres["advisors"].length;
	if (alen > 0)
		ad_str = pres["advisors"][0];
	for (var j = 1; j<alen-1; j++)
		ad_str += ", " + pres["advisors"][j];
	if (alen > 2)
		ad_str += ",";
	if (alen > 1)
		ad_str += " and " + pres["advisors"][alen-1];

	$("#proj_info").append("<div id='judge_name'></div>");
	$("#judge_name").text("Judge: " + judge);
	$("#proj_info").append("<div id='title''></div>");
	$("#title").text("Project Title: " + pres["title"]);
	$("#proj_info").append("<div id='grp'></div>");
	$("#grp").text("Group Members: " + mem_str);
	$("#proj_info").append("<div id='advisors'></div>");
	$("#advisors").text("Advisors: " + ad_str);

	$("#information").html("Please evaluate senior engineering design projects and presentations using the following point system:<div class='tab'>"+
		"\t5 = Excellent (at the level of an entry-level engineer you would hire<br>" +
		"\t4 = Good (at the level of an accomplished college senior)<br>"+
		"\t3 = Average (at the level typical of a college senior)<br>"+
		"\t2 = Below Average (not up to the expectations for a college senior)<br>"+
		"\t1 = Poor (significant errors or omissions)<br>"+
		"\tN/A if no appropriate score applies</div>");
}

function populate_form(clicked) {
	$("#input").append("<div class='form_title'>Design Project</div>");
	$("#input").append("<div id='des_proj'></div>");
	$("#des_proj").append("<table><tr><td class='category'>Technical Accuracy</td>"+
		"<td><input type='radio' name='tec_acc' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='tec_acc' value='1' />1</td>"+
		"<td><input type='radio' name='tec_acc' value='2' />2</td>"+
		"<td><input type='radio' name='tec_acc' value='3' />3</td>"+
		"<td><input type='radio' name='tec_acc' value='4' />4</td>"+
		"<td><input type='radio' name='tec_acc' value='5' />5</td></tr>"+
	"<tr><td class='category'>Creativity and Innovation</td>"+
		"<td><input type='radio' name='cre_ino' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='cre_ino' value='1' />1</td>"+
		"<td><input type='radio' name='cre_ino' value='2' />2</td>"+
		"<td><input type='radio' name='cre_ino' value='3' />3</td>"+
		"<td><input type='radio' name='cre_ino' value='4' />4</td>"+
		"<td><input type='radio' name='cre_ino' value='5' />5</td></tr>"+
	"<tr><td class='category'>Supporting Analytical Work</td>"+
		"<td><input type='radio' name='sup_ana' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='sup_ana' value='1' />1</td>"+
		"<td><input type='radio' name='sup_ana' value='2' />2</td>"+
		"<td><input type='radio' name='sup_ana' value='3' />3</td>"+
		"<td><input type='radio' name='sup_ana' value='4' />4</td>"+
		"<td><input type='radio' name='sup_ana' value='5' />5</td></tr>"+
	"<tr><td class='category'>Methodical Design Process Demonstrated</td>"+
		"<td><input type='radio' name='des_pro' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='des_pro' value='1' />1</td>"+
		"<td><input type='radio' name='des_pro' value='2' />2</td>"+
		"<td><input type='radio' name='des_pro' value='3' />3</td>"+
		"<td><input type='radio' name='des_pro' value='4' />4</td>"+
		"<td><input type='radio' name='des_pro' value='5' />5</td></tr>"+
	"<tr><td class='category'>Addresses Project Complexity Appropriately</td>"+
		"<td><input type='radio' name='pro_com' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='pro_com' value='1' />1</td>"+
		"<td><input type='radio' name='pro_com' value='2' />2</td>"+
		"<td><input type='radio' name='pro_com' value='3' />3</td>"+
		"<td><input type='radio' name='pro_com' value='4' />4</td>"+
		"<td><input type='radio' name='pro_com' value='5' />5</td></tr>"+
	"<tr><td class='category'>Expectation of Completion (by term's end)</td>"+
		"<td><input type='radio' name='exp_com' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='exp_com' value='1' />1</td>"+
		"<td><input type='radio' name='exp_com' value='2' />2</td>"+
		"<td><input type='radio' name='exp_com' value='3' />3</td>"+
		"<td><input type='radio' name='exp_com' value='4' />4</td>"+
		"<td><input type='radio' name='exp_com' value='5' />5</td></tr>"+
	"<tr><td class='category'>Design and Analysis of Tests</td>"+
		"<td><input type='radio' name='des_ana' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='des_ana' value='1' />1</td>"+
		"<td><input type='radio' name='des_ana' value='2' />2</td>"+
		"<td><input type='radio' name='des_ana' value='3' />3</td>"+
		"<td><input type='radio' name='des_ana' value='4' />4</td>"+
		"<td><input type='radio' name='des_ana' value='5' />5</td></tr>"+
	"<tr><td class='category'>Quality of Response During Q&A</td>"+
		"<td><input type='radio' name='res_qa' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='res_qa' value='1' />1</td>"+
		"<td><input type='radio' name='res_qa' value='2' />2</td>"+
		"<td><input type='radio' name='res_qa' value='3' />3</td>"+
		"<td><input type='radio' name='res_qa' value='4' />4</td>"+
		"<td><input type='radio' name='res_qa' value='5' />5</td></tr></table>");
	$("#input").append("<div class='form_title'>Presentation</div>");
	$("#input").append("<div id='pres'></div>");
	$("#pres").append("<table><tr><td class='category'>Organization</td>"+
		"<td><input type='radio' name='org' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='org' value='1' />1</td>"+
		"<td><input type='radio' name='org' value='2' />2</td>"+
		"<td><input type='radio' name='org' value='3' />3</td>"+
		"<td><input type='radio' name='org' value='4' />4</td>"+
		"<td><input type='radio' name='org' value='5' />5</td></tr>"+
	"<tr><td class='category'>Use of Allotted Time</td>"+
		"<td><input type='radio' name='all_tim' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='all_tim' value='1' />1</td>"+
		"<td><input type='radio' name='all_tim' value='2' />2</td>"+
		"<td><input type='radio' name='all_tim' value='3' />3</td>"+
		"<td><input type='radio' name='all_tim' value='4' />4</td>"+
		"<td><input type='radio' name='all_tim' value='5' />5</td></tr>"+
	"<tr><td class='category'>Visual Aids</td>"+
		"<td><input type='radio' name='vis_aid' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='vis_aid' value='1' />1</td>"+
		"<td><input type='radio' name='vis_aid' value='2' />2</td>"+
		"<td><input type='radio' name='vis_aid' value='3' />3</td>"+
		"<td><input type='radio' name='vis_aid' value='4' />4</td>"+
		"<td><input type='radio' name='vis_aid' value='5' />5</td></tr>"+
	"<tr><td class='category'>Confdence and Poise</td>"+
		"<td><input type='radio' name='con_poi' value='N/A' checked='checked' />N/A</td>"+
		"<td><input type='radio' name='con_poi' value='1' />1</td>"+
		"<td><input type='radio' name='con_poi' value='2' />2</td>"+
		"<td><input type='radio' name='con_poi' value='3' />3</td>"+
		"<td><input type='radio' name='con_poi' value='4' />4</td>"+
		"<td><input type='radio' name='con_poi' value='5' />5</td></tr></table>");


	$("#input").append("<div>Please check each of the following considerations that were addressed in the presentation:</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='econ' />Economic</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='envi' />Environmental</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='sust' />Sustainability</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='manu' />Manufactuability</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='ethi' />Ethical</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='hands' />Health and Safety</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='soci' />Social</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='poli' />Political</div>");
	$("#input").append("<div><textarea id='comments' placeholder='Additional comments (Optional)' /></div>");
	$("#input").append("<button id='submit'>Submit</button><button id='cancel'>Cancel</button>");
	$("#submit").click(function() {save_form(clicked);});
	$("#cancel").click(function() {cancel_form();});
	for (var i=0; i<scoring.length; i++) {
		if (isNaN(scores[clicked.id]['values'][i])) continue;
		$("input[name="+scoring[i]+"][value="+scores[clicked.id]['values'][i]+"]").prop('checked',true);
	}
	for (var i=0; i<scores[clicked.id]['considerations'].length; i++) {
		//console.log($("input[value="+scores[clicked.id]['considerations']));
		$("input[value="+scores[clicked.id]['considerations'][i]+"]").prop('checked', true);
	}
	$("#comments").val(scores[clicked.id]["comments"]);
}

function save_form(clicked) {
	//TODO How to change to not use the ids but still keep things in order?
	var cons = $("input[name=addressed]:checked");
	var score = [];
	for (var i=0; i<scoring.length; i++) {
		score.push(parseInt($("input[name="+scoring[i]+"]:checked").val()));
	}
	//add save form
	scores[clicked.id]['values'] = score;
	scores[clicked.id]['considerations'] = [];
	for (var i=0; i<cons.length; i++) {
		scores[clicked.id]['considerations'].push(cons[i].value);
	}
	scores[clicked.id]['comments'] = $("#comments").val();
	check_scores();
	cancel_form();
}

function cancel_form() {
	$("#fade").remove();
	$("#form").remove();
}

function check_scores() {
	return;
	//TODO
	console.log(scores);
	for (var i=0; i<scores.length; i++) {
		if ($.inArray(NaN, scores[i]))
			console.log(true);
		var flag = false;
		for (var j=0; j<scores[i].length; j++) {
			if (isNaN(scores[i][j])) {
				flag = true;
				break;
			}
		}
		if (flag) {
			console.log(i);
			$("#"+i).css("background","f00");
		} else {
			$("#"+i).css("background","393");
		}
	}
}

$.get('php/check_session.php', function(data) {
	if (data == "new" || data == "no") window.location.href = "index.html";
});

$.get('php/get_session_info.php', function(data) {
	if (data != "Not logged in") {
		session_info = JSON.parse(data);
		$("#session").text(session_info['session'] + " - " + session_info['room']);
		$("#judge").append("<input type='text' class='form-control' placeholder='Insert Your Name' id='judgename' autofocus><input id='name' class='btn btn-primary' value='Submit'>");

		$("#name").click(function() {
			judge = $("#judgename").val();
			$.get("php/check_judge.php",{name:judge}, function(data) {
				if (data == "die")
					window.location = "index.html";
				if (data == "no") {
					$("#judge").html("");
					$("#judge").text(judge);
					get_pres();
				} else if (data == "yes") {
					var check = confirm("Your name is already in the system. Perhaps you've already submitted scores?\nIf you would like to continue, overwriting your previous submitted scores, press OK.\nOtherwise, please press cancel and give a different name.")
					if (check) {
						$("#judge").html("");
						$("#judge").text(judge);
						get_pres();
					} else {
						$("#judgename").val("");
					}
				}
			});
		});
	} else {
		window.location.href = "index.html";
	}
});

function get_pres() {
	$.get('php/get_presentations.php', function(data) {
		data = JSON.parse(data);
		data = data["presentations"];
		presentations = data;
		var empty = [];
		for (var i = 0; i<scoring.length; i++) {
			empty.push(NaN);
		}
		for (var i = 0, len = data.length; i<len; i++) {
			scores.push({'values':empty, 'considerations':[],'comments':''});
			$("#presentations").append("<div class='pres' id='"+parseInt(i)+"'></div>");
			$("#"+parseInt(i)).append("<div class='prestitle'>"+parseInt(i+1)+". "+data[i]["title"]+"</div>");
			var members = data[i]["members"];
			var members_string = "";
			var mlen = members.length;
			if (mlen > 0)
				members_string = members[0];
			for (var j = 1; j<mlen-1; j++) {
				members_string += ", " + members[j];
			}
			if (mlen > 2)
				members_string += ",";
			if (mlen > 1)
				members_string += " and " + members[mlen-1];
			$("#"+parseInt(i)).append("<div class='members'>Presenters: "+members_string+"</div>");
			$("#"+parseInt(i)).click(function() {
				evaluate(this);
			});
		}
		$("body").append("<button id='final_submit'>Submit</button>");
		$("#final_submit").click(function() {
			var conf = confirm("Are you sure you want to submit?\nIf you submit any other scores under your same name, they will overwite these ones.");
			if (conf) {
				$.post("php/save_scores.php", {scores: JSON.stringify(scores),name: judge}, function(data) {
					window.location.href = "index.html";
				});
			}
		});
	});
}
