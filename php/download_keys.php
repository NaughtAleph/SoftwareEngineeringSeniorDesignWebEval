<?php
	session_start();
	if($_SESSION['admin'] == 1) {
		header("Content-Type: application/octet-stream");
		header("Content-Transfer-Encoding: Binary");
		header("Content-disposition: attachment; filename=\"secrets/".date("Y")."/keys.csv\"");
		readfile('secrets/'.date("Y").'/keys.csv');
	} else {
		die("die");
	}
?>
