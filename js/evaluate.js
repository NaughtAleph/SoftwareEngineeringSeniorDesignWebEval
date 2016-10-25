var presentations = [];
var session_info = '';
var judge = '';
var scores = [];
var scoring = ["tec_acc","cre_ino","sup_ana","des_pro","pro_com","exp_com","des_ana","res_qa","org","all_tim","vis_aid","con_poi"];

function evaluate(clicked) {
	//$(clicked).css("background","#393");
	pres = presentations[clicked.id];
	$("body").append("<div id='fade'></div>");
	$("#fade").click(function() {
		save_form();
	});

	$("body").append("<div id='form'></div>");
	$("#form").append("<div id='proj_info'></div>");
	$("#form").append("<div id='information'></div>");
	populate_info(clicked);
	$("#form").append("<div id='input'></div>");
	populate_form(clicked);
}

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
		"<td><input type='radio' name='tec_acc' value='1' />1</td>"+
		"<td><input type='radio' name='tec_acc' value='2' />2</td>"+
		"<td><input type='radio' name='tec_acc' value='3' />3</td>"+
		"<td><input type='radio' name='tec_acc' value='4' />4</td>"+
		"<td><input type='radio' name='tec_acc' value='5' />5</td></tr>"+
	"<tr><td class='category'>Creativity and Innovation</td>"+
		"<td><input type='radio' name='cre_ino' value='1' />1</td>"+
		"<td><input type='radio' name='cre_ino' value='2' />2</td>"+
		"<td><input type='radio' name='cre_ino' value='3' />3</td>"+
		"<td><input type='radio' name='cre_ino' value='4' />4</td>"+
		"<td><input type='radio' name='cre_ino' value='5' />5</td></tr>"+
	"<tr><td class='category'>Supporting Analytical Work</td>"+
		"<td><input type='radio' name='sup_ana' value='1' />1</td>"+
		"<td><input type='radio' name='sup_ana' value='2' />2</td>"+
		"<td><input type='radio' name='sup_ana' value='3' />3</td>"+
		"<td><input type='radio' name='sup_ana' value='4' />4</td>"+
		"<td><input type='radio' name='sup_ana' value='5' />5</td></tr>"+
	"<tr><td class='category'>Methodical Design Process Demonstrated</td>"+
		"<td><input type='radio' name='des_pro' value='1' />1</td>"+
		"<td><input type='radio' name='des_pro' value='2' />2</td>"+
		"<td><input type='radio' name='des_pro' value='3' />3</td>"+
		"<td><input type='radio' name='des_pro' value='4' />4</td>"+
		"<td><input type='radio' name='des_pro' value='5' />5</td></tr>"+
	"<tr><td class='category'>Addresses Project Complexity Appropriately</td>"+
		"<td><input type='radio' name='pro_com' value='1' />1</td>"+
		"<td><input type='radio' name='pro_com' value='2' />2</td>"+
		"<td><input type='radio' name='pro_com' value='3' />3</td>"+
		"<td><input type='radio' name='pro_com' value='4' />4</td>"+
		"<td><input type='radio' name='pro_com' value='5' />5</td></tr>"+
	"<tr><td class='category'>Expectation of Completion (by term's end)</td>"+
		"<td><input type='radio' name='exp_com' value='1' />1</td>"+
		"<td><input type='radio' name='exp_com' value='2' />2</td>"+
		"<td><input type='radio' name='exp_com' value='3' />3</td>"+
		"<td><input type='radio' name='exp_com' value='4' />4</td>"+
		"<td><input type='radio' name='exp_com' value='5' />5</td></tr>"+
	"<tr><td class='category'>Design and Analysis of Tests</td>"+
		"<td><input type='radio' name='des_ana' value='1' />1</td>"+
		"<td><input type='radio' name='des_ana' value='2' />2</td>"+
		"<td><input type='radio' name='des_ana' value='3' />3</td>"+
		"<td><input type='radio' name='des_ana' value='4' />4</td>"+
		"<td><input type='radio' name='des_ana' value='5' />5</td></tr>"+
	"<tr><td class='category'>Quality of Response During Q&A</td>"+
		"<td><input type='radio' name='res_qa' value='1' />1</td>"+
		"<td><input type='radio' name='res_qa' value='2' />2</td>"+
		"<td><input type='radio' name='res_qa' value='3' />3</td>"+
		"<td><input type='radio' name='res_qa' value='4' />4</td>"+
		"<td><input type='radio' name='res_qa' value='5' />5</td></tr></table>");
	$("#input").append("<div class='form_title'>Prsentation</div>");
	$("#input").append("<div id='pres'></div>");
	$("#pres").append("<table><tr><td class='category'>Organization</td>"+
		"<td><input type='radio' name='org' value='1' />1</td>"+
		"<td><input type='radio' name='org' value='2' />2</td>"+
		"<td><input type='radio' name='org' value='3' />3</td>"+
		"<td><input type='radio' name='org' value='4' />4</td>"+
		"<td><input type='radio' name='org' value='5' />5</td></tr>"+
	"<tr><td class='category'>Use of Allotted Time</td>"+
		"<td><input type='radio' name='all_tim' value='1' />1</td>"+
		"<td><input type='radio' name='all_tim' value='2' />2</td>"+
		"<td><input type='radio' name='all_tim' value='3' />3</td>"+
		"<td><input type='radio' name='all_tim' value='4' />4</td>"+
		"<td><input type='radio' name='all_tim' value='5' />5</td></tr>"+
	"<tr><td class='category'>Visual Aids</td>"+
		"<td><input type='radio' name='vis_aid' value='1' />1</td>"+
		"<td><input type='radio' name='vis_aid' value='2' />2</td>"+
		"<td><input type='radio' name='vis_aid' value='3' />3</td>"+
		"<td><input type='radio' name='vis_aid' value='4' />4</td>"+
		"<td><input type='radio' name='vis_aid' value='5' />5</td></tr>"+
	"<tr><td class='category'>Confdence and Poise</td>"+
		"<td><input type='radio' name='con_poi' value='1' />1</td>"+
		"<td><input type='radio' name='con_poi' value='2' />2</td>"+
		"<td><input type='radio' name='con_poi' value='3' />3</td>"+
		"<td><input type='radio' name='con_poi' value='4' />4</td>"+
		"<td><input type='radio' name='con_poi' value='5' />5</td></tr></table>");

	$("#input").append("<button id='submit'>Submit</button><button id='cancel'>Cancel</button>");
	$("#submit").click(function() {save_form(clicked);});
	$("#cancel").click(function() {cancel_form();});
	for (var i=0; i<scoring.length; i++) {
		if (isNaN(scores[clicked.id][i])) continue;
		$("input[name="+scoring[i]+"][value="+scores[clicked.id][i]+"]").prop('checked',true);
	}
}

function save_form(clicked) {
	var score = [];
	for (var i=0; i<scoring.length; i++) {
		score.push(parseInt($("input[name="+scoring[i]+"]:checked").val()));
	}
	//add save form
	scores[clicked.id] = score;
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

$.get('php/get_session_info.php', function(data) {
	if (data != "Not logged in") {
		session_info = JSON.parse(data);
		$("#judge").append("<input type='text' placeholder='Insert Your Name' id='judgename'><button id='name'>Submit</button>");

		$("#name").click(function() {
			judge = $("#judgename").val();
			$("#judge").text(judge);
			get_pres();
		});
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
			scores.push(empty);
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
	});
}
