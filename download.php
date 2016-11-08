<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" type="text/css" href="css/template.css" />
</head>
<body>
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

	$years = scandir("php/scores");


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
		


	$presentations = file_get_contents("php/secrets/".$year."/presentations.json");
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



	$files = glob("php/scores/".$year."/".$key."*");
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
	echo "<script>console.log(".json_encode($names).");</script>";
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
			array_push($values[$n], $v);
			$total += $v;
		}
		array_push($considerations, $s[$num-1]->considerations);
//		foreach ($s[$num-1]->considerations as $c) {
//			if (!in_array($c, $considerations))
//				array_push($considerations, $c);
//		}
		array_push($comments, $s[$num-1]->comments);
		array_push($totals, $total);
	}

	$mem_str = form_string($pres->members);
	$ad_str = form_string($pres->advisors);
?>
	<h1>Project Evaluation Form</h1>
	<div>Session: <?php echo $sess->session; ?></div>
	<div>Room: <?php echo $sess->room; ?></div>
	<br>
	<div>Project Title: <b><?php echo $pres->title; ?></b></div>
	<div>Group Members: <b><?php echo $mem_str; ?></b></div>
	<div>Advisors: <b><?php echo $ad_str; ?></b></div>
	<br>
	<div>Please evaluate senior engineering design projects and presentations using the following point system:
		<div class='tab'>
                5 = Excellent (at the level of an entry-level engineer you would hire<br>
                4 = Good (at the level of an accomplished college senior)<br>
                3 = Average (at the level typical of a college senior)<br>
                2 = Below Average (not up to the expectations for a college senior)<br>
                1 = Poor (significant errors or omissions)<br>
                N/A if no appropriate score applies
		</div>
	</div>
	<br>
	<table>
		<tbody>
		<tr class='title'><td>Design Project</td>
		<?php foreach ($names as $n) echo "<td>".htmlspecialchars($n)."</td>";?></tr>
		<tr><td>Technical Accuracy</td>
		<?php foreach ($values[0] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Creativity and Innovation</td>
		<?php foreach ($values[1] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Supporting Analytical Work</td>
		<?php foreach ($values[2] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Methodical Design Process Demonstrated</td>
		<?php foreach ($values[3] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Addresses Project Complexity Appropriately</td>
		<?php foreach ($values[4] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Expectation of Completion (by term's end)</td>
		<?php foreach ($values[5] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Design &amp; Analysis of tests</td>
		<?php foreach ($values[6] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Quality of Response during Q&amp;A</td>
		<?php foreach ($values[7] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr class='title'><td colspan="0">Presentation</td></tr>
		<tr><td>Organization</td>
		<?php foreach ($values[8] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Use of Allotted Time</td>
		<?php foreach ($values[9] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Visual Aids</td>
		<?php foreach ($values[10] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr><td>Confidence and Poise</td>
		<?php foreach ($values[11] as $v) echo "<td>".($v=="" ? "N/A" : $v)."</td>"; ?></tr>
		<tr class='title'><td>Totals</td>
		<?php foreach ($totals as $t) echo "<td>".$t."</td>"; ?></tr>
		<tr><td>Considerations</td>
		<?php 
			foreach ($considerations as $cons) {
				$str = "";
				foreach ($cons as $c) $str = $str."<li>".htmlspecialchars($c)."</li>";
				echo "<td><ul>".$str."</ul></td>";
			}
		?></tr>
		<tr><td>Comments</td>
		<?php foreach ($comments as $c) echo "<td>".htmlspecialchars($c)."</td>"; ?></tr> 
		</tbody>
	</table>
</body>
</html>
