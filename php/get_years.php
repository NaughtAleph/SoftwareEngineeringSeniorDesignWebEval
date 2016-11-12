<?php
	session_start();
	if($_SESSION['admin'] == 1) {
		$years = scandir("scores");
		array_shift($years);
		array_shift($years);
		echo json_encode($years);
	}
?>
