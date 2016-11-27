<?php
session_start();

/* Always check that the SESSION has the key 'judge' */
if (!array_key_exists('login',$_SESSION)) {
	die("no key");
}

/* Always check that the caller is a judge */
if($_SESSION['login'] == 1) {
	if (!array_key_exists('key',$_SESSION))
		die("no key");
	$key = $_SESSION['key'];
	$year = date("Y");
	$string = file_get_contents("secrets/".$year."/presentations.json") or die("Unable to get session info");
	$json = json_decode($string, true);

	/* Return the session information for just the key in the session */
	foreach($json['sessioninfo'] as $k => $sess) {
		if ($k == $key) {
			echo json_encode($sess);
			die();
		}
	}
}
else {
	echo "Not logged in";
}
?>
