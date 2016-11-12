<?php
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		session_start();
		if($_SESSION['admin'] == 1) {
			$year = $_GET["year"];
			if (!ctype_digit($year)) {
				header("Location: ../admin.html");
				die;
			}
			header("Location: ../search.html?year=".$year);
			die;
		}
	}
?>
