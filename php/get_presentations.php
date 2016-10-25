<?php
	session_start();
	if($_SESSION['login'] == 1) {
		$key = $_SESSION['key'];
		$string = file_get_contents(__DIR__ . "/secrets/presentations.json") or die("Unable to get presentations.");
		$json = json_decode($string, true);
		$ret = [];
		foreach($json['presentations'] as $pres) {
			if ($pres['key'] == $key) {
				array_push($ret, $pres);
			}
		}
		usort($ret, function($a, $b) {
			return ($a["number"] < $b["number"]) ? -1 : 1;
		});
		foreach ($ret as &$r) {
			unset($r['key']);
		}
		echo '{"presentations":' . json_encode($ret) . "}";
	}
?>
