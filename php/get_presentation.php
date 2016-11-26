<?php
	$consider_keys = [
		"econ" => "Economic",
		"envi" => "Environmental",
		"sust" => "Sustainability",
		"manu" => "Manufacturability",
		"ethi" => "Ethical",
		"hands" => "Health and Safety",
		"soci" => "Social",
		"poli" => "Political",
	];

	function form_string($arr) {
		$arr_str = "";
		$alen = count($arr);
		if ($alen > 0) $arr_str = $arr[0];
		for ($i = 1; $i<$alen-1; $i++)
			$arr_str = $arr_str . ", " . $arr[$i];
		if ($alen > 2)
			$arr_str = $arr_str . ",";
		if ($alen > 1)
			$arr_str = $arr_str . " and " . $arr[$alen-1];
		return $arr_str;
	}

	$years = scandir("scores");


	session_start();
	if ($_SESSION["admin"] != 1) {
		header("Location: index.html");
	}
	if (!array_key_exists("key", $_GET) || !array_key_exists("num", $_GET) || !array_key_exists("key", $_GET)) {
		header("Location: search.html?year=".$year);
	}
	$year = $_GET["year"];
	$key = $_GET["key"];
	$num = $_GET["num"];

	if (!in_array($year, $years))
		header("Location: search.html?year=".$year);
		


	$presentations = file_get_contents("secrets/".$year."/presentations.json");
	$presentations = json_decode($presentations);
	$sessions = $presentations->sessioninfo;
	$presentations = $presentations->presentations;
	$pres = "";
	foreach ($presentations as $p) {
		if ($p->key == $key && $p->number == $num) {
			$pres = $p;
			break;
		}
	}
	$sess = $sessions->$key;

	if (!array_key_exists($key, $sessions) || $num <= 0)
		header("Location: search.html?year=".$year);



	$files = glob("scores/".$year."/".$key."*");
	$scores = [];
	$names = [];
	foreach ($files as $f) {
		$matches = [];
		$contents = file_get_contents($f);
		$contents = json_decode($contents);
		array_push($scores, $contents);
		$base = basename($f, ".json");
		preg_match("/_(.*)/", $base, $matches);
		array_push($names, $matches[1]);
	}
	$values = [[],[],[],[],[],[],[],[],[],[],[],[]];
	$totals = [];
	$considerations = [];
	$cons = [];
	$comments = [];
	//$scores = json_decode(json_encode($scores), true);
	foreach ($scores as $s) {
		if ($num > count($s))
			header("Location: search.html?year=".$year);
		$total = 0;
		foreach ($s[$num-1]->values as $n=>$v) {
			if ($v == null) $v = "unscored";
			array_push($values[$n], $v);
			$total += $v;
		}
		$c = [];
		foreach ($s[$num-1]->considerations as $x) {
			array_push($c, $consider_keys[$x]);
		}
		array_push($considerations, $c);
		//array_push($considerations, $s[$num-1]->considerations);
//		foreach ($s[$num-1]->considerations as $c) {
//			if (!in_array($c, $considerations))
//				array_push($considerations, $c);
//		}
		array_push($comments, $s[$num-1]->comments);
		array_push($totals, $total);
	}

	$mem_str = form_string($pres->members);
	$ad_str = form_string($pres->advisors);
	$finalcombo = array_combine($names, $comments);
	


	$return = [];
	$return["session"] = $sess->session;
	$return["room"] = $sess->room;
	$return["title"] = $pres->title;
	$return["members"] = $mem_str;
	$return["advisors"] = $ad_str;
	$return["judges"] = $names;
	$return["scores"] = $values;
	$return["totals"] = $totals;
	$return["considerations"] = $considerations;
	$return["comments"] = $comments;
	echo json_encode($return);
	die;
?>
<div class="container" style="font-size: 20px">
	<div class="row">
		<div class="col-xs-11">
			<p id = 'img' style="float: left;">
				<!--<img src="sculogo.jpg" style='height:120px; width:100px;' alt="SCU Logo" height="120px" width="100px" />-->
			</p>
			<div id="center">
				<br />
				<p style="text-align:center;"><b>Santa Clara University<br />School of Engineering Senior Design Conference Project<br/></b></p>
				<p style="text-align:center;"><b>PROJECT EVALUATION FORM</b></p>
			</div>
		</div>
		<div class="col-xs-12">
			<div id="firsttab">
				<div><b>Session:</b> <?php echo $sess->session; ?></div>
				<div><b>Room &#35;:</b> <?php echo $sess->room; ?></div>
			</div>
			<br />
			<div id="greyback">
				<div>Project Title: <b><?php echo $pres->title; ?></b></div>
				<div>Group Members: <b><?php echo $mem_str; ?></b></div>
				<div>Advisors: <b><?php echo $ad_str; ?></b></div>
			</div>
			<br />
		</div>
		<div class="col-xs-12">
			<div><b>Please evaluate senior engineering design projects and presentations using the following point system:</b>
				<div id="secondtab">5 = Excellent (at the level of an entry-level engineer you would hire</div>
		                <div id="secondtab">4 = Good (at the level of an accomplished college senior)</div>
		                <div id="secondtab">3 = Average (at the level typical of a college senior)</div>
		                <div id="secondtab">2 = Below Average (not up to the expectations for a college senior)</div>
		                <div id="secondtab">1 = Poor (significant errors or omissions)</div>
				<div id="secondtab">N/A if no appropriate score applies</b></div>
			</div>
			<br />
			<table>
				<tbody>
				<tr class='title'><td class="col-xs-7"><b><u>Design Project</u></b></td>
				<?php foreach ($names as $n) echo "<td id='center'><b>".htmlspecialchars($n)."&nbsp; </b></td>";?></tr>
				<tr><td class="col-xs-7">Technical Accuracy</td>
				<?php foreach ($values[0] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr><td class="col-xs-7">Creativity and Innovation</td>
				<?php foreach ($values[1] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr><td class="col-xs-7">Supporting Analytical Work</td>
				<?php foreach ($values[2] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr><td class="col-xs-7">Methodical Design Process Demonstrated</td>
				<?php foreach ($values[3] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr><td class="col-xs-7">Addresses Project Complexity Appropriately</td>
				<?php foreach ($values[4] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr><td class="col-xs-7">Expectation of Completion (by term's end)</td>
				<?php foreach ($values[5] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr><td class="col-xs-7">Design &amp; Analysis of tests</td>
				<?php foreach ($values[6] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr><td class="col-xs-7">Quality of Response during Q&amp;A</td>
				<?php foreach ($values[7] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				</tbody>
			</table>
			<table>
				<tbody>
				<tr class='title'><td colspan="0" class="col-xs-7"><b><u>Presentation</u></b></td>
				<?php foreach ($names as $n) echo "<td id='center'><b>".htmlspecialchars($n)."&nbsp; </b></td>";?></tr>
				<tr><td class="col-xs-7" style='width:420px;'>Organization</td>
				<?php foreach ($values[8] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr><td class="col-xs-7">Use of Allotted Time</td>
				<?php foreach ($values[9] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr><td class="col-xs-7">Visual Aids</td>
				<?php foreach ($values[10] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr class="border_bottom"><td class="col-xs-7">Confidence and Poise</td>
				<?php foreach ($values[11] as $v) echo "<td id='center'>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
				<tr class='title'><td class="col-xs-7"><b>TOTALS:</b></td>
				<?php foreach ($totals as $t) echo "<td id='center'><b>".$t."</b></td>"; ?></tr>
					<tr><td>&nbsp;</td></tr>
				<tr><td class="col-xs-7"><b><u>Considerations:</u></b></td>
				<?php
					foreach ($considerations as $cons) {
						$str = "";
						foreach ($cons as $c) $str = $str."<li>".htmlspecialchars($consider_keys[$c])."</li>";
						echo "<td><ul>".$str."</ul></td>";
					}
				?></tr>
				</tbody>
			</table>
			<div id="thirdtab">
			<div><b><u>Comments:</u></b></div><br />
			<?php foreach ($finalcombo as  $name => $comment) echo "<div><b>".htmlspecialchars($name).":</b> ".htmlspecialchars($comment)."</div><br />";?>
			</div>
		</div>
	</div>
</div>
<script src="js/jspdf/jspdf.debug.js"></script>
<script src="js/jspdf/html2pdf.js"></script>
<script src="js/jspdf/html2canvas.js"></script>
<script>
	$("img").hide();
	var specialElementHandlers = {
		'#bypass': function(element, renderer) {
			return true;
		}
	};
	var doc = new jsPDF();
	doc.setFontSize(12);
	doc.fromHTML($('body>.container').html(), 15, 15, {
		'width': 170,
		'elementHandlers': specialElementHandlers
	}, function(out) {
		var img = new Image();
		img.src = 'sculogo.jpg';
		img.onload = function() {
			doc.setPage(1);
			doc.addImage(img, 'jpg',15,10,30,36);
			//doc.deletePage(2);
			doc.save('thing.pdf');
		};
		$("#img").html('<img src="sculogo.jpg" alt="SCU Logo" height="120px" width="100px" />');
	});
</script>
</body>
</html>
