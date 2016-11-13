<?php
	session_start();
	if($_SESSION['admin'] == 1) {
		if (!array_key_exists("data",$_GET))
			die("die");
		$data = $_GET["data"];
		file_put_contents("secrets/".date("Y")."/presentations.json", $data);
	} else {
		die("die");
	}
?>
