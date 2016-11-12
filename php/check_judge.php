<?php
	session_start();
	if (!array_key_exists("login", $_SESSION)) {
		die("die");
	}
	if (!array_key_exists("name", $_GET)) {
		die("die");
	}
	if ($_SESSION["login"] == 1) {
		$year = date("Y");
		if (file_exists("scores/".$year."/".$_SESSION["key"]."_".$_GET["name"].".json"))
			die("yes");
		die("no");
	} else {
		die("die");
	}
?>
