<?php
	if ($_SERVER['REQUEST_METHOD'] == "GET") {
		session_start();
		if($_SESSION['admin'] == 1) {
			$year = $_GET["year"];
			if (!ctype_digit($year)) {
				header("Location: ../admin.html");
				die();
			}
			$files = scandir("scores/".$year);
			array_shift($files);
			array_shift($files);
			echo json_encode($files);
		}
	}
?>
