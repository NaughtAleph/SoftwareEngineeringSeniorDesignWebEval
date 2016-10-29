<?php
	session_start();
	if($_SESSION['login'] == 1) {
		$key = $_SESSION['key'];
		$string = file_get_contents(__DIR__ . "/secrets/presentations.json") or die("Unable to get session info.");
		$json = json_decode($string, true);
		foreach($json['sessioninfo'] as $k => $sess) {
			if ($k == $key) {
				echo json_encode($sess);
				die();
			}
		}
	}
	else {
		echo "Not logged in";
	}
?>
