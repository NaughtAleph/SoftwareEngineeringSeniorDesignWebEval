<?php
session_start();

/* Always check that the SESSION has the key 'login' */
if (!array_key_exists('login',$_SESSION)) {
	header("Location: ../index.html");
}

/* Always check that the SESSION has the key 'key' */
if (!array_key_exists('key', $_SESSION)) {
	header("Location: ../index.html");
}

/* Always check that the caller is logged in */
if($_SESSION['login'] == 1) {
	$key = $_SESSION['key'];
	$year = date("Y");
	$string = file_get_contents("secrets/".$year."/presentations.json") or die("Unable to get presentations");
	$json = json_decode($string, true);
	$ret = [];

	/* Iterate through presentations and add those that match the same key */
	foreach($json['presentations'] as $pres) {
		if ($pres['key'] == $key) {
			array_push($ret, $pres);
		}
	}

	/* Sort by presentation order */
	usort($ret, function($a, $b) {
		return ($a["number"] < $b["number"]) ? -1 : 1;
	});

	/* Remove the key, the judge doesn't need that information */
	foreach ($ret as &$r) {
		unset($r['key']);
	}
	echo '{"presentations":' . json_encode($ret) . "}";
}
?>
