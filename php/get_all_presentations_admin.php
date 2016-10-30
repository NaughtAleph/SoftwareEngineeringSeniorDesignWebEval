<?php
	session_start();
	if($_SESSION['admin'] == 1) {
		$string = file_get_contents(__DIR__ . "/secrets/presentations.json") or die("Unable to get presentations.");
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
	}
?>
