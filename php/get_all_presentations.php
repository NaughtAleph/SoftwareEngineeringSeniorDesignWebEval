<?php
	session_start();
	if($_SESSION['admin'] == 1) {
		$string = file_get_contents(__DIR__ . "/secrets/presentations.json") or die("Unable to get presentations.");
		$json = json_decode($string, true);
		$json = $json["presentations"];
		usort($json, function($a, $b) {
			if ($a["key"] == $b["key"]) {
				return ($a["number"] < $b["number"]) ? -1 : 1;
			}
			return ($a["key"] < $b["key"]) ? -1 : 1;
		});
		echo '{"presentations":' . json_encode($json) . "}";
	}
?>
