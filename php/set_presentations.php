<?php
	session_start();
	if($_SESSION['admin'] == 1) {
		if (!array_key_exists("data",$_POST))
			die("die");
		$data = $_POST["data"];
		file_put_contents("secrets/".date("Y")."/presentations.json", $data);
	} else {
		die("die");
	}
?>
