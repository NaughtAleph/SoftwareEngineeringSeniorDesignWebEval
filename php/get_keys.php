<?php
	session_start();
	if($_SESSION['admin'] == 1) {
		if (!array_key_exists("num",$_GET))
			die("die");
		if (!array_key_exists("s",$_GET))
			die("die");
		$num = $_GET["num"];
		$s = $_GET["s"];
		if (!ctype_digit($num))
			die("die");
		$selectors = ['a','b','c','d','e','f','g','i','j','k','m','p','q','r','s','t','w','x','y','z','A','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','T','W','X','Y','3','4','6','7','9'];
		$keys = [];
		$k = [];
		for ($i=0; $i<$num; $i++) {
			$key = "";
			for ($j=0; $j<12; $j++) {
				$key = $key.$selectors[array_rand($selectors)];
			}
			if (array_key_exists($key, $keys))
				$i--;
			else {
				$keys[$s[$i]] = $key;
				array_push($k, $key);
			}
		}
		$tf = ["sessionkeys" =>$k];
		if (!file_exists("secrets/".date("Y")))
			mkdir("secrets/".date("Y"), 0700);
		file_put_contents("secrets/".date("Y")."/sessionkeys.json",json_encode($tf));
		$string = "Session,Key";
		foreach ($keys as $k=>$v) {
			$string = $string."\n".$k.",".$v;
		}
		file_put_contents("secrets/".date("Y")."/keys.csv", $string);
		echo json_encode($keys);
		//header("Content-Type: application/octet-stream");
		//header("Content-Transfer-Encoding: Binary");
		//header("Content-disposition: attachment; filename=\"secrets/".date("Y")."/keys.csv\"");
		//readfile('secrets/'.date("Y").'/keys.csv');
		//unlink('secrets/'.date("Y").'/keys.csv');
	} else {
		die("die");
	}
?>
