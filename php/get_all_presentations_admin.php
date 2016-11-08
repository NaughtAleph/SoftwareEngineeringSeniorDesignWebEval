<?php
	session_start();
	if($_SESSION['admin'] == 1) {
		if (!array_key_exists("year",$_GET))
			die("die");
		$year = $_GET["year"];
		if (!ctype_digit($year))
			die("die");
		if (!in_array($year, scandir("secrets")))
			die("die");
		
		$string = file_get_contents("secrets/".$year."/presentations.json") or die("Unable to get presentations.");
		$json = json_decode($string, true);
		$pres = $json["presentations"];
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
