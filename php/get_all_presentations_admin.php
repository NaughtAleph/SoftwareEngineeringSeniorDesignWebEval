<?php
session_start();

/* Always check that the SESSION has the key 'admin' */
if (!array_key_exists('admin',$_SESSION)) {
        header("Location: ../index.html");
}

/* Always check that the caller is logged in */
if($_SESSION['admin'] == 1) {

	/* Check that the GET has the key 'year' */
	if (!array_key_exists("year",$_GET))
		die("die");
	$year = $_GET["year"];

	/* Check that the year is a number */
	if (!ctype_digit($year))
		die("die");

	/* Check that the year is in the folder */
	if (!in_array($year, scandir("secrets")))
		die("die");

	$string = file_get_contents("secrets/".$year."/presentations.json") or die("Unable to get presentations.");
	$json = json_decode($string, true);
	$pres = $json["presentations"];

	/* Sort the presentations by their key, and then by their position */
	usort($pres, function($a, $b) {
		if ($a["key"] == $b["key"]) {
			return ($a["number"] < $b["number"]) ? -1 : 1;
		}
		return ($a["key"] < $b["key"]) ? -1 : 1;
	});
	$json["presentations"] = $pres;
	echo json_encode($json);
} else {
	die("die");
}
?>
