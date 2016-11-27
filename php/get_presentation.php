<?php

/* Connects the considerations to their full text */
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

/* This function forms a string from an array of strings (names) */
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

/* Always check that the SESSION has the key 'admin' */
if (!array_key_exists('admin',$_SESSION)) {
	header("Location: ../login.html");
}

/* Always check that the caller is logged in */
if ($_SESSION["admin"] != 1) {
	header("Location: login.html");
}

/* Always check that the correct variables are passed through GET */
if (!array_key_exists("key", $_GET) || !array_key_exists("num", $_GET) || !array_key_exists("key", $_GET)) {
	header("Location: search.html?year=".$year);
}
$year = $_GET["year"];
$key = $_GET["key"];
$num = $_GET["num"];

/* If someone changes the year, revert them back to the search page */
if (!in_array($year, $years))
	header("Location: search.html?year=".$year);
	
/* Get the presentations */
$presentations = file_get_contents("secrets/".$year."/presentations.json");
$presentations = json_decode($presentations);
$sessions = $presentations->sessioninfo;
$presentations = $presentations->presentations;
$pres = "";

/* If there is no key that matches any in the sessions, revert back to search page */
if (!array_key_exists($key, $sessions) || $num <= 0)
	header("Location: search.html?year=".$year);

/* Find the correct presentation */
foreach ($presentations as $p) {
	if ($p->key == $key && $p->number == $num) {
		$pres = $p;
		break;
	}
}
$sess = $sessions->$key;

$files = glob("scores/".$year."/".$key."*");
$scores = [];
$names = [];

/* Get all the files with the correct key, get their scores and judge name */
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

/* Sort the scores for this presentation into a variables */
foreach ($scores as $s) {
	if ($num > count($s))
		header("Location: search.html?year=".$year);
	$total = 0;

	/* Put the values into their variable, and add totals */
	foreach ($s[$num-1]->values as $n=>$v) {
		if ($v == null) $v = "unscored";
		array_push($values[$n], $v);
		$total += $v;
	}
	$c = [];

	/* Put considerations into their variable */
	foreach ($s[$num-1]->considerations as $x) {
		array_push($c, $consider_keys[$x]);
	}
	array_push($considerations, $c);
	array_push($comments, $s[$num-1]->comments);
	array_push($totals, $total);
}

$mem_str = form_string($pres->members);
$ad_str = form_string($pres->advisors);

/* Make the return variable */
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
?>
