<?php
//	session_start();
//	if ($_SESSION["admin"] == 1) {
		$presentations = file_get_contents("secrets/presentations.json") or die("Unable to get presentations");
		$presentations = json_decode($presentations);
		$presentations = $presentations->presentations;


		$keys = [];
		foreach ($presentations as $p) {
			if (!in_array($p->key, $keys)) {
				array_push($keys, $p->key);
			}
		}
		echo json_encode($keys);
//	}
?>
