<?php
	$scores = json_decode($_POST["scores"]);
	$name = $_POST["name"];
	session_start();
	if($_SESSION['login'] == 1) {
		$key = $_SESSION['key'];
		$year = date("Y");
		file_put_contents("scores/".$year."/".$key."_".$name.".json", json_encode($scores));
		unset($_SESSION['login']);
		unset($_SESSION['key']);
	}
?>
