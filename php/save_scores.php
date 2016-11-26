<?php
	$scores = json_decode($_POST["scores"]);
	$name = $_POST["name"];
	session_start();
	if($_SESSION['login'] == 1) {
		$key = $_SESSION['key'];
		$year = date("Y");
		if (!file_exists("scores/".$year))
			mkdir("scores/".$year, 0700);

		function sanitize($string, $force_lowercase = true, $anal = false) {
			$strip = array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "=", "+", "[", "{", "]",
				"}", "\\", "|", ";", ":", "\"", "'", "&#8216;", "&#8217;", "&#8220;", "&#8221;", "&#8211;", "&#8212;",
				"â€”", "â€“", ",", "<", ">", "/", "?");
			$clean = trim(str_replace($strip, "", strip_tags($string)));
			//$clean = preg_replace('/\s+/', "-", $clean);
			$clean = ($anal) ? preg_replace("/[^a-zA-Z0-9]/", "", $clean) : $clean ;
			return ($force_lowercase) ?
			(function_exists('mb_strtolower')) ?
			mb_strtolower($clean, 'UTF-8') :
			strtolower($clean) :
			$clean;
		}
		file_put_contents("scores/".$year."/".$key."_".sanitize($name, false, false).".json", json_encode($scores));
		unset($_SESSION['login']);
		unset($_SESSION['key']);
	}
?>
