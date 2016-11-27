<?php
session_start();

/* Always check that the SESSION has the key 'admin' */
if (!array_key_exists('admin',$_SESSION)) {
	header("Location: ../login.html");
}

/* Always check that the caller is an admin */
if($_SESSION['admin'] == 1) {

	/* Make sure that the num key is passed through GET */
	if (!array_key_exists("num",$_GET))
		die("die");

	/* Make sure that the s key is passed through GET */
	if (!array_key_exists("s",$_GET))
		die("die");

	$num = $_GET["num"];
	$s = $_GET["s"];

	/* Make sure that the num passed through GET is a number */
	if (!ctype_digit($num))
		die("die");

	/* Everything that a key can be made from.					*/
	/* Excludes anything that can be confused for anything else (e.g. 0 and O)	*/
	$selectors = ['a','b','c','d','e','f','g','i','j','k','m','p','q','r','s','t','w','x','y','z','A','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','T','W','X','Y','3','4','6','7','9'];
	$keys = [];
	$k = [];

	/* Iterate through sessions and generate a 12 character key */
	for ($i=0; $i<$num; $i++) {
		$key = "";
		for ($j=0; $j<12; $j++) {
			$key = $key.$selectors[array_rand($selectors)];
		}

		/* If the key already exists this year, try again */
		if (array_key_exists($key, $keys))
			$i--;
		else {
			$keys[$s[$i]] = $key;
			array_push($k, $key);
		}
	}

	/* JSON object to put into the config file */
	$tf = ["sessionkeys" =>$k];

	/* If there isn't already a directory of the current year, make one */
	if (!file_exists("secrets/".date("Y")))
		mkdir("secrets/".date("Y"), 0700);

	/* Create (or overwrite) the sessionkeys file with new session keys */
	file_put_contents("secrets/".date("Y")."/sessionkeys.json",json_encode($tf));

	/* Make a keys.csv file available for download */
	$string = "Session,Key";
	foreach ($keys as $k=>$v) {
		$string = $string."\n".$k.",".$v;
	}
	file_put_contents("secrets/".date("Y")."/keys.csv", $string);
	echo json_encode($keys);
} else {
	die("die");
}
?>
