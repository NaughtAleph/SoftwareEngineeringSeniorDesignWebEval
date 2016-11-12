<?php
	session_start();
	if($_SESSION['admin'] == 1) {
		if (!array_key_exists("num",$_GET))
			die("die");
		$num = $_GET["num"];
		if (!ctype_digit($num))
			die("die");
		$selectors = ['a','b','c','d','e','f','g','i','j','k','m','n','p','q','r','s','t','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','T','W','X','Y','3','4','6','7','8','9'];
		$keys = [];
		for ($i=0; $i<$num; $i++) {
			$key = "";
			for ($j=0; $j<12; $j++) {
				$key = $key.$selectors[array_rand($selectors)];
			}
			if (in_array($key, $keys))
				$i--;
			else
				array_push($keys, $key);
		}
		echo json_encode($keys);
	} else {
		die("die");
	}
?>
