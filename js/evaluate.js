/* variable presentations holds the presentations to evaluate */
var presentations = [];

/* variable session_info holds the session and room number */
var session_info = '';

/* variable judge holds the judge's name */
var judge = '';

/* variable scores holds the scores for each presentation */
var scores = [];

/* variable scoring used to get each of the values that the judge input */
var scoring = ["tec_acc","cre_ino","sup_ana","des_pro","pro_com","exp_com","des_ana","res_qa","org","all_tim","vis_aid","con_poi"];

/* If the user clicks the login button, they are returned to the login screen */
$("#login").click(function(){
	window.location.href = "login.html"
});

/*
 * This function is called when the user chooses an evaluation to evaluate
 *
 * @param clicked: The div that was clicked on and therefore called this function
 */
function evaluate(clicked) {
	/* Change the background so it doesn't scroll when the user scrolls through the form */
	var nav = $("nav:eq(0)");
	var t = nav.height() +
		parseInt(nav.css("margin-bottom")) +
		parseInt(nav.css("border-bottom-width")) +
		parseInt(nav.css("border-top-width"));
	$(".container:eq(0)").css({
		"position":"fixed",
		"top":t+"px"
	});
	$("nav:eq(0)").css({
		"position":"fixed",
		"top":"0px",
		"width":"100%"
	});

	/* Stop final_submit button functionality so the judge can't tab to use it */
	$("#final_submit").unbind("click");
	$("#final_submit").click(function() {
		alert("Please finish filling out this form and either choose submit or discard before submitting everything");
	});

	pres = presentations[clicked.id];

	/* Add a div to cover up everything from being clicked on */
	$("body").append("<div id='fade'></div>");

	/* Append the form to be populated */
	$("body").append("<div id='form'></div>");
	$("#form").append("<div id='proj_info'></div>");
	$("#form").append("<div id='information'></div>");

	/* Populate the presentation info (title, members, etc.) and the judging instructions */
	populate_info(clicked);
	$("#form").append("<div id='input'></div>");

	/* Populate the presentation with the scoring form */
	populate_form(clicked);

	/* Make sure the form has the right css, depending on the window width */
	if ($(window).width() < 700) {
		$("#form").css("left","0")
		$("#form").css("margin-left","0")
	} else if ($(window).width() < 720 && $("body").height() > $(window).height()) {
		$("#form").css("left","0")
		$("#form").css("margin-left","0")
	}

	/* Make everything fade in, nice and smooth */
	$("#fade").fadeIn("slow", function() {
		/* The best option is to have the form be saved if it is clicked on,	*/
		/* In case they accidentally click on it				*/
		$("#fade").click(function() {
			save_form(clicked);
		});
	});
	$("#form").fadeIn("slow", function() {
		//Nothing needs to be done here, but something may be added
	});
}

/*
 * Changes the css for the form if the window is resized
 * (There was just a problem at the threshold of 700, and when the scroll bar was added)
 */
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

/*
 * Helper function to combine an array of names into a single, properly formatted string
 *
 * @param names: The array of names
 *
 * @return The string of properly formatted names
 */
function names2string(names) {
	var name_str = "";
	var nlen = names.length;
	if (nlen > 0)
		name_str = names[0];
	for (var j = 1; j<nlen-1; j++)
		name_str += ", " + names[j];
	if (nlen > 2)
		name_str += ",";
	if (nlen > 1)
		name_str += " and " + names[nlen-1];
	return name_str;
}

/*
 * The function that populates the presentation information (title, members, advisors, etc.)
 * and the instructions for how the judge is to evaluate the presentation
 *
 * @param clicked: The div that was clicked on and therefore called this function
 */
function populate_info(clicked) {
	var pres = presentations[clicked.id];

	/* Combine the member's names into a single string */
	var mem_str = names2string(pres["members"]);

	/* Combine the advisor's names into a single string */
	var ad_str = names2string(pres["advisors"]);

	/* Append the presentation information */
	$("#proj_info").append("<div id='judge_name'></div>");
	$("#judge_name").text("Judge: " + judge);
	$("#proj_info").append("<div id='title''></div>");
	$("#title").text("Project Title: " + pres["title"]);
	$("#proj_info").append("<div id='grp'></div>");
	$("#grp").text("Group Members: " + mem_str);
	$("#proj_info").append("<div id='advisors'></div>");
	$("#advisors").text("Advisors: " + ad_str);

	/* Append the judging instructions */
	$("#information").html("Please evaluate senior engineering design projects and"+
		"presentations using the following point system:<div class='tab'>"+
		"\t5 = Excellent (at the level of an entry-level engineer you would hire<br>" +
		"\t4 = Good (at the level of an accomplished college senior)<br>"+
		"\t3 = Average (at the level typical of a college senior)<br>"+
		"\t2 = Below Average (not up to the expectations for a college senior)<br>"+
		"\t1 = Poor (significant errors or omissions)<br>"+
		"\tN/A if no appropriate score applies</div>");
}

/*
 * The function that populates the presentation form for evaluation
 * Jeez, this looks ugly.
 *
 * @param clicked: The div that was clicked on and therefore called this function
 */
function populate_form(clicked) {
	$("#input").append("<div class='form_title'>Design Project</div>");
	$("#input").append("<div id='des_proj'></div>");
        $("#des_proj").append("<table><tr><td class='category'>Technical Accuracy &nbsp;</td>"+
                "<td>&nbsp;<input type='radio' name='tec_acc' value='N/A' />&nbsp;N/A &nbsp; &nbsp;&nbsp;</td>"+
                "<td><input type='radio' name='tec_acc' value='1' />&nbsp;1 &nbsp; &nbsp;&nbsp;</td>"+
                "<td><input type='radio' name='tec_acc' value='2' />&nbsp;2 &nbsp; &nbsp;&nbsp;</td>"+
                "<td><input type='radio' name='tec_acc' value='3' />&nbsp;3 &nbsp; &nbsp;&nbsp;</td>"+
                "<td><input type='radio' name='tec_acc' value='4' />&nbsp;4 &nbsp; &nbsp;&nbsp;</td>"+
                "<td><input type='radio' name='tec_acc' value='5' />&nbsp;5 &nbsp; &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Creativity and Innovation &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='cre_ino' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='cre_ino' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='cre_ino' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='cre_ino' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='cre_ino' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='cre_ino' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Supporting Analytical Work &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='sup_ana' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='sup_ana' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='sup_ana' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='sup_ana' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='sup_ana' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='sup_ana' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Methodical Design Process Demonstrated &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='des_pro' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_pro' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_pro' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_pro' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_pro' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_pro' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Addresses Project Complexity Appropriately &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='pro_com' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='pro_com' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='pro_com' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='pro_com' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='pro_com' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='pro_com' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Expectation of Completion (by term's end) &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='exp_com' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='exp_com' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='exp_com' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='exp_com' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='exp_com' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='exp_com' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Design and Analysis of Tests &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='des_ana' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_ana' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_ana' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_ana' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_ana' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='des_ana' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Quality of Response During Q&A &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='res_qa' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='res_qa' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='res_qa' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='res_qa' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='res_qa' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='res_qa' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr></table>");
	$("#input").append("<br><div class='form_title'>Presentation</div>");
	$("#input").append("<div id='pres'></div>");
	$("#pres").append("<table><tr><td class='category'>Organization &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='org' value='N/A' />&nbsp;N/A &nbsp; &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='org' value='1' />&nbsp;1 &nbsp; &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='org' value='2' />&nbsp;2 &nbsp; &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='org' value='3' />&nbsp;3 &nbsp; &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='org' value='4' />&nbsp;4 &nbsp; &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='org' value='5' />&nbsp;5 &nbsp; &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Use of Allotted Time &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='all_tim' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='all_tim' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='all_tim' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='all_tim' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='all_tim' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='all_tim' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Visual Aids &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='vis_aid' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='vis_aid' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='vis_aid' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='vis_aid' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='vis_aid' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='vis_aid' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr>"+
	"<tr><td class='category'>Confdence and Poise &nbsp;</td>"+
		"<td>&nbsp;<input type='radio' name='con_poi' value='N/A' />&nbsp;N/A &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='con_poi' value='1' />&nbsp;1 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='con_poi' value='2' />&nbsp;2 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='con_poi' value='3' />&nbsp;3 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='con_poi' value='4' />&nbsp;4 &nbsp;&nbsp;</td>"+
		"<td><input type='radio' name='con_poi' value='5' />&nbsp;5 &nbsp;&nbsp;</td></tr></table>");

	$("#input").append("<br><div>Please check each of the following considerations that were addressed in the presentation:</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='econ' />&nbsp; Economic</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='envi' />&nbsp; Environmental</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='sust' />&nbsp; Sustainability</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='manu' />&nbsp; Manufactuability</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='ethi' />&nbsp; Ethical</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='hands' />&nbsp; Health and Safety</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='soci' />&nbsp; Social</div>");
	$("#input").append("<div><input type='checkbox' name='addressed' value='poli' />&nbsp; Political</div><br>");
	$("#input").append("<div><textarea class='form-control' id='comments' placeholder='Additional comments (Optional)' rows='4'/></div><br>");
	$("#input").append("<input id='submit' class='btn btn-primary' value='Submit' /><input id='cancel' class='btn btn-default' value='Discard' />");
	$("#submit").click(function() {save_form(clicked);});
	$("#cancel").click(function() {cancel_form();});
	
	/* Populate the form with any scores that were already filled out */
	for (var i=0; i<scoring.length; i++) {
		if (isNaN(scores[clicked.id]['values'][i])) {
			if (scores[clicked.id]["values"][i] == "N/A") {
				$("input[name="+scoring[i]+"][value='"+scores[clicked.id]['values'][i]+"']").prop('checked',true);
				continue;
			}
			else {
				if ($("#"+clicked.id).css("background-color") == "rgb(223, 159, 159)") {
					$(".category:eq("+i+")").css("border", "2px solid rgb(223,159,159)");
				}
				continue;
			}
		}
		$("input[name="+scoring[i]+"][value="+scores[clicked.id]['values'][i]+"]").prop('checked',true);
	}

	/* Add any considerations that were already filled out */
	for (var i=0; i<scores[clicked.id]['considerations'].length; i++) {
		//console.log($("input[value="+scores[clicked.id]['considerations']));
		$("input[value="+scores[clicked.id]['considerations'][i]+"]").prop('checked', true);
	}

	/* Add any comments that were already filled out */
	$("#comments").val(scores[clicked.id]["comments"]);
}

/*
 * This function is called when the user wants to save the form that is currently displayed
 *
 * @param clicked: The div that was clicked on and therefore called this function
 */
function save_form(clicked) {
	var cons = $("input[name=addressed]:checked");
	var score = [];
	for (var i=0; i<scoring.length; i++) {
		/* Get the value of each radio button. null if no button is chosen */
		var val = $("input[name="+scoring[i]+"]:checked").val();
		if (isNaN(val)) {
			if (val == "N/A")
				score.push(val);
			else
				score.push(NaN)
		} else
			score.push(parseInt(val));
	}

	var nanflag = false;
	var allnan = true;
	/* If no score was filled out act as though it was an accidental click and don't change any colors */
	for (var i=0; i<score.length; i++) {
		if (!isNaN(score[i]) || score[i] == "N/A") {
			allnan = false;
			break;
		}
	}
	if (!allnan) {
		/* If there was a radio group that wasn't chosen, then the presentation goes red (incomplete) */
		for (var i=0; i<score.length; i++) {
			if (isNaN(score[i]) && score[i] != "N/A") {
				nanflag = true;
				$("#"+clicked.id).css("background", "#c66");
				break;
			}
		}

		/* If every radio group has a selected element, then the presentation goes green (completed) */
		if (!nanflag)
			$("#"+clicked.id).css("background", "#6c6");
	}
	scores[clicked.id]['values'] = score;
	scores[clicked.id]['considerations'] = [];
	for (var i=0; i<cons.length; i++) {
		scores[clicked.id]['considerations'].push(cons[i].value);
	}
	scores[clicked.id]['comments'] = $("#comments").val();
	cancel_form();
}

/*
 * This function is called when the user wants to discard the changes they ade to the currently displayed form
 */
function cancel_form() {
	/* Nothing has to be saved or checked if they choose to discard changes */
	$("#fade").remove();
	$("#form").remove();
	$(".container:eq(0)").css({
		"position":"inherit",
		"top":"auto"
	});
	$("nav:eq(0)").css({
		"position":"inherit",
		"top":"auto",
		"width":"auto"
	});

	/* Reinitialize the submit button when the form is closed */
	$("#final_submit").unbind("click");
	$("#final_submit").click(function() {
		var conf = confirm("Are you sure you want to submit?\nIf you submit any other scores under your same name, they will overwite these ones.");
		if (conf) {

			/* POST is used here because GET complained about the size of the data being sent */
			$.post("php/save_scores.php", {scores: JSON.stringify(scores),name: judge}, function(data) {
				window.location.href = "index.html";
			});
		}
	});
}

/* Make sure that the user is a logged in judge */
$.get('php/check_session.php', function(data) {
	if (data == "new" || data == "no") window.location.href = "index.html";
});

/* Populate the session information with the data corresponding to the key that was input */
$.get('php/get_session_info.php', function(data) {
	/* If session info was not found */
	if (data == "Unable to get session info") {
		alert("There was an issue. Please try again or contact the session chair");
		return;
	}

	/* If there was no key in the session */
	if (data == "no key") {
		alert("The key was incorrect. Please contact the session chair");
		return;
	}
	if (data != "Not logged in" && data!= '') {
		session_info = JSON.parse(data);
		$("#session").text(session_info['session'] + " - " + session_info['room']);

		/* Ask for judge's name */
		$("#judge").append("<div class='form-group'><input role='form' type='text' class='form-control' placeholder='Insert Your Name' id='judgename' autofocus></div><input id='name' class='btn btn-primary' type='submit'>");
		$("#judgename").attr("autocomplete", "off");

		/* When the judge submits their name... */
		$("#name").click(function() {
			judge = $("#judgename").val();

			/* Make sure that no judge by the same name is in the system */
			$.get("php/check_judge.php",{name:judge}, function(data) {

				/* If the user is not a logged in judge */
				if (data == "die")
					window.location = "index.html";

				/* If this is the first judge by this name, get the presentations */
				if (data == "no") {
					$("#judge").html("");
					$("#judge").append("<h3 id='judgename' class='title'></h3>");
					$("#judgename").text(judge);
					get_pres();

				/* If the judge is already in the system this year, ask if they want to continue */
				} else if (data == "yes") {
					var check = confirm("Your name is already in the system. Perhaps you've already submitted scores?\nIf you would like to continue, overwriting your previous submitted scores, press OK.\nOtherwise, please press cancel and give a different name.")

					/* If they want to continue, get the presentations */
					if (check) {
						$("#judge").html("");
						$("#judge").append("<h3 id='judgename' class='title'></h3>");
						$("#judgename").text(judge);
						get_pres();

					/* Otherwise, clear the judge name */
					} else {
						$("#judgename").val("").focus();
					}
				}
			});
			return false;
		});
	} else {
		window.location.href = "index.html";
	}
});

/*
 * This function gets the presentations and populate the page with their information
 */
function get_pres() {
	$.get('php/get_presentations.php', function(data) {
		if (data == "Unable to get presentations") {
			alert("There was no configuration file. Please alert the  session chair");
			return;
		}
		data = JSON.parse(data);
		data = data["presentations"];
		presentations = data;
		var empty = [];

		/* Initialize an array with NaN */
		for (var i = 0; i<scoring.length; i++) {
			empty.push(NaN);
		}

		/* Initialize the scores with empty variables */
		for (var i = 0, len = data.length; i<len; i++) {
			scores.push({'values':empty, 'considerations':[],'comments':''});
			$("#presentations").append("<div class='pres' id='"+parseInt(i)+"'></div>");
			$("#"+parseInt(i)).append("<div class='prestitle'>"+parseInt(i+1)+". "+data[i]["title"]+"</div>");
			var members = data[i]["members"];

			/* Concatenate the array of members into one string */
			var members_string = names2string(members);
			$("#"+parseInt(i)).append("<div class='members'>Presenters: "+members_string+"</div>");

			/* When hovering, change the color */
			$("#"+parseInt(i)).hover(function(){
					if ($(this).css("background-color") == "rgb(204, 204, 204)") {
						$(this).css("background", "white");
					} else if ($(this).css("background-color") == "rgb(204, 102, 102)") {
						$(this).css("background", "#df9f9f");
					} else if ($(this).css("background-color") == "rgb(102, 204, 102)") {
						$(this).css("background", "#9fdf9f");
					}
				}, function(){
					if ($(this).css("background-color") == "rgb(255, 255, 255)") {
						$(this).css("background", "#ccc");
					} else if ($(this).css("background-color") == "rgb(223, 159, 159)") {
						$(this).css("background", "#c66");
					} else if ($(this).css("background-color") == "rgb(159, 223, 159)") {
						$(this).css("background", "#6c6");
					}
			});

			/* If the user clicks on a presentations, bring up the form for it */
			$("#"+parseInt(i)).click(function() {
				evaluate(this);
			});
		}

		/* Add the final submit button */
		$("body").append("<button id='final_submit' class='btn btn-primary'>Submit</button>");
		$("#final_submit").click(function() {
			var conf = confirm("Are you sure you want to submit?\nIf you submit any other scores under your same name, they will overwite these ones.");
			if (conf) {

				/* POST is used here because GET complained about the size of the data being sent */
				$.post("php/save_scores.php", {scores: JSON.stringify(scores),name: judge}, function(data) {
					window.location.href = "index.html";
				});
			}
		});
	});
}
